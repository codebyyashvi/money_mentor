from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Money Mentor API",
    description="AI-powered personal finance platform for Indians",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class FinancialProfile(BaseModel):
    name: str
    age: int
    income: float
    monthly_expenses: float
    savings: float
    debt: float
    risk_profile: str
    investment_experience: str
    goals: str

class FIRECalculation(BaseModel):
    monthly_income: float
    monthly_expenses: float
    current_corpus: float
    annual_return: float
    inflation_rate: float
    retirement_age: int

class TaxCalculation(BaseModel):
    salary: float
    bonus: float
    capital_gains: float
    deductions: float

class MoneyScore(BaseModel):
    emergency_fund: float
    insurance_coverage: float
    diversification_score: float
    debt_level: float
    tax_efficiency: float
    retirement_readiness: float

# Health check endpoint
@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Money Mentor API",
        "version": "1.0.0"
    }

# Financial Profile endpoints
@app.get("/api/profile/{user_id}")
async def get_profile(user_id: str):
    """Get user financial profile"""
    return {
        "message": "Get profile endpoint",
        "user_id": user_id,
        "data": None
    }

@app.post("/api/profile")
async def create_profile(profile: FinancialProfile):
    """Create user financial profile"""
    return {
        "message": "Profile created successfully",
        "data": profile
    }

@app.put("/api/profile/{user_id}")
async def update_profile(user_id: str, profile: FinancialProfile):
    """Update user financial profile"""
    return {
        "message": "Profile updated successfully",
        "user_id": user_id,
        "data": profile
    }

# FIRE Calculator endpoint
@app.post("/api/calculate/fire")
async def calculate_fire(calculation: FIRECalculation):
    """Calculate FIRE path metrics"""
    # Basic FIRE calculation logic
    annual_savings = (calculation.monthly_income - calculation.monthly_expenses) * 12
    years_to_fire = (calculation.monthly_expenses * 25) / annual_savings if annual_savings > 0 else float('inf')
    
    return {
        "message": "FIRE calculation completed",
        "data": {
            "annual_savings": annual_savings,
            "years_to_fire": years_to_fire,
            "target_corpus": calculation.monthly_expenses * 300,
            "current_corpus": calculation.current_corpus
        }
    }

# Money Score endpoint
@app.post("/api/calculate/money-score")
async def calculate_money_score(score: MoneyScore):
    """Calculate money health score"""
    # Calculate overall score (average of 6 dimensions)
    overall_score = (
        score.emergency_fund +
        score.insurance_coverage +
        score.diversification_score +
        score.debt_level +
        score.tax_efficiency +
        score.retirement_readiness
    ) / 6
    
    return {
        "message": "Money score calculated",
        "data": {
            "overall_score": round(overall_score, 2),
            "breakdown": score,
            "recommendation": "Invest more in emergency fund" if score.emergency_fund < 50 else "Good financial health"
        }
    }

# Tax Calculator endpoint
@app.post("/api/calculate/tax")
async def calculate_tax(tax: TaxCalculation):
    """Calculate tax optimization"""
    taxable_income = tax.salary + tax.bonus + tax.capital_gains - tax.deductions
    
    # Simple tax calculation for new regime
    if taxable_income <= 300000:
        tax_amount = 0
    elif taxable_income <= 500000:
        tax_amount = (taxable_income - 300000) * 0.05
    elif taxable_income <= 750000:
        tax_amount = 10000 + (taxable_income - 500000) * 0.10
    else:
        tax_amount = 35000 + (taxable_income - 750000) * 0.15
    
    return {
        "message": "Tax calculation completed",
        "data": {
            "taxable_income": taxable_income,
            "tax_amount": round(tax_amount, 2),
            "effective_rate": round((tax_amount / taxable_income * 100), 2) if taxable_income > 0 else 0
        }
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Money Mentor API",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)

