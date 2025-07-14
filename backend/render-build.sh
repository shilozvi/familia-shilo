#!/bin/bash
# Render build script for Express.js backend ONLY
# This script explicitly prevents Next.js detection

echo "🚀 Starting Express.js backend build..."
echo "📁 Working directory: $(pwd)"
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Clear any potential Next.js artifacts
echo "🧹 Cleaning any potential Next.js artifacts..."
rm -rf .next 2>/dev/null || true
rm -f next.config.js 2>/dev/null || true

# Install dependencies for production
echo "📦 Installing production dependencies..."
npm ci --only=production --no-audit --no-fund

echo "✅ Express.js backend build completed successfully!"
echo "🎯 Ready to start with: node server.js"
echo "🔧 Environment: ${NODE_ENV:-production}"