"""
Financial calculation services for Money Mentor
"""
import math
from typing import List, Dict
from models import (
    FIREInput, FIREProjection, 
    MoneyHealthScoreInput, MoneyHealthScore,
    TaxInput, TaxOptimization
)

class FIRECalculator:
    """Calculate FIRE (Financial Independence, Retire Early) metrics"""
    
    @staticmethod
    def calculate_fire_projection(input_data: FIREInput) -> FIREProjection:
        """Calculate FIRE projection and required SIP"""
        
        # Annual calculations
        annual_income = input_data.monthly_income * 12
        annual_expenses = input_data.monthly_expenses * 12
        annual_savings = annual_income - annual_expenses
        
        years_to_retirement = input_data.target_retirement_age - input_data.current_age
        
        if years_to_retirement <= 0:
            raise ValueError("Target retirement age must be in the future")
        
        # Calculate target corpus (25x annual expenses for 4% withdrawal rate)
        target_corpus = annual_expenses * 25
        
        # Future value of current corpus
        rate = input_data.annual_return_rate / 100
        fv_current_corpus = input_data.current_corpus * ((1 + rate) ** years_to_retirement)
        
        # Calculate required SIP
        monthly_sip = FIRECalculator._calculate_sip(
            target=target_corpus - fv_current_corpus,
            rate=input_data.annual_return_rate / 100,
            months=years_to_retirement * 12
        )
        
        # Calculate projected corpus with recommended SIP
        projected_corpus = fv_current_corpus + FIRECalculator._future_value_annuity(
            monthly_sip, rate, years_to_retirement * 12
        )
        
        # Determine status
        shortage = max(0, target_corpus - projected_corpus)
        if projected_corpus >= target_corpus:
            status = "ON_TRACK"
        else:
            status = "SHORTFALL"
        
        # Asset allocation (conservative to aggressive)
        years_remaining = years_to_retirement
        if years_remaining > 15:
            equity = 70
            debt = 25
            gold = 5
        elif years_remaining > 10:
            equity = 60
            debt = 30
            gold = 10
        else:
            equity = 50
            debt = 35
            gold = 15
        
        allocation = {
            "equity": equity,
            "debt": debt,
            "gold": gold,
            "rationale": "Based on years to retirement"
        }
        
        return FIREProjection(
            years_to_retirement=years_to_retirement,
            monthly_sip_required=round(monthly_sip, 2),
            target_corpus=round(target_corpus, 2),
            projected_corpus=round(projected_corpus, 2),
            status=status,
            shortage_amount=round(shortage, 2),
            recommended_return_rate=input_data.annual_return_rate,
            asset_allocation=allocation
        )
    
    @staticmethod
    def _calculate_sip(target: float, rate: float, months: int) -> float:
        """Calculate required monthly SIP (simplified)"""
        if rate == 0:
            return target / months
        
        monthly_rate = rate / 12
        return target * monthly_rate / (((1 + monthly_rate) ** months) - 1)
    
    @staticmethod
    def _future_value_annuity(payment: float, rate: float, months: int) -> float:
        """Calculate future value of annuity"""
        if rate == 0:
            return payment * months
        
        monthly_rate = rate / 12
        return payment * ((((1 + monthly_rate) ** months) - 1) / monthly_rate)


class MoneyHealthScoreCalculator:
    """Calculate comprehensive money health score"""
    
    @staticmethod
    def calculate_score(input_data: MoneyHealthScoreInput) -> MoneyHealthScore:
        """Calculate 6-dimensional money health score"""
        
        # 1. Emergency Preparedness (0-100)
        months_covered = input_data.emergency_fund / (input_data.total_monthly_expenses + 1)
        emergency_score = min(100, (months_covered / input_data.emergency_fund_months) * 100)
        
        # 2. Insurance Coverage (0-100)
        insurance_coverage_needed = input_data.income * 10  # 10x income rule
        insurance_score = min(100, (input_data.insurance_sum_assured / insurance_coverage_needed) * 100)
        
        # Types of insurance bonus
        insurance_types_bonus = 0
        if input_data.has_health_insurance:
            insurance_types_bonus += 10
        if input_data.has_life_insurance:
            insurance_types_bonus += 15
        if input_data.has_property_insurance:
            insurance_types_bonus += 5
        
        insurance_score = min(100, insurance_score + (insurance_types_bonus / 30) * 20)
        
        # 3. Investment Diversification (0-100)
        diversification_score = input_data.diversification_score
        
        # 4. Debt Health (0-100)
        debt_to_income = input_data.total_debt / (input_data.total_income + 1)
        debt_score = max(0, 100 - (debt_to_income * 100))
        
        # 5. Tax Efficiency (0-100)
        effective_tax_rate = (input_data.tax_paid_last_year / input_data.total_income) if input_data.total_income > 0 else 0
        optimal_rate = 0.25  # Assuming optimal tax rate around 25%
        tax_score = max(0, 100 - (abs(effective_tax_rate - optimal_rate) / optimal_rate * 100))
        
        # 6. Retirement Readiness (0-100)
        retirement_coverage = (input_data.retirement_corpus / input_data.retirement_target * 100) if input_data.retirement_target > 0 else 50
        retirement_score = min(100, retirement_coverage)
        
        # Calculate total score
        total_score = (
            emergency_score * 0.15 +
            insurance_score * 0.20 +
            diversification_score * 0.20 +
            debt_score * 0.20 +
            tax_score * 0.15 +
            retirement_score * 0.10
        )
        
        # Determine overall status
        if total_score >= 80:
            status = "EXCELLENT"
        elif total_score >= 60:
            status = "GOOD"
        elif total_score >= 40:
            status = "FAIR"
        else:
            status = "POOR"
        
        # Generate AI-powered recommendations
        from ai_advisor import GroqAIAdvisor
        ai_advisor = GroqAIAdvisor()
        
        score_data_for_ai = {
            'total_score': total_score,
            'emergency_preparedness': emergency_score,
            'insurance_coverage': insurance_score,
            'investment_diversification': diversification_score,
            'debt_health': debt_score,
            'tax_efficiency': tax_score,
            'retirement_readiness': retirement_score,
            'monthly_income': input_data.income,
            'monthly_expenses': input_data.total_monthly_expenses,
            'total_debt': input_data.total_debt,
            'emergency_fund': input_data.emergency_fund
        }
        
        recommendations = ai_advisor.get_money_score_recommendations(score_data_for_ai)
        
        return MoneyHealthScore(
            total_score=round(total_score, 2),
            emergency_preparedness=round(emergency_score, 2),
            insurance_coverage=round(insurance_score, 2),
            investment_diversification=round(diversification_score, 2),
            debt_health=round(debt_score, 2),
            tax_efficiency=round(tax_score, 2),
            retirement_readiness=round(retirement_score, 2),
            overall_status=status,
            recommendations=recommendations
        )


class TaxCalculator:
    """Calculate tax optimization for Indian tax regimes"""
    
    @staticmethod
    def calculate_tax_optimization(input_data: TaxInput) -> TaxOptimization:
        """Compare old vs new tax regime and recommend optimizations"""
        
        # Total income
        total_income = (
            input_data.salary + 
            input_data.bonus + 
            input_data.capital_gains + 
            input_data.other_income
        )
        
        # OLD REGIME CALCULATION
        total_deductions_old = (
            input_data.standard_deduction +
            input_data.section_80c_investments +
            input_data.section_80d_health_insurance +
            input_data.section_80e_education_loan +
            input_data.hra_exemption +
            input_data.other_deductions +
            input_data.loss_from_house_property
        )
        
        taxable_income_old = max(0, total_income - total_deductions_old)
        old_regime_tax = TaxCalculator._calculate_tax_old_regime(taxable_income_old)
        
        # NEW REGIME CALCULATION
        standard_deduction_new = 50000  # Standard deduction in new regime
        taxable_income_new = max(0, total_income - standard_deduction_new)
        new_regime_tax = TaxCalculator._calculate_tax_new_regime(taxable_income_new)
        
        # Determine recommended regime
        tax_savings = abs(old_regime_tax - new_regime_tax)
        if old_regime_tax < new_regime_tax:
            recommended_regime = "Old Regime"
            savings = new_regime_tax - old_regime_tax
        else:
            recommended_regime = "New Regime"
            savings = old_regime_tax - new_regime_tax
        
        # Identify missing deductions
        missing_deductions = []
        if input_data.section_80c_investments < 150000:
            missing_deductions.append(f"80C Investments: Can invest ₹{150000 - input_data.section_80c_investments:.0f} more (ELSS, PPF, NPS, LIC)")
        if input_data.section_80d_health_insurance < 50000:
            missing_deductions.append(f"80D Health Insurance: Can invest ₹{50000 - input_data.section_80d_health_insurance:.0f} more")
        if input_data.hra_exemption == 0 and "HRA" in input_data.salary_type if hasattr(input_data, 'salary_type') else False:
            missing_deductions.append("HRA Exemption: Not claimed - check eligibility")
        
        # Tax saving opportunities
        opportunities = []
        
        # NPS contribution
        nps_limit = 50000
        opportunities.append({
            "name": "NPS (National Pension System)",
            "amount": nps_limit,
            "tax_saving": nps_limit * 0.30,  # Assuming 30% tax bracket
            "benefit": "Retirement + Tax deduction"
        })
        
        # ELSS investment
        elss_limit = 150000 - input_data.section_80c_investments
        if elss_limit > 0:
            opportunities.append({
                "name": "ELSS (Equity Linked Savings Scheme)",
                "amount": elss_limit,
                "tax_saving": elss_limit * 0.30,
                "benefit": "Tax deduction + Equity returns"
            })
        
        # SIP Recommendation
        sip_amount = max(5000, (input_data.salary * 0.10) / 12)
        
        return TaxOptimization(
            old_regime_tax=round(old_regime_tax, 2),
            new_regime_tax=round(new_regime_tax, 2),
            recommended_regime=recommended_regime,
            tax_savings=round(savings, 2),
            missing_deductions=missing_deductions,
            tax_saving_opportunities=opportunities,
            sip_recommendation={
                "monthly_amount": round(sip_amount, 2),
                "annual_amount": round(sip_amount * 12, 2),
                "fund_type": "Diversified Equity Fund",
                "reason": "Long-term wealth creation with tax benefits"
            }
        )
    
    @staticmethod
    def _calculate_tax_old_regime(taxable_income: float) -> float:
        """Calculate tax in old regime (FY 2023-24)"""
        if taxable_income <= 250000:
            return 0
        elif taxable_income <= 500000:
            return (taxable_income - 250000) * 0.05
        elif taxable_income <= 1000000:
            return 12500 + (taxable_income - 500000) * 0.20
        elif taxable_income <= 1500000:
            return 112500 + (taxable_income - 1000000) * 0.30
        else:
            return 262500 + (taxable_income - 1500000) * 0.30
    
    @staticmethod
    def _calculate_tax_new_regime(taxable_income: float) -> float:
        """Calculate tax in new regime (FY 2023-24)"""
        if taxable_income <= 300000:
            return 0
        elif taxable_income <= 500000:
            return (taxable_income - 300000) * 0.05
        elif taxable_income <= 750000:
            return 10000 + (taxable_income - 500000) * 0.10
        elif taxable_income <= 1000000:
            return 35000 + (taxable_income - 750000) * 0.15
        elif taxable_income <= 1250000:
            return 75000 + (taxable_income - 1000000) * 0.20
        elif taxable_income <= 1500000:
            return 125000 + (taxable_income - 1250000) * 0.25
        else:
            return 187500 + (taxable_income - 1500000) * 0.30


class PortfolioAnalyzer:
    """Analyze mutual fund portfolio"""
    
    @staticmethod
    def calculate_xirr_simple(cash_flows: List[Dict], end_value: float, days_invested: int) -> float:
        """Simple XIRR approximation"""
        total_invested = sum(cf['amount'] for cf in cash_flows)
        gain = end_value - total_invested
        years = days_invested / 365
        
        if total_invested == 0:
            return 0
        
        # Approximate XIRR using CAGR formula
        if years > 0:
            cagr = ((end_value / total_invested) ** (1 / years)) - 1
            return cagr * 100
        return 0
    
    @staticmethod
    def detect_overlaps(holdings: List[Dict]) -> Dict:
        """Detect overlapping funds in portfolio"""
        overlaps = []
        
        # Simplified overlap detection based on category
        categories = {}
        for holding in holdings:
            cat = holding.get('category', 'Other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(holding['name'])
        
        for category, funds in categories.items():
            if len(funds) > 1:
                overlaps.append({
                    "category": category,
                    "funds": funds,
                    "recommendation": f"Consider consolidating {category} funds for better management"
                })
        
        return {"overlaps": overlaps, "total_overlaps": len(overlaps)}
