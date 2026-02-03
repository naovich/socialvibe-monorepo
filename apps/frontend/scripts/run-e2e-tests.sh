#!/bin/bash

set -e

echo "🚀 Starting E2E Tests with Backend"
echo ""

# Kill any existing backend
pkill -f "node.*backend" || true
sleep 2

# Start backend in production mode (no watch, stable)
cd ../backend
echo "📦 Building backend..."
npm run build > /dev/null 2>&1

echo "🔧 Starting backend (production mode)..."
NODE_ENV=production node dist/src/main.js > /tmp/e2e-backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend..."
for i in {1..30}; do
  if curl -s http://localhost:3000/api > /dev/null 2>&1; then
    echo "✅ Backend ready!"
    break
  fi
  sleep 1
done

# Run E2E tests
cd ../frontend
echo ""
echo "🧪 Running E2E tests..."
npm run test

# Cleanup
echo ""
echo "🧹 Cleaning up..."
kill $BACKEND_PID || true

echo "✅ Done!"
