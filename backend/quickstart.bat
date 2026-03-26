@echo off
REM Quick Start Script for Money Mentor Backend (Windows)

setlocal enabledelayedexpansion

echo.
echo ================================
echo Money Mentor Backend - Quick Start
echo ================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1 || (
    echo Python not found. Install Python 3.9^+
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Created venv/
) else (
    echo venv/ already exists
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies  
echo Installing dependencies...
pip install -r requirements.txt -q

REM Check .env file
echo.
echo Configuration
echo ==============
if not exist ".env" (
    echo WARNING: .env file not found
    echo.
    echo Create .env with these variables:
    echo.
    echo MONGODB_URL=mongodb://localhost:27017
    echo DATABASE_NAME=money_mentor
    echo SECRET_KEY=your-secret-key
    echo GROQ_API_KEY=your-groq-key (optional)
    echo.
    echo.
    pause
) else (
    echo .env file found
    echo.
)

REM Start server
echo.
echo ================================
echo Starting Money Mentor API...
echo ================================
echo.
echo API Documentation:
echo   * Swagger UI: http://localhost:5000/docs
echo   * ReDoc: http://localhost:5000/redoc
echo   * Testing: See API_TESTING.md
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

endlocal
