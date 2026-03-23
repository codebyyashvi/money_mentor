# Money Mentor Backend API

FastAPI-based backend for the AI Money Mentor platform - personal finance management for Indians.

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
python app.py
```

Or with uvicorn directly:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 5000
```

The API will be available at: **http://localhost:5000**

## API Documentation

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## Available Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Financial Profile
- `GET /api/profile/{user_id}` - Get user profile
- `POST /api/profile` - Create user profile
- `PUT /api/profile/{user_id}` - Update user profile

### Calculations
- `POST /api/calculate/fire` - Calculate FIRE path
- `POST /api/calculate/money-score` - Calculate money health score
- `POST /api/calculate/tax` - Calculate tax optimization

## Environment Variables
- `PORT` - Server port (default: 5000)
- `FLASK_DEBUG` - Debug mode
- `FLASK_ENV` - Environment (development/production)

## Project Structure
```
backend/
├── app.py           # Main FastAPI application
├── requirements.txt # Python dependencies
├── .env            # Environment variables
└── README.md       # This file
```

## Technologies
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **CORS** - Cross-Origin Resource Sharing support
