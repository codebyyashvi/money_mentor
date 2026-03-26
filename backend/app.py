from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Optional, List
from bson.objectid import ObjectId
import os

# Load environment variables
load_dotenv()

# Import modules
from database import connect_db, close_db, get_db
import os
from auth import get_current_user, create_access_token, get_password_hash, verify_password
from models import (
    UserRegister, UserLogin, Token, UserResponse,
    FinancialProfile, FinancialProfileResponse,
    FIREInput, FIREResponse,
    MoneyHealthScoreInput, MoneyHealthScore,
    TaxInput, TaxOptimization,
    PortfolioXRayInput, XRayAnalysis, MFHolding,
    LifeEventInput, LifeEventAdvice,
    CouplesPlannerInput, CouplesOptimization
)
from services import (
    FIRECalculator, MoneyHealthScoreCalculator, TaxCalculator, PortfolioAnalyzer
)
from ai_advisor import GroqAIAdvisor

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

# Global AI advisor
ai_advisor = GroqAIAdvisor()

# Lifespan events
@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    await connect_db()
    print("MongoDB connected")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    await close_db()
    print("MongoDB disconnected")

# ===================== AUTHENTICATION ENDPOINTS =====================

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    """Register a new user"""
    db = get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_doc = {
        "email": user_data.email,
        "password": get_password_hash(user_data.password),
        "name": user_data.name,
        "phone": user_data.phone,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id
    }

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    db = get_db()
    
    # Find user
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(user_id: str = Depends(get_current_user)):
    """Get current user info"""
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ObjectId to string for Pydantic validation
    user["_id"] = str(user["_id"])
    return UserResponse(**user)

# ===================== FINANCIAL PROFILE ENDPOINTS =====================

@app.post("/api/profile", response_model=FinancialProfileResponse)
async def create_financial_profile(
    profile: FinancialProfile,
    user_id: str = Depends(get_current_user)
):
    """Create user financial profile"""
    db = get_db()
    
    profile_doc = profile.dict()
    profile_doc["user_id"] = user_id
    profile_doc["created_at"] = datetime.utcnow()
    profile_doc["updated_at"] = datetime.utcnow()
    
    result = await db.financial_profiles.insert_one(profile_doc)
    profile_doc["_id"] = str(result.inserted_id)
    
    return FinancialProfileResponse(**profile_doc)

@app.get("/api/profile", response_model=FinancialProfileResponse)
async def get_financial_profile(user_id: str = Depends(get_current_user)):
    """Get user financial profile"""
    db = get_db()
    
    profile = await db.financial_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial profile not found"
        )
    
    # Convert ObjectId to string for Pydantic validation
    profile["_id"] = str(profile["_id"])
    return FinancialProfileResponse(**profile)

@app.put("/api/profile", response_model=FinancialProfileResponse)
async def update_financial_profile(
    profile: FinancialProfile,
    user_id: str = Depends(get_current_user)
):
    """Update user financial profile"""
    db = get_db()
    
    profile_doc = profile.dict()
    profile_doc["user_id"] = user_id
    profile_doc["updated_at"] = datetime.utcnow()
    
    result = await db.financial_profiles.update_one(
        {"user_id": user_id},
        {"$set": profile_doc},
        upsert=True
    )
    
    updated_profile = await db.financial_profiles.find_one({"user_id": user_id})
    # Convert ObjectId to string for Pydantic validation
    updated_profile["_id"] = str(updated_profile["_id"])
    return FinancialProfileResponse(**updated_profile)

# ===================== FIRE PLANNER ENDPOINTS =====================

@app.post("/api/calculate/fire", response_model=FIREResponse)
async def calculate_fire(
    fire_input: FIREInput,
    user_id: str = Depends(get_current_user)
):
    """Calculate FIRE path and recommendations"""
    try:
        # Calculate FIRE projection
        projection = FIRECalculator.calculate_fire_projection(fire_input)
        
        # Get AI recommendations
        fire_data = {
            "current_age": fire_input.current_age,
            "target_retirement_age": fire_input.target_retirement_age,
            "monthly_income": fire_input.monthly_income,
            "monthly_expenses": fire_input.monthly_expenses,
            "current_corpus": fire_input.current_corpus,
            "monthly_sip": projection.monthly_sip_required,
            "status": projection.status,
            "shortage_amount": projection.shortage_amount
        }
        recommendations = ai_advisor.get_fire_recommendations(fire_data)
        
        # Generate monthly breakdown (12 months)
        monthly_breakdown = []
        for month in range(1, 13):
            monthly_breakdown.append({
                "month": month,
                "sip": projection.monthly_sip_required,
                "projected_corpus": projection.monthly_sip_required * month
            })
        
        return FIREResponse(
            projection=projection,
            recommendations=recommendations,
            monthly_breakdown=monthly_breakdown
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ===================== MONEY HEALTH SCORE ENDPOINTS =====================

@app.post("/api/calculate/money-score", response_model=MoneyHealthScore)
async def calculate_money_score(
    score_input: MoneyHealthScoreInput,
    user_id: str = Depends(get_current_user)
):
    """Calculate comprehensive money health score"""
    try:
        score = MoneyHealthScoreCalculator.calculate_score(score_input)
        
        # Save score to database
        db = get_db()
        score_doc = score.dict()
        score_doc["user_id"] = user_id
        score_doc["calculated_at"] = datetime.utcnow()
        
        await db.money_scores.insert_one(score_doc)
        
        return score
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/api/money-score/history")
async def get_score_history(user_id: str = Depends(get_current_user)):
    """Get historical money health scores"""
    db = get_db()
    
    scores = await db.money_scores.find(
        {"user_id": user_id}
    ).sort("calculated_at", -1).limit(10).to_list(length=10)
    
    return {
        "scores": scores,
        "count": len(scores)
    }

# ===================== TAX WIZARD ENDPOINTS =====================

@app.post("/api/calculate/tax", response_model=TaxOptimization)
async def calculate_tax(
    tax_input: TaxInput,
    user_id: str = Depends(get_current_user)
):
    """Calculate tax optimization"""
    try:
        optimization = TaxCalculator.calculate_tax_optimization(tax_input)
        
        # Get AI recommendations
        tax_data = tax_input.dict()
        ai_recommendations = ai_advisor.get_tax_recommendations(tax_data)
        
        # Add AI recommendations to opportunities
        for rec in ai_recommendations:
            optimization.tax_saving_opportunities.append({
                "name": "AI Recommendation",
                "description": rec
            })
        
        # Save to database
        db = get_db()
        tax_doc = optimization.dict()
        tax_doc["user_id"] = user_id
        tax_doc["calculated_at"] = datetime.utcnow()
        
        await db.tax_calculations.insert_one(tax_doc)
        
        return optimization
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ===================== PORTFOLIO X-RAY ENDPOINTS =====================

@app.post("/api/portfolio/xray", response_model=XRayAnalysis)
async def analyze_portfolio(
    portfolio_input: PortfolioXRayInput,
    user_id: str = Depends(get_current_user)
):
    """Analyze mutual fund portfolio"""
    try:
        holdings = [h.dict() for h in portfolio_input.holdings]
        
        # Calculate totals
        total_value = sum(h["units"] * h["nav"] for h in holdings)
        total_invested = sum(h["units"] * h["purchase_price"] for h in holdings if "purchase_price" in h)
        total_gain = total_value - total_invested
        
        # Calculate XIRR (simplified)
        xirr = PortfolioAnalyzer.calculate_xirr_simple(
            [{"amount": total_invested}],
            total_value,
            365
        )
        
        # Holdings analysis
        holdings_analysis = []
        for holding in holdings:
            holding_value = holding["units"] * holding["nav"]
            holdings_analysis.append({
                "name": holding["name"],
                "value": holding_value,
                "allocation_percent": (holding_value / (total_value + 1)) * 100,
                "units": holding["units"],
                "nav": holding["nav"],
                "category": holding.get("category", "Unknown"),
                "performance": holding.get("performance", 0)
            })
        
        # Overlap analysis
        overlap_analysis = PortfolioAnalyzer.detect_overlaps(holdings)
        
        # Sector allocation
        sector_allocation = {}
        for holding in holdings_analysis:
            sector = holding["category"]
            if sector not in sector_allocation:
                sector_allocation[sector] = 0
            sector_allocation[sector] += holding["allocation_percent"]
        
        # Rebalancing recommendations
        rebalancing = []
        for h in holdings_analysis:
            if h["allocation_percent"] > 30:
                rebalancing.append({
                    "fund": h["name"],
                    "current_allocation": h["allocation_percent"],
                    "recommended_allocation": 20,
                    "action": "REDUCE"
                })
        
        analysis = XRayAnalysis(
            total_value=total_value,
            total_invested=total_invested,
            total_gain=total_gain,
            xirr=xirr,
            holdings_analysis=holdings_analysis,
            overlap_analysis=overlap_analysis,
            sector_allocation=sector_allocation,
            expense_ratio_drag={"avg_er": 1.2, "drag": 0.012},
            benchmark_comparison={"benchmark": "Sensex", "outperformance": 2.5},
            rebalancing_recommendations=rebalancing
        )
        
        # Save to database
        db = get_db()
        xray_doc = {
            "user_id": user_id,
            "analysis": analysis.dict(),
            "analyzed_at": datetime.utcnow()
        }
        await db.portfolio_xrays.insert_one(xray_doc)
        
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ===================== LIFE EVENT ADVISOR ENDPOINTS =====================

@app.post("/api/life-event/advice", response_model=LifeEventAdvice)
async def get_life_event_advice(
    event_input: LifeEventInput,
    user_id: str = Depends(get_current_user)
):
    """Get AI advice for life event financial decisions"""
    try:
        # Get AI advice
        profile_data = {
            "age": event_input.current_age,
            "annual_income": event_input.annual_income,
            "current_corpus": event_input.current_corpus,
            "risk_profile": event_input.risk_profile
        }
        
        ai_advice = ai_advisor.get_life_event_advice(
            event_input.event_type.value,
            event_input.event_amount,
            profile_data
        )
        
        # Generate recommendations
        recommendations = [
            {
                "action": "Build Emergency Fund",
                "allocation_amount": event_input.event_amount * 0.20,
                "reason": "Secure 6 months of living expenses first",
                "tax_implications": "No tax on emergency fund allocation",
                "risk_level": "Low",
                "timeline": "Immediate"
            },
            {
                "action": "Debt Repayment",
                "allocation_amount": event_input.event_amount * 0.30,
                "reason": "Reduce high-interest debt burden",
                "tax_implications": "Interest saved is tax-efficient returns",
                "risk_level": "Low",
                "timeline": "Within 3 months"
            },
            {
                "action": "Tax-Efficient Investment",
                "allocation_amount": event_input.event_amount * 0.50,
                "reason": "Build long-term wealth with tax benefits",
                "tax_implications": f"ELSS investment provides tax deduction under 80C",
                "risk_level": event_input.risk_profile,
                "timeline": "Ongoing through SIP"
            }
        ]
        
        advice = LifeEventAdvice(
            event_type=event_input.event_type.value,
            recommendations=recommendations,
            priority_actions=[
                f"Allocate {event_input.event_amount * 0.20:,.0f} to emergency fund",
                f"Plan {event_input.event_amount * 0.30:,.0f} for debt repayment",
                f"Invest {event_input.event_amount * 0.50:,.0f} in tax-efficient funds"
            ],
            tax_planning_insights=[
                "Consult CA for optimal tax planning based on your bracket",
                "Consider NPS for additional tax deduction (Section 80CCD)",
                "HRA exemption review post-event if applicable"
            ]
        )
        
        # Save to database
        db = get_db()
        event_doc = {
            "user_id": user_id,
            "event_type": event_input.event_type.value,
            "event_amount": event_input.event_amount,
            "advice": advice.dict(),
            "requested_at": datetime.utcnow()
        }
        await db.life_event_advice.insert_one(event_doc)
        
        return advice
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ===================== COUPLE'S PLANNER ENDPOINTS =====================

@app.post("/api/couple-planner/optimize", response_model=CouplesOptimization)
async def optimize_couples_finances(
    couple_input: CouplesPlannerInput,
    user_id: str = Depends(get_current_user)
):
    """Optimize finances for couples"""
    try:
        # Combined income
        combined_income = couple_input.member1.annual_income + couple_input.member2.annual_income
        
        # Optimized HRA split (based on income ratio)
        total_hra = 0  # Assuming no existing HRA for calculation
        member1_ratio = couple_input.member1.annual_income / combined_income
        optimized_hra_split = {
            "member1": total_hra * member1_ratio,
            "member2": total_hra * (1 - member1_ratio),
            "note": "HRA should go to higher earner in rental agreement"
        }
        
        # Optimized NPS allocation
        total_nps = combined_income * 0.10  # 10% of combined income
        optimized_nps = {
            "total_contribution": total_nps,
            "member1": total_nps * member1_ratio,
            "member2": total_nps * (1 - member1_ratio),
            "tax_benefit": total_nps * 0.30  # Assuming 30% tax bracket
        }
        
        # Optimized SIP split
        combined_expenses = couple_input.member1.monthly_expenses + couple_input.member2.monthly_expenses
        combined_monthly_income = combined_income / 12
        combined_savings = (combined_monthly_income - combined_expenses) * 12
        monthly_sip = (combined_savings / 12) * 0.50  # 50% to SIP
        
        optimized_sip = {
            "total_monthly": monthly_sip,
            "member1_allocation": monthly_sip * member1_ratio,
            "member2_allocation": monthly_sip * (1 - member1_ratio),
            "annual_amount": monthly_sip * 12
        }
        
        # Joint insurance plan
        combined_insurance = {
            "term_insurance": combined_income * 10,
            "health_insurance_self": 50000 * 2,  # Both partners
            "health_insurance_parents": 50000 * 2,  # Both sets of parents
            "property_insurance": couple_input.member1.monthly_expenses * 12
        }
        
        # Combined retirement plan
        combined_retirement_target = (combined_expenses * 25) * 0.75  # 75% of combined target
        shortfall = max(0, combined_retirement_target - (couple_input.member1.current_investments + couple_input.member2.current_investments))
        
        combined_retirement = {
            "combined_target": combined_retirement_target,
            "current_corpus": couple_input.member1.current_investments + couple_input.member2.current_investments,
            "shortfall": shortfall,
            "years_to_retirement": 25,
            "required_monthly_sip": shortfall / (25 * 12) if shortfall > 0 else 0
        }
        
        # Tax efficiency gains
        tax_savings = (optimized_nps["tax_benefit"] + optimized_hra_split.get("member1", 0) * 0.30 + optimized_hra_split.get("member2", 0) * 0.30)
        
        optimization = CouplesOptimization(
            combined_annual_income=combined_income,
            optimized_hra_split=optimized_hra_split,
            optimized_nps_allocation=optimized_nps,
            optimized_sip_split=optimized_sip,
            joint_insurance_plan=combined_insurance,
            tax_efficiency_gains=tax_savings,
            combined_retirement_plan=combined_retirement,
            recommendations=[
                f"Joint account for shared expenses: ₹{combined_expenses:,.0f}/month",
                f"Individual NPS: ₹{optimized_nps['member1']:,.0f} (Member 1) and ₹{optimized_nps['member2']:,.0f} (Member 2)",
                f"SIP strategy: ₹{optimized_sip['total_monthly']:,.0f}/month combined",
                f"Combined life insurance: ₹{combined_insurance['term_insurance']:,.0f}",
                "Annual review of tax planning during salary increment season"
            ]
        )
        
        # Save to database
        db = get_db()
        couple_doc = {
            "user_id": user_id,
            "couple_optimization": optimization.dict(),
            "created_at": datetime.utcnow()
        }
        await db.couples_planner.insert_one(couple_doc)
        
        return optimization
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# ===================== UTILITY ENDPOINTS =====================

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Money Mentor API",
        "version": "1.0.0",
        "ai_available": ai_advisor.is_available()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Money Mentor API",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "version": "1.0.0"
    }

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# Run the server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)

