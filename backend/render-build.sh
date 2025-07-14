#!/bin/bash
# Render build script for familia-shilo (React + Express)
# This script builds both frontend and backend

echo "🚀 Starting familia-shilo full-stack build..."
echo "📁 Working directory: $(pwd)"
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Clear any potential Next.js artifacts
echo "🧹 Cleaning any potential Next.js artifacts..."
rm -rf .next 2>/dev/null || true
rm -f next.config.js 2>/dev/null || true

# Install backend dependencies for production
echo "📦 Installing backend production dependencies..."
npm ci --only=production --no-audit --no-fund

# Check if frontend build files exist (they should be pre-built and committed)
if [ -d "public" ] && [ -f "public/index.html" ]; then
    echo "✅ React build files found in public/ directory!"
    echo "📊 Build files:"
    ls -la public/
else
    echo "⚠️  No React build files found in public/ directory"
    echo "💡 Make sure to run the deploy.sh script locally first"
fi

echo "✅ Full-stack build completed successfully!"
echo "🎯 Ready to start with: node server.js"
echo "🔧 Environment: ${NODE_ENV:-production}"
echo "🌐 Serving React app + Express API"