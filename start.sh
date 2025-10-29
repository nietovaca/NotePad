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

# Start the backend service
echo "Starting backend service..."
cd "$(dirname "$0")/backend" || exit
dotnet build
# Start the backend in the background
dotnet run &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for the backend to initialize
echo "Waiting for backend to initialize (5 seconds)..."
sleep 5

# Start the frontend service
echo "Starting frontend service..."
cd "$(dirname "$0")/frontend" || exit
# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start the frontend
npm start &
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
