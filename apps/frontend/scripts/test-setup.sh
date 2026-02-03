#!/bin/bash

# Script pour démarrer backend + frontend pour tests E2E

set -e

echo "🔧 Starting backend for E2E tests..."

# Démarrer le backend en background
cd ../backend
npm run start:dev &
BACKEND_PID=$!

# Attendre que le backend soit prêt
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start within 30 seconds"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Revenir au frontend
cd ../frontend

# Cleanup function
cleanup() {
  echo "🧹 Cleaning up..."
  kill $BACKEND_PID 2>/dev/null || true
}

trap cleanup EXIT

# Le frontend sera démarré par Playwright via webServer config
echo "✅ Backend ready, Playwright will start frontend"
