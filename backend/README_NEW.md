# Money Mentor Backend API

AI-powered personal finance platform for Indians built with FastAPI, MongoDB, and Groq AI.

## 🚀 Features

- **User Authentication** - JWT-based secure authentication
- **Financial Profile Management** - Store and manage user financial data
- **FIRE Path Planner** - Calculate path to Financial Independence, Retire Early
- **Money Health Score** - 6-dimensional financial wellness assessment
- **Tax Wizard** - Indian tax optimization with regime comparison
- **Portfolio X-Ray** - Mutual fund portfolio analysis and XIRR calculation
- **Life Event Advisor** - AI guidance for financial decisions
- **Couple's Money Planner** - Joint financial planning optimization
- **AI Recommendations** - Powered by Groq LLM for personalized advice

## 📋 Prerequisites

- Python 3.9+
- MongoDB (local or remote)
- Groq API Key (optional, for AI features)

## 🔧 Setup Instructions

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

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=money_mentor

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Groq AI (Optional but recommended)
GROQ_API_KEY=your-groq-api-key-from-console.groq.com
GROQ_MODEL=mixtral-8x7b-32768

# Server
PORT=5000
HOST=0.0.0.0
DEBUG=True
```

### 5. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Update MONGODB_URL with your connection string

### 6. Run the Server

**Development mode:**
```bash
python app.py
```

**Or with uvicorn:**
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 5000
```

The API will be available at: **http://localhost:5000**

## 📚 API Documentation

### Online Documentation
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

### Test Requests
See [API_TESTING.md](API_TESTING.md) for complete testing guide with curl commands

## 📁 Project Structure

```
backend/
├── app.py                 # Main FastAPI application & all endpoints
├── config.py              # Configuration settings
├── database.py            # MongoDB connection setup
├── models.py              # Pydantic models for requests/responses
├── auth.py                # JWT authentication & password hashing
├── services.py            # Financial calculation services
├── ai_advisor.py          # Groq AI integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── API_TESTING.md         # Testing guide with examples
└── README.md              # This file
```

## 🔌 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Financial Profile
- `POST /api/profile` - Create financial profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Calculations
- `POST /api/calculate/fire` - FIRE path calculation
- `POST /api/calculate/money-score` - Money health score
- `GET /api/money-score/history` - Score history
- `POST /api/calculate/tax` - Tax optimization
- `POST /api/portfolio/xray` - Portfolio analysis
- `POST /api/life-event/advice` - Life event guidance
- `POST /api/couple-planner/optimize` - Couple's finances

### Utility
- `GET /api/health` - Health check
- `GET /` - Root endpoint

## 🎯 Key Calculations

### FIRE Path Planner
- Calculates required monthly SIP
- Projects retirement corpus
- Provides asset allocation (Equity/Debt/Gold)
- Shows FIRE status (ON_TRACK/SHORTFALL)

### Money Health Score
Evaluates 6 dimensions (0-100 each):
1. Emergency Preparedness
2. Insurance Coverage
3. Investment Diversification
4. Debt Health
5. Tax Efficiency
6. Retirement Readiness

Overall status: POOR / FAIR / GOOD / EXCELLENT

### Tax Optimization
- Compares Old vs New tax regime
- Identifies missing deductions
- Recommends tax-saving investments
- Calculates effective tax rate

### Portfolio X-Ray
- Calculates XIRR (Extended Internal Rate of Return)
- Detects fund overlaps
- Analyzes sector allocation
- Provides rebalancing suggestions
- Compares with benchmark

## 🤖 AI Features

Powered by Groq LLM for intelligent recommendations:
- FIRE planning strategies
- Tax optimization tips
- Life event financial advice
- Personalized insights

**Set Groq API key to enable AI features:**
1. Get free API key from https://console.groq.com
2. Add to `.env`: `GROQ_API_KEY=your-key`

If Groq unavailable, system falls back to rule-based recommendations.

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled for frontend integration
- Input validation with Pydantic
- MongoDB ObjectId for user isolation

## 📊 Indian Tax Compliance

- ✅ New & Old tax regime comparison (FY 2023-24)
- ✅ Section 80C investments (ELSS, PPF, NPS, LIC)
- ✅ Section 80D health insurance
- ✅ HRA exemption calculations
- ✅ Capital gains handling
- ✅ NPS contributions support

## 💳 Supported Investment Types

- Mutual Funds (Direct & Regular)
- NPS (National Pension System)
- PPF (Public Provident Fund)
- ELSS (Equity Linked Savings Scheme)
- Stocks
- Bonds
- Gold
- Real Estate

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error description",
  "status_code": 400
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not found
- `500` - Server error

## 📈 Development Tips

### Add Logging
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

### Test with Postman
1. Import endpoints to Postman
2. Set Bearer token in Authorization
3. Test each endpoint

### Database Inspection
```bash
# View all users
db.users.find()

# View profiles
db.financial_profiles.find()

# View calculations
db.money_scores.find()
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running or update MONGODB_URL in .env

### JWT Token Invalid
```
Error: Could not validate credentials
```
Solution: 
- Check token is being sent in Authorization header
- Verify SECRET_KEY matches
- Token may have expired (default 24 hours)

### Groq API Error
```
Error: 429 Too Many Requests
```
Solution: Groq has rate limits. System will use fallback recommendations.

## 📝 Example Workflow

1. **Register** → Get JWT token
2. **Create Profile** → Save financial data
3. **Calculate FIRE** → Get retirement plan
4. **Calculate Score** → Get wellness assessment
5. **Calculate Tax** → Optimize taxes
6. **Analyze Portfolio** → Review investments
7. **Get Life Event Advice** → Handle windfalls
8. **Plan Couple Finances** → Joint optimization

## 🤝 Integration with Frontend

Frontend should:
1. Store JWT token from `/api/auth/register` or `/api/auth/login`
2. Include token in all requests: `Authorization: Bearer TOKEN`
3. Handle 401 response (token expired) → Re-login
4. Display data from API responses in UI

Example frontend integration:
```javascript
const headers = {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};

const response = await fetch("http://localhost:5000/api/profile", {
  method: "GET",
  headers: headers
});
```

## 📞 Support

For issues or questions:
1. Check [API_TESTING.md](API_TESTING.md) for examples
2. Review endpoint documentation at http://localhost:5000/docs
3. Check logs for error messages
4. Verify .env configuration

## 📄 License

This project is part of Money Mentor - AI-powered personal finance for Indians

## 🎓 Financial Literacy

All recommendations follow Indian financial best practices and tax regulations. Always consult with a certified financial advisor before making investment decisions.

---

**Happy financial planning! 💰**
