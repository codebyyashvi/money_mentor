# API Testing Guide - Money Mentor

This file contains curl commands and examples for testing the Money Mentor API endpoints.

## Setup

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Configure MongoDB**
   - Ensure MongoDB is running on `localhost:27017`
   - Or update MONGODB_URL in `.env`

3. **Configure Groq (Optional)**
   - Get API key from https://console.groq.com
   - Add to `.env`: `GROQ_API_KEY=your-key`

4. **Run the server**
```bash
python app.py
# Or with uvicorn
uvicorn app:app --reload --host 0.0.0.0 --port 5000
```

## API Endpoints Testing

### 1. Authentication

#### Register
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "9876543210"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "65a6b7c8d9e0f1g2h3i4j5k6"
}
```

#### Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Financial Profile

#### Create Profile
```bash
curl -X POST "http://localhost:5000/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe",
    "age": 28,
    "annual_income": 1200000,
    "monthly_expenses": 50000,
    "current_savings": 500000,
    "current_investments": 2000000,
    "debt": 0,
    "risk_profile": "moderate",
    "investment_experience": "intermediate",
    "life_goals": "FIRE by 45, Buy house in 5 years"
  }'
```

#### Get Profile
```bash
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update Profile
```bash
curl -X PUT "http://localhost:5000/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe",
    "age": 29,
    "annual_income": 1500000,
    "monthly_expenses": 55000,
    "current_savings": 750000,
    "current_investments": 3000000,
    "debt": 100000,
    "risk_profile": "aggressive",
    "investment_experience": "advanced",
    "life_goals": "FIRE by 42"
  }'
```

---

### 3. FIRE Path Planner

#### Calculate FIRE
```bash
curl -X POST "http://localhost:5000/api/calculate/fire" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "current_age": 28,
    "monthly_income": 100000,
    "monthly_expenses": 50000,
    "current_corpus": 500000,
    "annual_return_rate": 12,
    "inflation_rate": 5,
    "target_retirement_age": 45
  }'
```

Response includes:
- Years to retirement
- Required monthly SIP
- Projected corpus
- Status (ON_TRACK/SHORTFALL)
- Asset allocation recommendations
- AI-generated recommendations

---

### 4. Money Health Score

#### Calculate Score
```bash
curl -X POST "http://localhost:5000/api/calculate/money-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "emergency_fund": 300000,
    "emergency_fund_months": 6,
    "total_monthly_expenses": 50000,
    "insurance_sum_assured": 5000000,
    "income": 1200000,
    "has_health_insurance": true,
    "has_life_insurance": true,
    "has_property_insurance": false,
    "diversification_score": 75,
    "total_debt": 0,
    "total_income": 1200000,
    "investment_portfolio_value": 2000000,
    "annual_returns_on_investment": 240000,
    "tax_paid_last_year": 150000,
    "retirement_corpus": 1500000,
    "retirement_target": 4000000
  }'
```

Response includes:
- 6 dimension scores (0-100)
- Overall status (POOR/FAIR/GOOD/EXCELLENT)
- Personalized recommendations

#### Get Score History
```bash
curl -X GET "http://localhost:5000/api/money-score/history" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5. Tax Wizard

#### Calculate Tax Optimization
```bash
curl -X POST "http://localhost:5000/api/calculate/tax" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "salary": 1000000,
    "bonus": 100000,
    "capital_gains": 50000,
    "other_income": 0,
    "standard_deduction": 50000,
    "80c_investments": 100000,
    "80d_health_insurance": 25000,
    "80e_education_loan": 0,
    "hra_exemption": 200000,
    "other_deductions": 0,
    "loss_from_house_property": 0
  }'
```

Response includes:
- Old regime tax calculation
- New regime tax calculation
- Recommended regime
- Tax savings amount
- Missing deductions
- Tax-saving opportunities
- SIP recommendation

---

### 6. Portfolio X-Ray

#### Analyze Portfolio
```bash
curl -X POST "http://localhost:5000/api/portfolio/xray" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "holdings": [
      {
        "name": "SBI Bluechip Fund",
        "units": 8500,
        "nav": 61.18,
        "purchase_price": 55,
        "purchase_date": "2022-01-15",
        "sector": "Large Cap",
        "performance": 13.2
      },
      {
        "name": "Axis Midcap Fund",
        "units": 6200,
        "nav": 61.29,
        "purchase_price": 50,
        "purchase_date": "2022-06-20",
        "sector": "Mid Cap",
        "performance": 18.5
      }
    ]
  }'
```

Response includes:
- Total portfolio value
- XIRR (Extended Internal Rate of Return)
- Holdings analysis
- Overlap detection
- Sector allocation
- Rebalancing recommendations

---

### 7. Life Event Advisor

#### Get Life Event Advice
```bash
curl -X POST "http://localhost:5000/api/life-event/advice" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "event_type": "bonus",
    "event_amount": 500000,
    "current_age": 28,
    "annual_income": 1200000,
    "current_corpus": 2000000,
    "tax_bracket": "30%",
    "risk_profile": "moderate",
    "existing_investments": {
      "mutual_funds": 1500000,
      "stocks": 300000,
      "bonds": 200000
    }
  }'
```

Supports events: bonus, inheritance, marriage, new_baby, home_purchase, job_change

Response includes:
- Personalized recommendations
- Tax implications
- Priority actions
- Tax planning insights

---

### 8. Couple's Money Planner

#### Optimize Couple Finances
```bash
curl -X POST "http://localhost:5000/api/couple-planner/optimize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "member1": {
      "name": "John Doe",
      "age": 28,
      "annual_income": 1200000,
      "monthly_expenses": 30000,
      "current_investments": 1500000,
      "existing_hra": 100000,
      "existing_nps": 50000
    },
    "member2": {
      "name": "Jane Doe",
      "age": 26,
      "annual_income": 800000,
      "monthly_expenses": 20000,
      "current_investments": 500000,
      "existing_hra": 50000,
      "existing_nps": 0
    },
    "combined_goals": "FIRE in 15 years, Buy house in 3 years",
    "risk_profile": "moderate"
  }'
```

Response includes:
- Combined income optimization
- HRA split recommendation
- NPS allocation strategy
- SIP optimization
- Joint insurance plan
- Tax efficiency gains
- Combined retirement planning

---

### 9. Health Check
```bash
curl "http://localhost:5000/api/health"
```

Response shows API status and whether AI is available.

---

## Sample Complete Flow

### 1. Register User
```bash
TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123",
    "name": "Demo User"
  }' | jq -r '.access_token')
```

### 2. Create Financial Profile
```bash
curl -X POST "http://localhost:5000/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...profile data...}'
```

### 3. Calculate FIRE
```bash
curl -X POST "http://localhost:5000/api/calculate/fire" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...fire data...}'
```

### 4. Calculate Money Score
```bash
curl -X POST "http://localhost:5000/api/calculate/money-score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...score data...}'
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=money_mentor

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Groq AI (Optional)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=mixtral-8x7b-32768

# Server
PORT=5000
HOST=0.0.0.0
DEBUG=True
```

---

##Documentation

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc
- **OpenAPI Schema**: http://localhost:5000/openapi.json

---

## Notes

- All monetary amounts are in Indian Rupees (₹)
- Authentication uses JWT Bearer tokens
- All endpoints (except auth/register, auth/login, health) require authentication
- Database: MongoDB
- AI recommendations are optional (fallback logic if Groq unavailable)
- Tax calculations follow FY 2023-24 Indian tax regime
