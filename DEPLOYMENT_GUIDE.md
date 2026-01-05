# 🎮 Draw & Guess Online - Deployment Guide

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd /workspace/app-8qb44ywxgoap
npx tsx server/index.ts
```

The server will start on **port 3001** and you should see:
```
Server running on port 3001
```

Keep this terminal running.

### 2. Access the Application

The frontend is automatically served by the Vite development server. Open your browser and navigate to the application URL provided by your development environment.

## How to Play

### Creating a Room (Host):

1. **Enter Your Name**: On the home page, type your name in the "Your Name" field
2. **Create Room**: Click the "🎮 Create Room" button
3. **Share the Link**: You'll be redirected to the game room. Click "📋 Copy Link" to copy the room link
4. **Share with Friends**: Send the copied link to your friends (via chat, email, etc.)
5. **Approve Players**: When players request to join, you'll see a notification. Click "🔔 Requests" to approve or reject them
6. **Start Game**: Once you have at least 2 players, click "🎮 Start Game"

### Joining a Room (Guest):

1. **Open the Link**: Click on the room link shared by the host
2. **Enter Your Name**: Type your name when prompted
3. **Wait for Approval**: The host will review your request
4. **Join the Game**: Once approved, you'll enter the game room

### Playing the Game:

**When You're the Drawer:**
- You'll see your word at the top (e.g., "Your word: apple")
- Use the color palette to select colors
- Choose brush size (2px to 12px)
- Draw on the canvas
- Click "🗑️ Clear Canvas" to start over
- You have 75 seconds to draw

**When You're Guessing:**
- Watch the drawer's canvas update in real-time
- Type your guess in the chat box
- First correct guess wins 100 points!
- The drawer gets 50 points for each correct guess

**Scoring:**
- Correct guess: +100 points
- Drawer bonus: +50 points per correct guess
- Winner: Highest score after all players have drawn

## Game Features

### Room Management
- **Unique Room IDs**: Each room gets a 6-character unique ID
- **Player Limit**: 2-6 players per room
- **Join Requests**: Host controls who can join
- **Room Link**: Easy sharing via copy-paste

### Drawing Tools
- **10 Colors**: Black, White, Red, Green, Blue, Yellow, Magenta, Cyan, Orange, Purple
- **5 Brush Sizes**: 2px, 3px, 5px, 8px, 12px
- **Clear Canvas**: Start fresh anytime
- **Real-time Sync**: All players see drawings instantly

### Chat & Guessing
- **Real-time Chat**: Messages appear instantly
- **Auto-detection**: Correct guesses are automatically detected
- **Visual Feedback**: Different colors for your messages vs others
- **System Messages**: Notifications for correct guesses

### Game Flow
- **Multiple Rounds**: Each player draws once
- **75-Second Timer**: Countdown for each round
- **Automatic Progression**: Next player starts automatically
- **Final Scoreboard**: Rankings at game end

### Notifications
- **Player Join/Leave**: See who enters or exits
- **Round Start**: Know who's drawing
- **Correct Guesses**: Celebrate with confetti! 🎉
- **Game Events**: Stay informed of all actions

## Word Categories

The game includes 60+ words across 4 categories:

- **Fruits**: apple, banana, orange, grape, strawberry, watermelon, pineapple, mango, peach, cherry, kiwi, lemon, pear, plum, coconut
- **Animals**: cat, dog, elephant, lion, tiger, giraffe, monkey, penguin, dolphin, rabbit, horse, bear, fox, owl, butterfly, fish, bird, snake, turtle, frog
- **Emojis**: smile, heart, star, sun, moon, fire, rainbow, cloud, lightning, snowflake, flower, tree, mountain, ocean, rocket
- **Memes**: thumbs up, peace sign, ok hand, clapping hands, thinking face, crying laughing, sunglasses, party hat, pizza, hamburger, ice cream, birthday cake

## Technical Details

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Real-time**: Socket.IO Client
- **Drawing**: HTML5 Canvas API
- **Animations**: Canvas Confetti

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **WebSocket**: Socket.IO Server
- **State**: In-memory (no database)

### Communication
- **Protocol**: WebSocket (Socket.IO)
- **Events**: Bidirectional real-time communication
- **Sync**: Drawing data, chat, game state

## Troubleshooting

### Server Not Starting
- Make sure port 3001 is available
- Check if Node.js is installed
- Verify all dependencies are installed: `pnpm install`

### Cannot Connect to Server
- Ensure the server is running (check terminal)
- Verify the server URL in `src/contexts/SocketContext.tsx` matches your setup
- Check browser console for connection errors

### Drawing Not Syncing
- Refresh the page
- Check internet connection
- Verify WebSocket connection in browser DevTools

### Players Can't Join
- Make sure the room ID is correct
- Check if room is full (6 players max)
- Verify game hasn't started yet
- Host must approve join requests

## Mobile Support

The game is fully responsive and works on:
- **Desktop**: Full features with mouse drawing
- **Tablet**: Touch drawing with all features
- **Mobile**: Optimized layout with touch support

## Tips for Best Experience

1. **Stable Connection**: Use a reliable internet connection
2. **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
3. **Clear Drawings**: Use different colors and sizes for better drawings
4. **Quick Guesses**: Type fast to be the first correct guesser
5. **Have Fun**: It's a game - enjoy the creativity and laughter!

## Server Management

### Starting the Server
```bash
npx tsx server/index.ts
```

### Stopping the Server
Press `Ctrl+C` in the terminal running the server

### Server Logs
The server logs all connections and events to the console

### Port Configuration
Default port is 3001. To change:
- Edit `server/index.ts` and modify `PORT` variable
- Update `src/contexts/SocketContext.tsx` with new URL

## Architecture Overview

```
┌─────────────────┐
│   React App     │
│  (Frontend)     │
│                 │
│  - Home Page    │
│  - Join Page    │
│  - Game Room    │
│  - Components   │
└────────┬────────┘
         │
         │ Socket.IO
         │ WebSocket
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
│                 │
│  - Room Mgmt    │
│  - Game Logic   │
│  - Broadcasting │
└─────────────────┘
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the server terminal for logs
3. Verify all dependencies are installed
4. Ensure server is running on port 3001

## Copyright

© 2026 Draw & Guess Online

---

**Enjoy playing Draw & Guess Online! 🎨🎮**
