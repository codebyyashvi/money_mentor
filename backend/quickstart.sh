#!/usr/bin/env bash

# Quick Start Script for Money Mentor Backend
# This script sets up and runs the backend

set -e  # Exit on error

echo "🚀 Money Mentor Backend - Quick Start"
echo "======================================"
echo ""

# Check Python
echo "✓ Checking Python installation..."
python --version > /dev/null 2>&1 || { echo "Python not found. Install Python 3.9+"; exit 1; }

# Create virtual environment
echo "✓ Creating virtual environment..."
if [ ! -d "venv" ]; then
    python -m venv venv
    echo "  Created venv/"
else
    echo "  venv/ already exists"
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "✓ Installing dependencies..."
pip install -r requirements.txt -q

# Check MongoDB
echo ""
echo "⚠️  MongoDB Check"
echo "=================="
echo "Make sure MongoDB is running:"
echo "  • Local: mongod (run in another terminal)"
echo "  • Cloud: Use MongoDB Atlas connection string in .env"
echo ""

# Check .env file
echo "✓ Configuration"
echo "==============="
if [ ! -f ".env" ]; then
    echo "  ⚠️  .env file not found"
    echo "  Create .env with these variables:"
    echo ""
    echo "    MONGODB_URL=mongodb://localhost:27017"
    echo "    DATABASE_NAME=money_mentor"
    echo "    SECRET_KEY=your-secret-key"
    echo "    GROQ_API_KEY=your-groq-key (optional)"
    echo ""
    read -p "  Press Enter to continue (or Ctrl+C to create .env first)..."
else
    echo "  .env file found ✓"
fi

# Run the server
echo ""
echo "🔥 Starting Money Mentor API..."
echo "======================================"
echo ""
echo "📚 API Documentation:"
echo "   • Swagger UI: http://localhost:8000/docs"
echo "   • ReDoc: http://localhost:8000/redoc"
echo "   • API Testing: See API_TESTING.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
