import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import { GameRoom, GameState, Player, ChatMessage, Notification } from '@/types/game';
import DrawingCanvas from '@/components/DrawingCanvas';
import ChatBox from '@/components/ChatBox';
import PlayerList from '@/components/PlayerList';
import Scoreboard from '@/components/Scoreboard';
import Timer from '@/components/Timer';
import JoinRequestModal from '@/components/JoinRequestModal';
import GameNotifications from '@/components/GameNotifications';
// @ts-ignore
import confetti from 'canvas-confetti';

export default function GameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const playerName = location.state?.playerName || '';
  const isHost = location.state?.isHost || false;

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState<Player[]>([]);

  const canvasRef = useRef<any>(null);

  // Add notification
  const addNotification = (type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (!socket || !roomId) {
      navigate('/');
      return;
    }

    setCurrentPlayerId(socket.id || '');

    // Get initial room state
    socket.emit('room:state', { roomId }, (response: any) => {
      if (response.success) {
        setRoom(response.room);
      }
    });

    // Socket event listeners
    socket.on('player:joined', (data: any) => {
      setRoom(prev => prev ? { ...prev, players: data.players } : null);
      addNotification('info', `${data.player.name} joined the room`);
    });

    socket.on('player:left', (data: any) => {
      setRoom(prev => prev ? { ...prev, players: data.players } : null);
      addNotification('warning', `${data.playerName} left the room`);
    });

    socket.on('join:request', (data: any) => {
      setShowJoinRequests(true);
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          joinRequests: [...prev.joinRequests, { id: data.playerId, name: data.playerName }]
        };
      });
    });

    socket.on('game:started', () => {
      setRoom(prev => prev ? { ...prev, gameState: GameState.PLAYING } : null);
      addNotification('success', 'Game started!');
    });

    socket.on('round:start', (data: any) => {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentDrawer: data.drawerId,
          roundNumber: data.roundNumber,
          roundTimer: data.timer,
          gameState: GameState.PLAYING
        };
      });
      setCurrentWord(null);
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
      addNotification('info', `Round ${data.roundNumber}: ${data.drawerName} is drawing!`);
    });

    socket.on('word:assigned', (data: any) => {
      setCurrentWord(data.word);
      addNotification('success', `Your word: ${data.word}`);
    });

    socket.on('timer:update', (data: any) => {
      setRoom(prev => prev ? { ...prev, roundTimer: data.timer } : null);
    });

    socket.on('draw:update', (data: any) => {
      if (canvasRef.current) {
        canvasRef.current.drawFromData(data.data);
      }
    });

    socket.on('draw:cleared', () => {
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    });

    socket.on('chat:message', (_message: ChatMessage) => {
      // Handled by ChatBox component
    });

    socket.on('guess:correct', (data: any) => {
      setRoom(prev => prev ? { ...prev, players: data.players } : null);
      addNotification('success', `${data.playerName} guessed the word: ${data.word}!`);
      triggerConfetti();
    });

    socket.on('round:end', (data: any) => {
      addNotification('info', `Round ended! The word was: ${data.word}`);
    });

    socket.on('game:over', (data: any) => {
      setGameOver(true);
      setWinners(data.players);
      setRoom(prev => prev ? { ...prev, gameState: GameState.FINISHED } : null);
      addNotification('success', 'Game Over!');
      triggerConfetti();
    });

    socket.on('room:closed', () => {
      addNotification('error', 'Room closed by host');
      setTimeout(() => navigate('/'), 2000);
    });

    socket.on('error', (data: any) => {
      addNotification('error', data.message || 'An error occurred');
    });

    return () => {
      socket.off('player:joined');
      socket.off('player:left');
      socket.off('join:request');
      socket.off('game:started');
      socket.off('round:start');
      socket.off('word:assigned');
      socket.off('timer:update');
      socket.off('draw:update');
      socket.off('draw:cleared');
      socket.off('chat:message');
      socket.off('guess:correct');
      socket.off('round:end');
      socket.off('game:over');
      socket.off('room:closed');
      socket.off('error');
    };
  }, [socket, roomId, navigate]);

  const handleStartGame = () => {
    if (!socket || !roomId) return;
    socket.emit('game:start', { roomId });
  };

  const handlePlayAgain = () => {
    if (!socket || !roomId) return;
    socket.emit('game:restart', { roomId });
  };

  const handleApproveJoin = (playerId: string) => {
    if (!socket || !roomId) return;
    socket.emit('room:join:approve', { roomId, playerId });
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        joinRequests: prev.joinRequests.filter(r => r.id !== playerId)
      };
    });
  };

  const handleRejectJoin = (playerId: string) => {
    if (!socket || !roomId) return;
    socket.emit('room:join:reject', { roomId, playerId });
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        joinRequests: prev.joinRequests.filter(r => r.id !== playerId)
      };
    });
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    addNotification('success', 'Room link copied to clipboard!');
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading room...</div>
      </div>
    );
  }

  const isDrawer = room.currentDrawer === currentPlayerId;
  const canStart = isHost && room.gameState === GameState.WAITING && room.players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                🎨 Draw & Guess
              </h1>
              <p className="text-gray-600">Room: {roomId}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyRoomLink}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                📋 Copy Link
              </button>

              {canStart && (
                <button
                  onClick={handleStartGame}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
                >
                  🎮 Start Game
                </button>
              )}

              {isHost && room.joinRequests.length > 0 && (
                <button
                  onClick={() => setShowJoinRequests(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors relative"
                >
                  🔔 Requests
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {room.joinRequests.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {room.gameState === GameState.PLAYING && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-700">
                Round {room.roundNumber}
              </div>
              <Timer seconds={room.roundTimer} />
              {isDrawer && currentWord && (
                <div className="bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded-lg">
                  <span className="font-bold text-yellow-800">Your word: {currentWord}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-3xl font-bold text-center mb-6">🏆 Game Over!</h2>
              <Scoreboard players={winners} />
              <div className="mt-6 space-y-3">
                {isHost && (
                  <button
                    onClick={handlePlayAgain}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    🔄 Play Again
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Players */}
          <div className="lg:col-span-1">
            <PlayerList
              players={room.players}
              currentDrawerId={room.currentDrawer}
              currentPlayerId={currentPlayerId}
            />
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-2">
            <DrawingCanvas
              ref={canvasRef}
              roomId={roomId || ''}
              isDrawer={isDrawer}
              disabled={room.gameState !== GameState.PLAYING}
            />
          </div>

          {/* Right Sidebar - Chat */}
          <div className="lg:col-span-1">
            <ChatBox
              roomId={roomId || ''}
              currentPlayerId={currentPlayerId}
              isDrawer={isDrawer}
              disabled={room.gameState !== GameState.PLAYING}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <GameNotifications notifications={notifications} />

      {/* Join Request Modal */}
      {showJoinRequests && (
        <JoinRequestModal
          requests={room.joinRequests}
          onApprove={handleApproveJoin}
          onReject={handleRejectJoin}
          onClose={() => setShowJoinRequests(false)}
        />
      )}
    </div>
  );
}
