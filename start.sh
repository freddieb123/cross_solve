#!/bin/bash

# Start both backend and frontend servers

echo "🚀 Starting Daily Cryptic Trainer..."
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Starting servers..."
echo ""

# Start backend in background
echo "🔧 Backend starting on http://localhost:5000"
cd backend && npm start &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# Start frontend in new terminal (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "⚛️  Frontend starting on http://localhost:3000"
  open -a Terminal "cd '$PWD/frontend' && npm start"
else
  # Linux/WSL
  echo "⚛️  Frontend starting on http://localhost:3000"
  cd frontend && npm start &
fi

echo ""
echo "✨ Services started!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait $BACKEND_PID
