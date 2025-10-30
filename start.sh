#!/bin/bash

# NotePad Application Startup Script
# This script starts both the backend and frontend services

echo "Starting NotePad Application..."

# Check if required tools are installed
if ! command -v dotnet &> /dev/null; then
    echo "Error: .NET SDK is not installed. Please install .NET 9.0 SDK."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Store the root directory path
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if port 5194 is already in use
if lsof -i:5194 &>/dev/null; then
    echo "Warning: Port 5194 is already in use. Stopping existing process..."
    kill $(lsof -t -i:5194) 2>/dev/null || true
    sleep 2
fi

# Start the backend service
echo "Starting backend service..."
cd "$ROOT_DIR/backend" || exit
dotnet build
# Start the backend in the background
dotnet run &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for the backend to initialize
echo "Waiting for backend to initialize (5 seconds)..."
sleep 5

# Go back to root directory
cd "$ROOT_DIR" || exit

# Start the frontend service
echo "Starting frontend service..."
# Navigate to the frontend directory using absolute path
cd "$ROOT_DIR/frontend" || { echo "Error: frontend directory not found at $ROOT_DIR/frontend"; exit 1; }
# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check if port 3000 is already in use
if lsof -i:3000 &>/dev/null; then
    echo "Warning: Port 3000 is already in use. Stopping existing process..."
    kill $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

# Start the frontend with Vite
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo "NotePad Application is now running!"
echo "- Backend: http://localhost:5194 and https://localhost:7194"
echo "- Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to handle script termination
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Services stopped"
    exit 0
}

# Register the cleanup function for SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
wait
