@echo off
REM Start both backend and frontend servers on Windows

echo.
echo 🚀 Starting Daily Cryptic Trainer...
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
  echo 📦 Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
  echo 📦 Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)

echo.
echo ✅ Starting servers...
echo.
echo 🔧 Backend starting on http://localhost:5000
echo ⚛️  Frontend starting on http://localhost:3000
echo.

REM Start backend in one terminal
start "Daily Cryptic Backend" cmd /k "cd backend && npm start"

REM Start frontend in another terminal
start "Daily Cryptic Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✨ Services started in separate windows!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000/api
echo.
