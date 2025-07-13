#!/bin/bash

echo "🚀 Preparing La Familia de Shilo for Render deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - La Familia de Shilo"
    echo "✅ Git repository initialized"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as remote:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/la-familia-de-shilo.git"
    echo ""
    echo "Then push to GitHub:"
    echo "git push -u origin main"
    echo ""
    echo "After that, go to Render dashboard and:"
    echo "1. Create new Web Service"
    echo "2. Connect your GitHub repository"
    echo "3. Render will auto-detect the configuration"
else
    echo "✅ Git remote already configured"
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Update for Render deployment"
    git push
    echo "✅ Code pushed to GitHub"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to Render dashboard"
    echo "2. Create new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Render will auto-detect the configuration"
fi

echo ""
echo "🎉 Deployment files ready!"
echo "📋 Files created:"
echo "  - Procfile"
echo "  - render.yaml"
echo "  - .gitignore"
echo "  - Updated README.md" 