from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class RiskProfile(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class InvestmentExperience(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class LifeEvent(str, Enum):
    BONUS = "bonus"
    INHERITANCE = "inheritance"
    MARRIAGE = "marriage"
    NEW_BABY = "new_baby"
    HOME_PURCHASE = "home_purchase"
    JOB_CHANGE = "job_change"

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True

# Financial Profile Models
class FinancialProfile(BaseModel):
    user_id: Optional[str] = None
    name: str
    age: int = Field(ge=18, le=100)
    annual_income: float = Field(ge=0)
    monthly_expenses: float = Field(ge=0)
    current_savings: float = Field(ge=0)
    current_investments: float = Field(ge=0)
    debt: float = Field(ge=0)
    risk_profile: RiskProfile
    investment_experience: InvestmentExperience
    life_goals: str
    emergency_fund_months: Optional[int] = 6
    phone: Optional[str] = None
    updated_at: Optional[datetime] = None

class FinancialProfileResponse(FinancialProfile):
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True

# FIRE Calculator Models
class FIREInput(BaseModel):
    monthly_income: float = Field(gt=0)
    monthly_expenses: float = Field(ge=0)
    current_corpus: float = Field(ge=0)
    annual_return_rate: float = Field(ge=0, le=100)
    inflation_rate: float = Field(ge=0, le=100)
    target_retirement_age: int = Field(ge=30, le=100)
    current_age: int = Field(ge=18, le=100)

class FIREProjection(BaseModel):
    years_to_retirement: int
    monthly_sip_required: float
    target_corpus: float
    projected_corpus: float
    status: str  # "ON_TRACK", "SHORTFALL", "AHEAD"
    shortage_amount: float
    recommended_return_rate: float
    asset_allocation: dict

class FIREResponse(BaseModel):
    projection: FIREProjection
    recommendations: List[str]
    monthly_breakdown: List[dict]

# Money Health Score Models
class MoneyHealthScoreInput(BaseModel):
    emergency_fund: float
    emergency_fund_months: int
    total_monthly_expenses: float
    insurance_sum_assured: float
    income: float
    has_health_insurance: bool
    has_life_insurance: bool
    has_property_insurance: bool
    diversification_score: float = Field(ge=0, le=100)
    total_debt: float
    total_income: float
    investment_portfolio_value: float
    annual_returns_on_investment: float
    tax_paid_last_year: float
    retirement_corpus: float
    retirement_target: float

class MoneyHealthScore(BaseModel):
    total_score: float = Field(ge=0, le=100)
    emergency_preparedness: float
    insurance_coverage: float
    investment_diversification: float
    debt_health: float
    tax_efficiency: float
    retirement_readiness: float
    overall_status: str  # "POOR", "FAIR", "GOOD", "EXCELLENT"
    recommendations: List[str]

# Tax Wizard Models
class TaxInput(BaseModel):
    salary: float = Field(ge=0)
    bonus: float = Field(ge=0)
    capital_gains: float = Field(ge=0)
    other_income: float = Field(ge=0)
    standard_deduction: float = Field(ge=0)
    section_80c_investments: float = Field(ge=0, alias="80c_investments")  # ELSS, PPF, NPS, LIC
    section_80d_health_insurance: float = Field(ge=0, alias="80d_health_insurance")
    section_80e_education_loan: float = Field(ge=0, alias="80e_education_loan")
    hra_exemption: float = Field(ge=0)
    other_deductions: float = Field(ge=0)
    loss_from_house_property: float = Field(ge=0)
    
    class Config:
        populate_by_name = True

class TaxOptimization(BaseModel):
    old_regime_tax: float
    new_regime_tax: float
    recommended_regime: str
    tax_savings: float
    missing_deductions: List[str]
    tax_saving_opportunities: List[dict]
    sip_recommendation: dict

# Portfolio X-Ray Models
class MFHolding(BaseModel):
    name: str
    units: float
    nav: float
    purchase_price: float
    purchase_date: str
    sector: Optional[str] = None

class PortfolioXRayInput(BaseModel):
    holdings: List[MFHolding]
    cams_statement_text: Optional[str] = None

class XRayAnalysis(BaseModel):
    total_value: float
    total_invested: float
    total_gain: float
    xirr: float
    holdings_analysis: List[dict]
    overlap_analysis: dict
    sector_allocation: dict
    expense_ratio_drag: dict
    benchmark_comparison: dict
    rebalancing_recommendations: List[dict]

# Life Event Advisor Models
class LifeEventInput(BaseModel):
    event_type: LifeEvent
    event_amount: float
    current_age: int
    annual_income: float
    current_corpus: float
    tax_bracket: str
    risk_profile: RiskProfile
    existing_investments: dict

class LifeEventRecommendation(BaseModel):
    action: str
    allocation_amount: float
    reason: str
    tax_implications: str
    risk_level: str
    timeline: str

class LifeEventAdvice(BaseModel):
    event_type: str
    recommendations: List[LifeEventRecommendation]
    priority_actions: List[str]
    tax_planning_insights: List[str]

# Couple's Planner Models
class CoupleMemberInput(BaseModel):
    name: str
    age: int
    annual_income: float
    monthly_expenses: float
    current_investments: float
    existing_hra: Optional[float] = 0
    existing_nps: Optional[float] = 0

class CouplesPlannerInput(BaseModel):
    member1: CoupleMemberInput
    member2: CoupleMemberInput
    combined_goals: str
    risk_profile: RiskProfile

class CouplesOptimization(BaseModel):
    combined_annual_income: float
    optimized_hra_split: dict
    optimized_nps_allocation: dict
    optimized_sip_split: dict
    joint_insurance_plan: dict
    tax_efficiency_gains: float
    combined_retirement_plan: dict
    recommendations: List[str]
