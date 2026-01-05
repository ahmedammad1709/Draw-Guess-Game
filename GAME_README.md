# 🎨 Draw & Guess Online

A fully functional online multiplayer web game where 2-6 players can join rooms to play a drawing and guessing game. Players take turns drawing while others guess the word in real-time.

## Features

- **Room System**: Host creates a room and shares a unique link with guests
- **Real-time Drawing**: Canvas with color and brush size options, synchronized across all players
- **Chat & Guessing**: Players guess the word via chat, with automatic correct guess detection
- **Scoring System**: Points awarded to first correct guesser and the drawer
- **Round Management**: Multiple rounds with each player drawing once
- **Join Requests**: Host can approve or reject join requests
- **Game Notifications**: Real-time notifications for game events
- **Confetti Animations**: Celebration effects for correct guesses
- **Mobile Responsive**: Works on desktop and mobile devices

## How to Play

### As Host:
1. Enter your name on the home page
2. Click "Create Room"
3. Share the room link with friends
4. Approve join requests from other players
5. Click "Start Game" when ready (minimum 2 players)
6. Take turns drawing and guessing!

### As Guest:
1. Open the room link shared by the host
2. Enter your name
3. Wait for host approval
4. Join the game and have fun!

### Gameplay:
- Each player takes turns being the drawer
- The drawer receives a random word and has 75 seconds to draw it
- Other players guess by typing in the chat
- First correct guess: +100 points to guesser, +50 points to drawer
- Game ends when all players have drawn once
- Winner is the player with the highest score

## Technical Stack

### Frontend:
- React + TypeScript
- Tailwind CSS for styling
- Socket.IO Client for real-time communication
- React Router for navigation
- Canvas API for drawing
- Canvas Confetti for animations

### Backend:
- Node.js + Express
- Socket.IO Server for WebSocket communication
- In-memory room and game state management

## Running the Application

### Start the Server:
```bash
npx tsx server/index.ts
```

The server will run on port 3001.

### Start the Client:
The client is automatically served by the Vite development server.

## Word Categories

- Fruits (apple, banana, orange, etc.)
- Animals (cat, dog, elephant, etc.)
- Emojis (smile, heart, star, etc.)
- Memes (thumbs up, peace sign, etc.)

## Game Rules

- 2-6 players per room
- 75 seconds per drawing round
- Each player draws once per game
- Points: 100 for correct guess, 50 for drawer
- Winner: Highest score at game end

## Architecture

### Server Events:
- `room:create` - Create a new room
- `room:join:request` - Request to join a room
- `room:join:approve` - Host approves join request
- `room:join:reject` - Host rejects join request
- `game:start` - Start the game
- `draw:data` - Broadcast drawing data
- `draw:clear` - Clear the canvas
- `chat:message` - Send chat message / guess

### Client Events:
- `player:joined` - Player joined the room
- `player:left` - Player left the room
- `game:started` - Game has started
- `round:start` - New round started
- `word:assigned` - Word assigned to drawer
- `timer:update` - Round timer update
- `guess:correct` - Correct guess made
- `round:end` - Round ended
- `game:over` - Game finished

## Copyright

© 2026 Draw & Guess Online
