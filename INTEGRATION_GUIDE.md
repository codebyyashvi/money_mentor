# Full Stack Setup Guide

## Prerequisites
- **Backend**: Python 3.12+, MongoDB running
- **Frontend**: Node.js 18+

---

## Step 1: Start the Backend

```bash
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate

# Run the server
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Backend API will be at:** `http://localhost:8000`

---

## Step 2: Start the Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v8.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

**Frontend will be at:** `http://localhost:5173`

---

## Step 3: Test the API Connection

1. Open browser and go to: `http://localhost:5173/api-test`
2. You should see: **"Backend Connected ✓"** in green
3. If you see red "Backend Disconnected ✗", check:
   - Backend is running on port 8000
   - No firewall blocking port 8000
   - MongoDB is running

---

## Step 4: Test Each Feature

### Health Check
- API Endpoint: `GET /api/health`
- Test: Go to `/api-test` page

### Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### FIRE Calculator
```bash
curl -X POST http://localhost:8000/api/calculate/fire \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"current_age":30,"target_retirement_age":50,"monthly_income":100000,"monthly_expenses":50000,"current_corpus":500000}'
```

### Other Features
- **Money Score**: `/api/calculate/money-score`
- **Tax Calculator**: `/api/calculate/tax`
- **Portfolio X-Ray**: `/api/portfolio/xray`
- **Life Event Advice**: `/api/life-event/advice`
- **Couple Planner**: `/api/couple-planner/optimize`

---

## Configuration Files

### Backend (.env)
Located in: `backend/.env`
```
MONGODB_URL=mongodb+srv://Ranu:ranu@cluster0.iwtsa.mongodb.net/
DATABASE_NAME=money_mentor
SECRET_KEY=your-secret-key
GROQ_API_KEY=your-groq-key
PORT=8000
HOST=0.0.0.0
```

### Frontend (.env.local)
Located in: `frontend/.env.local`
```
VITE_API_URL=http://localhost:8000/api
```

---

## API Structure

All API functions are organized in `frontend/src/api/`:
- **config.js** - API configuration
- **client.js** - HTTP client with token management
- **endpoints.js** - All API endpoint definitions
- **index.js** - Exports for easy importing

### Using API in Components
```javascript
import { fireAPI, authAPI } from '../api';

// In your component
const result = await fireAPI.calculate({...});
const auth = await authAPI.login(email, password);
```

---

## Troubleshooting

### Backend Connection Failed
1. Check if backend is running: `http://localhost:8000/api/health`
2. Check MongoDB connection in backend logs
3. Verify `.env` file is correctly set up

### CORS Issues
- CORS is already enabled in backend (`allow_origins=["*"]`)
- If still having issues, check browser console for details

### Token Expired
- Tokens are stored in browser's localStorage
- Clear localStorage and login again if needed
- Token expires after 30 minutes (configured in `.env`)

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env`
- Verify internet connection (if using cloud DB)

---

## Testing Checklist

- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] API test page shows "Connected"
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] FIRE calculator returns results
- [ ] Money score calculation works
- [ ] Tax optimization works
- [ ] All features accessible from home page

---

## Next Steps

1. **Add Frontend Integration**: Components need to call API endpoints
2. **Add Form Validation**: Validate user inputs before API calls
3. **Add Error Handling**: Display meaningful error messages to users
4. **Add Loading States**: Show loading spinners during API calls
5. **Add Success Messages**: Confirm successful operations

---

## Commands Cheat Sheet

```bash
# Backend
cd backend
.\.venv\Scripts\Activate
python -m uvicorn app:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev
npm run build  # Build for production

# Test API
curl http://localhost:8000/api/health
```

---

Happy Testing! 🚀
