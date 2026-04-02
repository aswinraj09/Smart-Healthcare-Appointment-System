#!/bin/bash

echo "🚀 Starting MediBot Agent Setup..."

# 1. Start Ollama in background
if ! pgrep -x "ollama" > /dev/null; then
    echo "🧠 Starting Ollama..."
    ollama serve &
    sleep 5
else
    echo "🧠 Ollama is already running."
fi

# 2. Pull Model (if not exists)
echo "📥 Checking for llama3.2 model..."
ollama pull llama3.2

# 3. Start Backend
echo "⚙️ Starting Django Backend..."
cd has_backend
python3 manage.py runserver &
BACKEND_PID=$!
cd ..

# 4. Start Frontend
echo "💻 Starting React Frontend..."
cd has_frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ System Operational!"
echo "FRONTEND: http://localhost:5173 (or 5174)"
echo "BACKEND: http://127.0.0.1:8000"

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
