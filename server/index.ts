import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameRoom, Player, DrawingData, ChatMessage, GameState } from './types';
import { getRandomWords } from './wordPool';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://draw-guess-game-nine.vercel.app", // Vercel frontend
      "http://localhost:5173" // local dev
    ],
    methods: ["GET", "POST"]
  } 
});

// In-memory storage
const rooms = new Map<string, GameRoom>();

// Generate unique room ID
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialize game room
function createRoom(hostId: string, hostName: string): GameRoom {
  const roomId = generateRoomId();
  const host: Player = {
    id: hostId,
    name: hostName,
    score: 0,
    isHost: true,
    hasDrawn: false
  };

  const room: GameRoom = {
    id: roomId,
    host: hostId,
    players: [host],
    gameState: GameState.WAITING,
    currentDrawer: null,
    currentWord: null,
    roundNumber: 0,
    roundTimer: 0,
    joinRequests: [],
    drawingData: [],
    chatMessages: []
  };

  rooms.set(roomId, room);
  return room;
}

// Add player to room
function addPlayerToRoom(roomId: string, player: Player): boolean {
  const room = rooms.get(roomId);
  if (!room || room.players.length >= 6) return false;

  room.players.push(player);
  return true;
}

// Start next round
function startNextRound(roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const allDrawn = room.players.every(p => p.hasDrawn);
  if (allDrawn) {
    room.gameState = GameState.FINISHED;
    io.to(roomId).emit('game:over', {
      players: room.players.sort((a, b) => b.score - a.score)
    });
    return;
  }

  const nextDrawer = room.players.find(p => !p.hasDrawn);
  if (!nextDrawer) return;

  room.currentDrawer = nextDrawer.id;
  room.currentWord = null;
  room.roundNumber++;
  room.roundTimer = 75;
  room.drawingData = [];
  room.gameState = GameState.PLAYING;

  nextDrawer.hasDrawn = true;

  io.to(roomId).emit('round:start', {
    drawerId: nextDrawer.id,
    drawerName: nextDrawer.name,
    roundNumber: room.roundNumber,
    timer: room.roundTimer
  });

  const options = getRandomWords(4);
  io.to(nextDrawer.id).emit('word:options', { options });
}

// Round timer
function startRoundTimer(roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const interval = setInterval(() => {
    const currentRoom = rooms.get(roomId);
    if (!currentRoom || currentRoom.gameState !== GameState.PLAYING) {
      clearInterval(interval);
      return;
    }

    currentRoom.roundTimer--;
    io.to(roomId).emit('timer:update', { timer: currentRoom.roundTimer });

    if (currentRoom.roundTimer <= 0) {
      clearInterval(interval);
      endRound(roomId, false);
    }
  }, 1000);
}

// End round
function endRound(roomId: string, wordGuessed: boolean): void {
  const room = rooms.get(roomId);
  if (!room) return;

  io.to(roomId).emit('round:end', {
    word: room.currentWord,
    wordGuessed
  });

  // Wait 3 seconds before starting next round
  setTimeout(() => {
    startNextRound(roomId);
  }, 3000);
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create room
  socket.on('room:create', ({ playerName }, callback) => {
    const room = createRoom(socket.id, playerName);
    socket.join(room.id);
    callback({ success: true, roomId: room.id, room });
  });

  // Request to join room
  socket.on('room:join:request', ({ roomId, playerName }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (room.players.length >= 6) {
      callback({ success: false, error: 'Room is full' });
      return;
    }

    if (room.gameState !== GameState.WAITING) {
      callback({ success: false, error: 'Game already started' });
      return;
    }

    // Add to join requests
    room.joinRequests.push({
      id: socket.id,
      name: playerName
    });

    // Notify host
    io.to(room.host).emit('join:request', {
      playerId: socket.id,
      playerName
    });

    callback({ success: true });
  });

  // Approve join request
  socket.on('room:join:approve', ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room || socket.id !== room.host) return;

    const request = room.joinRequests.find(r => r.id === playerId);
    if (!request) return;

    const player: Player = {
      id: playerId,
      name: request.name,
      score: 0,
      isHost: false,
      hasDrawn: false
    };

    addPlayerToRoom(roomId, player);
    room.joinRequests = room.joinRequests.filter(r => r.id !== playerId);

    // Let player join the room
    io.sockets.sockets.get(playerId)?.join(roomId);

    // Notify player
    io.to(playerId).emit('join:approved', { room });

    // Notify all players
    io.to(roomId).emit('player:joined', {
      player,
      players: room.players
    });
  });

  // Reject join request
  socket.on('room:join:reject', ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room || socket.id !== room.host) return;

    room.joinRequests = room.joinRequests.filter(r => r.id !== playerId);
    io.to(playerId).emit('join:rejected');
  });

  // Start game
  socket.on('game:start', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || socket.id !== room.host) return;

    if (room.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' });
      return;
    }

    room.gameState = GameState.PLAYING;
    io.to(roomId).emit('game:started');
    startNextRound(roomId);
  });

  // Restart game
  socket.on('game:restart', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (socket.id !== room.host) {
      socket.emit('error', { message: 'Only the host can restart the game' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' });
      return;
    }

    // Reset game state
    room.gameState = GameState.PLAYING;
    room.currentDrawer = null;
    room.currentWord = null;
    room.roundNumber = 0;
    room.roundTimer = 0;
    room.drawingData = [];
    room.chatMessages = [];
    
    // Reset players
    room.players.forEach(p => {
      p.score = 0;
      p.hasDrawn = false;
    });

    // Notify all players about restart
    io.to(roomId).emit('game:restarted', { room });
    io.to(roomId).emit('game:started'); // Ensure clients know game is playing

    // Start first round
    // Small delay to ensure client state is updated
    setTimeout(() => {
      startNextRound(roomId);
    }, 1000);
  });

  socket.on('word:chosen', ({ roomId, word }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    if (socket.id !== room.currentDrawer) return;

    room.currentWord = word;

    io.to(room.currentDrawer).emit('word:assigned', {
      word: room.currentWord
    });

    startRoundTimer(roomId);
  });

  // Drawing data
  socket.on('draw:data', ({ roomId, data }) => {
    const room = rooms.get(roomId);
    if (!room || room.currentDrawer !== socket.id) return;

    room.drawingData.push(data);
    socket.to(roomId).emit('draw:update', { data });
  });

  // Clear canvas
  socket.on('draw:clear', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.currentDrawer !== socket.id) return;

    room.drawingData = [];
    io.to(roomId).emit('draw:cleared');
  });

  // Chat message / Guess
  socket.on('chat:message', ({ roomId, message }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Check if it's a correct guess
    if (
      room.gameState === GameState.PLAYING &&
      room.currentDrawer !== socket.id &&
      room.currentWord &&
      message.toLowerCase().trim() === room.currentWord.toLowerCase()
    ) {
      // Correct guess!
      const drawer = room.players.find(p => p.id === room.currentDrawer);
      
      // Award points
      player.score += 100;
      if (drawer) drawer.score += 50;

      // Notify all players
      io.to(roomId).emit('guess:correct', {
        playerId: player.id,
        playerName: player.name,
        word: room.currentWord,
        players: room.players
      });

      // End round
      endRound(roomId, true);
    } else {
      // Regular chat message
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        playerId: player.id,
        playerName: player.name,
        message,
        timestamp: Date.now()
      };

      room.chatMessages.push(chatMessage);
      io.to(roomId).emit('chat:message', chatMessage);
    }
  });

  // Get room state
  socket.on('room:state', ({ roomId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      callback({ success: false });
      return;
    }

    callback({ success: true, room });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and remove player from all rooms
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.players.splice(playerIndex, 1);

        // Notify other players
        io.to(roomId).emit('player:left', {
          playerId: socket.id,
          playerName: player.name,
          players: room.players
        });

        // If host left or no players, delete room
        if (room.host === socket.id || room.players.length === 0) {
          io.to(roomId).emit('room:closed');
          rooms.delete(roomId);
        } else if (room.currentDrawer === socket.id && room.gameState === GameState.PLAYING) {
          // If current drawer left, end round
          endRound(roomId, false);
        }
      }

      // Remove from join requests
      room.joinRequests = room.joinRequests.filter(r => r.id !== socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
