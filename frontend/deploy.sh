#!/bin/bash

echo "🚀 Starting Laureate deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output:"
    ls -la dist/
    echo ""
    echo "🌐 Ready for deployment!"
    echo "📋 Next steps:"
    echo "1. Upload the 'dist' folder to Netlify"
    echo "2. Or push to your connected Git repository"
    echo "3. Your site should be live at your Netlify URL"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
