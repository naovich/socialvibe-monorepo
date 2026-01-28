#!/bin/bash

# Pre-push script to ensure quality before pushing
set -e

echo "🔍 Running pre-push checks..."
echo ""

# 1. Lint
echo "📝 Linting code..."
npm run lint
echo "✅ Lint passed"
echo ""

# 2. Build
echo "🏗️  Building all packages..."
npm run build
echo "✅ Build passed"
echo ""

# 3. Test (when available)
# echo "🧪 Running tests..."
# npm run test
# echo "✅ Tests passed"
# echo ""

echo "✅ All checks passed! Ready to push 🚀"
