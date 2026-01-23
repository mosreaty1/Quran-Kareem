#!/bin/bash

echo "🚀 Starting Quran Kareem Server..."
echo "=================================="
echo ""
echo "📦 Installing dependencies..."
npm install
echo ""
echo "🌐 Starting server on http://localhost:3000"
echo "📱 Open your browser and navigate to:"
echo "   - Main Page: http://localhost:3000/index.html"
echo "   - Admin Panel: http://localhost:3000/admin.html"
echo "   - Videos: http://localhost:3000/islamic-videos.html"
echo ""
echo "🔐 Admin Password: Quran@Admin2025"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="
echo ""

npm start
