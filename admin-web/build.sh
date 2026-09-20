# Frontend Build Script
#!/bin/bash

# Soda Admin Web Build Script
# This script builds the React frontend application

set -e  # Exit on any error

echo "🚀 Building Soda Admin Web Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build output:"
    du -sh dist/*
    echo ""
    echo "🎉 Frontend is ready for deployment!"
    echo "   To preview locally: npm run preview"
    echo "   To serve static files: serve dist/"
else
    echo "❌ Build failed!"
    exit 1
fi