#!/bin/bash

# Draw & Guess Online - Quick Start Script
# This script starts the Socket.IO server for the multiplayer game

echo "🎨 Starting Draw & Guess Online Server..."
echo ""
echo "Server will run on: http://localhost:3001"
echo "Press Ctrl+C to stop the server"
echo ""
echo "----------------------------------------"
echo ""

cd /workspace/app-8qb44ywxgoap
npx tsx server/index.ts
