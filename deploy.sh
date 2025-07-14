#!/bin/bash
# 🚀 Deploy script for familia-shilo (React + Express)

echo "🎯 Starting deployment process for familia-shilo..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Build Frontend
print_status "Building React frontend..."
cd frontend
if npm run build; then
    print_success "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Step 2: Create backend/public directory
print_status "Creating backend/public directory..."
mkdir -p ../backend/public

# Step 3: Copy built files
print_status "Copying built files to backend/public..."
if cp -r dist/* ../backend/public/; then
    print_success "Files copied successfully!"
    print_status "Copied files:"
    ls -la ../backend/public/
else
    print_error "Failed to copy files!"
    exit 1
fi

# Step 4: Return to root directory
cd ..

# Step 5: Git operations
print_status "Adding changes to git..."
git add .

print_status "Creating commit..."
git commit -m "🚀 Deploy full React + Express app

- Build React frontend for production
- Copy built files to backend/public/
- Update server.js to serve React app
- Add catch-all route for React Router
- Ready for Render deployment

✨ Full-stack app now ready!"

print_status "Pushing to GitHub..."
if git push origin master; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub!"
    exit 1
fi

# Final status
echo ""
print_success "🎉 Deployment completed successfully!"
print_status "Next steps:"
echo "  1. Go to Render Dashboard"
echo "  2. Manual Deploy -> Deploy latest commit"
echo "  3. Visit your site at: https://familia-shilo.onrender.com"
echo ""
print_warning "The full React app should now be live! 🚀"