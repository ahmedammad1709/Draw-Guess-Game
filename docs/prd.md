# Draw & Guess Online Requirements Document

## 1. Application Overview

### 1.1 Application Name
Draw & Guess Online
\n### 1.2 Application Description
A fully functional online multiplayer web game where 2-6 players can join rooms to play a drawing and guessing game. Players take turns drawing while others guess the word in real-time.

### 1.3 Application Type
Web-based multiplayer game

## 2. Core Features

### 2.1 Room System
- Host creates a room and receives a unique shareable link
- Guests open the link, enter their name, and request to join
- Host can approve or reject join requests
- Room state maintained on server including players, current drawer, word, score, and round information
- Room cleanup when all players leave
\n### 2.2 Gameplay Mechanics
- Multiple rounds with each player becoming the drawer once per round
- Drawer assigned a random word from predefined word pool (fruits, animals, emojis, memes)
- Drawer draws on canvas with real-time broadcast to all players
- Other players guess the word via chat input
- First correct guesser earns points; drawer earns points for correct guesses
- Round timer: 60-90 seconds per round\n- Automatic progression to next drawer after timer expires or word is guessed

### 2.3 Drawing Canvas
- Real-time drawing updates broadcast to all players
- Basic color selection options
- Brush size options
- Clear canvas function

### 2.4 Chat and Guessing
- Real-time chat box for player guesses
- Automatic correct guess detection
- Chat messages visible to all players
\n### 2.5 Scoring System
- Points awarded to first correct guesser
- Points awarded to drawer for correct guesses\n- Real-time scoreboard display
- Scoreboard updates after each round

### 2.6 Game Notifications
- Player join/leave notifications
- Correct guess notifications
- Round change notifications
- Timer countdown display

### 2.7 Bonus Features\n- Emoji and meme word packs
- Mobile-responsive design
- Confetti animation for correct guesses and round winners
- Shareable leaderboard at game end
- Optional high score persistence

## 3. Technical Requirements

### 3.1 Frontend Technology
- React.js\n- HTML5 Canvas for drawing
- CSS for styling
- WebSocket client (Socket.IO)

### 3.2 Backend Technology\n- Node.js with Express server
- WebSocket server (Socket.IO)
- Room and player state management
- Drawing data handling
- Chat message processing
- Correct guess detection logic
- Scoring calculation
- Round management system
\n### 3.3 Real-time Communication
- WebSocket (Socket.IO) for bidirectional real-time communication
- Drawing data broadcast\n- Chat message broadcast
- Game state synchronization
- Player action notifications

## 4. User Flow

### 4.1 Host Flow
1. Create a new room
2. Receive unique shareable room link
3. Share link with other players
4. Approve or reject join requests
5. Start game when ready
6. Participate in drawing and guessing rounds

### 4.2 Guest Flow
1. Open shared room link
2. Enter player name
3. Request to join room
4. Wait for host approval
5. Participate in drawing and guessing rounds\n
### 4.3 Gameplay Flow
1. Game starts with first drawer selected
2. Drawer receives random word
3. Drawer draws on canvas (60-90 seconds)
4. Other players submit guesses via chat
5. First correct guess awards points
6. Round ends when timer expires or word is guessed\n7. Next player becomes drawer\n8. Repeat until all players have drawn
9. Display final leaderboard

## 5. Deployment Instructions

### 5.1 Server Setup
- Install Node.js dependencies
- Configure server port
- Start Express server
- Initialize Socket.IO server

### 5.2 Client Access
- Open application in web browser
- Access via localhost for local testing
- Fully functional and ready to run locally

## 6. Word Pool Categories
- Fruits\n- Animals
- Emojis
- Memes

## 7. Game Rules
- 2-6 players per room\n- Each player draws once per round
- 60-90 seconds per drawing round
- Points awarded for correct guesses
- Winner determined by highest score at game end