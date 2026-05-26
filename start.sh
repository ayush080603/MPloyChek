#!/bin/bash
echo "🚀 Starting MPloyChek..."

# Start backend
cd "$(dirname "$0")/backend"
node server.js &
BACKEND_PID=$!
echo "✅ API: http://localhost:3000"

# Serve frontend dist
cd "$(dirname "$0")"
npx http-server frontend-dist/frontend -p 4200 --cors &
FE_PID=$!
echo "✅ App: http://localhost:4200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Open: http://localhost:4200"
echo "  Admin:   admin@mploychek.com / Admin@123"
echo "  User:    ayush@mploychek.com / User@123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Press Ctrl+C to stop"
trap "kill $BACKEND_PID $FE_PID 2>/dev/null; echo Stopped." INT
wait
