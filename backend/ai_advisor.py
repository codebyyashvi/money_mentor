"""
Groq AI integration for financial recommendations
"""
from groq import Groq
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class GroqAIAdvisor:
    """Use Groq for AI-powered financial recommendations"""
    
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        if groq_api_key:
            self.client = Groq(api_key=groq_api_key)
        else:
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Groq API is available"""
        return self.client is not None
    
    def get_fire_recommendations(self, fire_data: dict) -> List[str]:
        """Get AI recommendations for FIRE planning"""
        if not self.is_available():
            return self._get_fallback_fire_recommendations(fire_data)
        
        prompt = f"""Based on this FIRE planning data:
- Current age: {fire_data.get('current_age')}
- Target retirement age: {fire_data.get('target_retirement_age')}
- Monthly income: ₹{fire_data.get('monthly_income'):,.0f}
- Monthly expenses: ₹{fire_data.get('monthly_expenses'):,.0f}
- Current corpus: ₹{fire_data.get('current_corpus'):,.0f}
- Required monthly SIP: ₹{fire_data.get('monthly_sip', 'TBD'):,}
- Status: {fire_data.get('status')}

Provide 3-4 specific, actionable recommendations for this person to achieve FIRE. Format as a numbered list."""
        
        try:
            groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            message = self.client.chat.completions.create(
                model=groq_model,
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.choices[0].message.content
            # Parse recommendations from response
            recommendations = [line.strip() for line in response_text.split('\n') if line.strip() and any(c.isdigit() for c in line[:2])]
            return recommendations if recommendations else self._get_fallback_fire_recommendations(fire_data)
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._get_fallback_fire_recommendations(fire_data)
    
    def get_tax_recommendations(self, tax_data: dict) -> List[str]:
        """Get AI recommendations for tax optimization"""
        if not self.is_available():
            return self._get_fallback_tax_recommendations(tax_data)

        def get_number(*keys: str) -> float:
            for key in keys:
                value = tax_data.get(key)
                if value is None:
                    continue
                try:
                    return float(value)
                except (TypeError, ValueError):
                    continue
            return 0.0

        salary = get_number("salary")
        bonus = get_number("bonus")
        capital_gains = get_number("capital_gains", "capitalGains")
        investments_80c = get_number("80c_investments", "section_80c_investments")
        insurance_80d = get_number("80d_health_insurance", "section_80d_health_insurance")
        hra_exemption = get_number("hra_exemption", "hraExemption")
        
        prompt = f"""Based on this tax profile:
- Annual salary: ₹{salary:,.0f}
- Bonus: ₹{bonus:,.0f}
- Capital gains: ₹{capital_gains:,.0f}
- Current 80C investments: ₹{investments_80c:,.0f}
- Current health insurance: ₹{insurance_80d:,.0f}
- HRA exemption claimed: {hra_exemption > 0}

Provide 4-5 specific tax-saving strategies tailored to this income level. Format as a numbered list with brief explanations."""
        
        try:
            groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            message = self.client.chat.completions.create(
                model=groq_model,
                max_tokens=600,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.choices[0].message.content
            recommendations = [line.strip() for line in response_text.split('\n') if line.strip() and any(c.isdigit() for c in line[:2])]
            return recommendations if recommendations else self._get_fallback_tax_recommendations(tax_data)
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._get_fallback_tax_recommendations(tax_data)
    
    def get_life_event_advice(self, event_type: str, amount: float, profile: dict) -> dict:
        """Get AI advice for life event financial decisions"""
        if not self.is_available():
            return self._get_fallback_life_event_advice(event_type, amount, profile)
        
        prompt = f"""A {profile.get('age')}-year-old with annual income ₹{profile.get('annual_income'):,.0f} and existing investments ₹{profile.get('current_corpus'):,.0f} has just received ₹{amount:,.0f} from a {event_type.replace('_', ' ')}.

Given their {profile.get('risk_profile', 'moderate')} risk profile, provide:
1. 3-4 recommended actions for this amount
2. Tax implications in India
3. Timeline for these actions

Be specific with amounts and percentages."""
        
        try:
            groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            message = self.client.chat.completions.create(
                model=groq_model,
                max_tokens=700,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return {
                "advice": message.choices[0].message.content,
                "source": "AI-powered"
            }
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._get_fallback_life_event_advice(event_type, amount, profile)
    
    @staticmethod
    def _get_fallback_fire_recommendations(fire_data: dict) -> List[str]:
        """Fallback recommendations when Groq is unavailable"""
        status = fire_data.get('status', 'SHORTFALL')
        
        if status == "ON_TRACK":
            return [
                "You're on track! Continue with your SIP discipline and avoid lifestyle inflation",
                "Review your portfolio allocation annually and rebalance towards debt as you age",
                "Keep your emergency fund separate and review annually for inflation",
                "Consider increasing SIPs with bonus/salary increments to accelerate retirement"
            ]
        else:
            return [
                f"You have a shortfall of ₹{fire_data.get('shortage_amount', 0):,.0f}. Consider increasing your SIP or working longer",
                "Optimize your expenses - even 5-10% reduction can significantly impact your FIRE date",
                "Explore side income opportunities to boost savings rate",
                "Review your asset allocation to potentially increase returns with appropriate risk"
            ]
    
    @staticmethod
    def _get_fallback_tax_recommendations(tax_data: dict) -> List[str]:
        """Fallback tax recommendations when Groq is unavailable"""
        return [
            "Maximize 80C investments (₹1.5L limit): ELSS, PPF, NPS, or LIC",
            "Claim HRA exemption if eligible - it's one of the highest deductions available",
            "Use 80D for health insurance premiums (₹25K for self, ₹50K if including parents)",
            "Invest in NPS for tax deduction + retirement benefits",
            "Use capital losses to offset capital gains where applicable"
        ]
    
    @staticmethod
    def _get_fallback_life_event_advice(event_type: str, amount: float, profile: dict) -> dict:
        """Fallback life event advice when Groq is unavailable"""
        return {
            "advice": f"For this ₹{amount:,.0f} windfall from {event_type}, consider: 1) Build emergency fund (3-6 months), 2) Pay off high-interest debt, 3) Invest in tax-efficient instruments based on your goals, 4) Consult a tax professional for applicable deductions",
            "source": "Rule-based"
        }
    
    def get_money_score_recommendations(self, score_data: dict) -> List[str]:
        """Get AI recommendations for money health score"""
        if not self.is_available():
            return self._get_fallback_money_score_recommendations(score_data)
        
        prompt = f"""Based on this financial health assessment:
- Overall Money Health Score: {score_data.get('total_score', 0)}/100
- Emergency Preparedness: {score_data.get('emergency_preparedness', 0)}/100
- Insurance Coverage: {score_data.get('insurance_coverage', 0)}/100
- Investment Diversification: {score_data.get('investment_diversification', 0)}/100
- Debt Health: {score_data.get('debt_health', 0)}/100
- Tax Efficiency: {score_data.get('tax_efficiency', 0)}/100
- Retirement Readiness: {score_data.get('retirement_readiness', 0)}/100
- Monthly Income: ₹{score_data.get('monthly_income', 0):,.0f}
- Monthly Expenses: ₹{score_data.get('monthly_expenses', 0):,.0f}
- Total Debt: ₹{score_data.get('total_debt', 0):,.0f}
- Emergency Fund: ₹{score_data.get('emergency_fund', 0):,.0f}

Provide 4-5 specific, actionable recommendations to improve this person's financial health. Prioritize by impact and feasibility. Format each recommendation on a new line without numbering."""
        
        try:
            groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            message = self.client.chat.completions.create(
                model=groq_model,
                max_tokens=600,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.choices[0].message.content
            # Split by newlines and clean up
            recommendations = [
                line.strip() 
                for line in response_text.split('\n') 
                if line.strip() and len(line.strip()) > 10
            ]
            return recommendations if recommendations else self._get_fallback_money_score_recommendations(score_data)
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._get_fallback_money_score_recommendations(score_data)
    
    @staticmethod
    def _get_fallback_money_score_recommendations(score_data: dict) -> List[str]:
        """Fallback recommendations when Groq is unavailable"""
        recommendations = []
        
        emergency = score_data.get('emergency_preparedness', 0)
        insurance = score_data.get('insurance_coverage', 0)
        diversification = score_data.get('investment_diversification', 0)
        debt = score_data.get('debt_health', 0)
        tax = score_data.get('tax_efficiency', 0)
        retirement = score_data.get('retirement_readiness', 0)
        
        # Prioritize by score - focus on weakest areas first
        scores = [
            (emergency, "Build your emergency fund to 6 months of expenses. This provides financial security during unexpected circumstances."),
            (insurance, "Increase life and health insurance coverage. Target 10x annual income for life insurance and ₹10L+ for health insurance."),
            (diversification, "Diversify investments across equity (stocks, equity funds), debt (bonds, fixed deposits), and real assets (gold, property)."),
            (debt, "Create a structured debt repayment plan. Prioritize high-interest debt (credit cards, personal loans) first."),
            (tax, "Optimize taxes through 80C investments (₹1.5L): ELSS, PPF, NPS, or life insurance premiums."),
            (retirement, "Increase retirement savings through SIPs. Target 15-20% of monthly income for long-term retirement corpus.")
        ]
        
        # Sort by score (ascending) and take the 4 lowest scoring areas
        sorted_scores = sorted(scores, key=lambda x: x[0])
        for _, rec in sorted_scores[:4]:
            recommendations.append(rec)
        
        return recommendations

class AIGeneratedContent:
    """Generate AI content for articles and insights"""
    
    @staticmethod
    def generate_financial_insight(topic: str) -> str:
        """Generate financial insight for a topic"""
        groq_api_key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=groq_api_key) if groq_api_key else None
        
        if not client:
            return f"Learn more about {topic} to improve your financial health."
        
        prompt = f"Write a 2-3 line brief financial insight about {topic} relevant to Indian investors. Keep it practical and actionable."
        
        try:
            groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            message = client.chat.completions.create(
                model=groq_model,
                max_tokens=150,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.choices[0].message.content
        except Exception as e:
            print(f"Error generating insight: {e}")
            return f"Learn more about {topic} to improve your financial health."
