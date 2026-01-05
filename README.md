# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8qb44ywxgoap

# 🎨 Draw & Guess Online

A fully functional online multiplayer web game where 2-6 players can join rooms to play a drawing and guessing game. Players take turns drawing while others guess the word in real-time.

![Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Players](https://img.shields.io/badge/players-2--6-orange)

## 🎮 Quick Start

### 1. Start the Server
```bash
./start.sh
```
Or manually:
```bash
npx tsx server/index.ts
```

### 2. Open the Application
The frontend is served by Vite. Access it through your development environment.

### 3. Play!
- **Create a room** and share the link with friends
- **Join a room** using a shared link
- **Draw and guess** to win points!

## ✨ Features

- ✅ **Real-time Multiplayer** - 2-6 players per room
- ✅ **Drawing Canvas** - 10 colors, 5 brush sizes, touch support
- ✅ **Chat & Guessing** - Automatic word detection
- ✅ **Scoring System** - Points for correct guesses
- ✅ **Round Management** - Each player draws once
- ✅ **Join Requests** - Host approval system
- ✅ **Notifications** - Real-time game events
- ✅ **Confetti Animations** - Celebration effects
- ✅ **Mobile Responsive** - Works on all devices

## 🛠 Tech Stack

**Frontend:** React 19, TypeScript, Tailwind CSS, Socket.IO Client  
**Backend:** Node.js, Express, Socket.IO Server  
**Drawing:** HTML5 Canvas API  
**Animations:** Canvas Confetti

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup and usage instructions
- **[GAME_README.md](./GAME_README.md)** - Game features and mechanics
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[TODO.md](./TODO.md)** - Development checklist (all complete ✅)

## 🎯 How to Play

### As Host:
1. Enter your name and click "Create Room"
2. Share the room link with friends
3. Approve join requests
4. Start the game (minimum 2 players)

### As Guest:
1. Open the shared room link
2. Enter your name and request to join
3. Wait for host approval
4. Join the game!

### Gameplay:
- **Drawer**: Draw the assigned word (75 seconds)
- **Guessers**: Type guesses in chat
- **Scoring**: First correct guess = 100 points, Drawer = 50 points
- **Winner**: Highest score after all players have drawn

## 📁 Project Structure

```
├── server/              # Backend (Express + Socket.IO)
│   ├── index.ts        # Main server file
│   ├── types.ts        # Type definitions
│   └── wordPool.ts     # Game words
├── src/
│   ├── components/     # React components
│   ├── contexts/       # Socket context
│   ├── pages/          # Main pages
│   ├── types/          # Frontend types
│   └── App.tsx         # Main app
└── start.sh            # Quick start script
```

## 🎨 Word Categories

- **Fruits** (15 words): apple, banana, orange...
- **Animals** (20 words): cat, dog, elephant...
- **Emojis** (15 words): smile, heart, star...
- **Memes** (12 words): thumbs up, peace sign...

## 🚀 Development

### Install Dependencies
```bash
pnpm install
```

### Run Lint
```bash
npm run lint
```

### Start Server
```bash
npx tsx server/index.ts
```

## 🎉 Status

✅ **All features implemented**  
✅ **Lint checks passed**  
✅ **Server running on port 3001**  
✅ **Production ready**

## 📝 License

© 2026 Draw & Guess Online

---

**Ready to play? Start the server and have fun! 🎨🎮**
