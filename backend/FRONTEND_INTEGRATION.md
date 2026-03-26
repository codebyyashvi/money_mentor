# Frontend Integration Guide

Complete guide to integrate your Money Mentor frontend with the FastAPI backend.

## 🔌 API Configuration

### 1. Set API Base URL

Create a configuration file in your frontend:

```javascript
// src/config/api.js
export const API_BASE_URL = "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  GET_USER: "/api/auth/me",

  // Profile
  CREATE_PROFILE: "/api/profile",
  GET_PROFILE: "/api/profile",
  UPDATE_PROFILE: "/api/profile",

  // Calculations
  CALCULATE_FIRE: "/api/calculate/fire",
  CALCULATE_MONEY_SCORE: "/api/calculate/money-score",
  GET_SCORE_HISTORY: "/api/money-score/history",
  CALCULATE_TAX: "/api/calculate/tax",
  ANALYZE_PORTFOLIO: "/api/portfolio/xray",
  GET_LIFE_EVENT_ADVICE: "/api/life-event/advice",
  OPTIMIZE_COUPLES: "/api/couple-planner/optimize",

  // Utility
  HEALTH: "/api/health",
  ROOT: "/"
};
```

### 2. Create API Service

```javascript
// src/services/api.js
import { API_BASE_URL } from "../config/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { "Authorization": `Bearer ${token}` })
});

export const apiCall = async (method, endpoint, data = null, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: getHeaders(token),
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/form";
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};
```

## 🔐 Authentication

### Register New User

```javascript
// src/services/auth.js
import { apiCall } from "./api";
import { API_ENDPOINTS } from "../config/api";

export const registerUser = async (email, password, name, phone) => {
  const response = await apiCall("POST", API_ENDPOINTS.REGISTER, {
    email,
    password,
    name,
    phone
  });
  
  // Store token
  localStorage.setItem("token", response.access_token);
  localStorage.setItem("user_id", response.user_id);
  
  return response;
};

export const loginUser = async (email, password) => {
  const response = await apiCall("POST", API_ENDPOINTS.LOGIN, {
    email,
    password
  });
  
  localStorage.setItem("token", response.access_token);
  localStorage.setItem("user_id", response.user_id);
  
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  return await apiCall("GET", API_ENDPOINTS.GET_USER, null, token);
};

export const getToken = () => localStorage.getItem("token");
```

### Update FormPage Component

```javascript
// src/pages/FormPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

export default function FormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    age: "",
    income: "",
    monthlyExpenses: "",
    existingInvestments: "",
    debt: "",
    riskProfile: "moderate",
    investmentExperience: "intermediate"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Register user
      await registerUser(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      );
      
      // Then create financial profile
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          annual_income: parseFloat(formData.income),
          monthly_expenses: parseFloat(formData.monthlyExpenses),
          current_investments: parseFloat(formData.existingInvestments),
          current_savings: parseFloat(formData.existingInvestments),
          debt: parseFloat(formData.debt),
          risk_profile: formData.riskProfile,
          investment_experience: formData.investmentExperience,
          life_goals: ""
        })
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form JSX here */}
      {error && <div className="error">{error}</div>}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Get Started"}
      </button>
    </div>
  );
}
```

## 📊 Data Integration

### FIRE Path Planner

```javascript
// src/pages/FirePlanner.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function FirePlanner() {
  const [fireData, setFireData] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateFIRE = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.CALCULATE_FIRE,
        {
          current_age: parseInt(formData.age),
          monthly_income: parseFloat(formData.monthlyIncome),
          monthly_expenses: parseFloat(formData.monthlyExpenses),
          current_corpus: parseFloat(formData.currentCorpus),
          annual_return_rate: 12,
          inflation_rate: 5,
          target_retirement_age: parseInt(formData.retirementAge)
        },
        token
      );
      
      setFireData(response);
    } catch (error) {
      console.error("FIRE calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {fireData && (
        <div>
          <p>Monthly SIP Required: ₹{fireData.projection.monthly_sip_required}</p>
          <p>Status: {fireData.projection.status}</p>
          <p>Target Corpus: ₹{fireData.projection.target_corpus}</p>
          <ul>
            {fireData.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Money Health Score

```javascript
// src/pages/MoneyScore.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function MoneyScore() {
  const [score, setScore] = useState(null);

  const calculateScore = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.CALCULATE_MONEY_SCORE,
        {
          emergency_fund: parseFloat(formData.emergencyFund),
          emergency_fund_months: 6,
          total_monthly_expenses: parseFloat(formData.monthlyExpenses),
          insurance_sum_assured: parseFloat(formData.insurance),
          income: parseFloat(formData.income),
          has_health_insurance: formData.hasHealthInsurance,
          has_life_insurance: formData.hasLifeInsurance,
          has_property_insurance: formData.hasPropertyInsurance,
          diversification_score: 70,
          total_debt: parseFloat(formData.debt),
          total_income: parseFloat(formData.income),
          investment_portfolio_value: parseFloat(formData.investments),
          annual_returns_on_investment: parseFloat(formData.investments) * 0.12,
          tax_paid_last_year: parseFloat(formData.income) * 0.3,
          retirement_corpus: parseFloat(formData.retirementCorpus),
          retirement_target: parseFloat(formData.income) * 250
        },
        token
      );
      
      setScore(response);
    } catch (error) {
      console.error("Score calculation error:", error);
    }
  };

  return (
    <div>
      {score && (
        <div>
          <h2>Your Money Health Score: {score.total_score}/100</h2>
          <p>Status: {score.overall_status}</p>
          <div>
            <p>Emergency: {score.emergency_preparedness}</p>
            <p>Insurance: {score.insurance_coverage}</p>
            <p>Diversification: {score.investment_diversification}</p>
            <p>Debt: {score.debt_health}</p>
            <p>Tax: {score.tax_efficiency}</p>
            <p>Retirement: {score.retirement_readiness}</p>
          </div>
          <ul>
            {score.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Tax Wizard

```javascript
// src/pages/TaxWizard.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function TaxWizard() {
  const [taxResult, setTaxResult] = useState(null);

  const calculateTax = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.CALCULATE_TAX,
        {
          salary: parseFloat(formData.salary),
          bonus: parseFloat(formData.bonus),
          capital_gains: parseFloat(formData.capitalGains),
          other_income: 0,
          standard_deduction: 50000,
          80c_investments: parseFloat(formData.elss80c),
          80d_health_insurance: parseFloat(formData.healthInsurance),
          80e_education_loan: 0,
          hra_exemption: parseFloat(formData.hra),
          other_deductions: 0,
          loss_from_house_property: 0
        },
        token
      );
      
      setTaxResult(response);
    } catch (error) {
      console.error("Tax calculation error:", error);
    }
  };

  return (
    <div>
      {taxResult && (
        <div>
          <p>Old Regime Tax: ₹{taxResult.old_regime_tax}</p>
          <p>New Regime Tax: ₹{taxResult.new_regime_tax}</p>
          <p className="highlight">
            Recommended: {taxResult.recommended_regime}
          </p>
          <p>Tax Savings: ₹{taxResult.tax_savings}</p>
          
          <h3>Missing Deductions:</h3>
          <ul>
            {taxResult.missing_deductions.map((ded, idx) => (
              <li key={idx}>{ded}</li>
            ))}
          </ul>
          
          <h3>Tax-Saving Opportunities:</h3>
          {taxResult.tax_saving_opportunities.map((opp, idx) => (
            <div key={idx}>
              <h4>{opp.name}</h4>
              <p>Amount: ₹{opp.amount}</p>
              <p>Tax Saving: ₹{opp.tax_saving}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Portfolio X-Ray

```javascript
// src/pages/MFXray.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function MFXray() {
  const [analysis, setAnalysis] = useState(null);

  const analyzePortfolio = async (holdings) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.ANALYZE_PORTFOLIO,
        {
          holdings: holdings.map(h => ({
            name: h.name,
            units: parseFloat(h.units),
            nav: parseFloat(h.nav),
            purchase_price: parseFloat(h.purchasePrice),
            purchase_date: h.purchaseDate,
            sector: h.sector,
            performance: parseFloat(h.performance)
          }))
        },
        token
      );
      
      setAnalysis(response);
    } catch (error) {
      console.error("Portfolio analysis error:", error);
    }
  };

  return (
    <div>
      {analysis && (
        <div>
          <p>Total Value: ₹{analysis.total_value}</p>
          <p>XIRR: {analysis.xirr}%</p>
          <p>Total Gain: ₹{analysis.total_gain}</p>
          
          <h3>Holdings:</h3>
          {analysis.holdings_analysis.map((h, idx) => (
            <div key={idx}>
              <p>{h.name}: ₹{h.value} ({h.allocation_percent}%)</p>
            </div>
          ))}
          
          <h3>Rebalancing Recommendations:</h3>
          {analysis.rebalancing_recommendations.map((rec, idx) => (
            <div key={idx}>
              <p>{rec.fund}: {rec.action}</p>
              <p>From {rec.current_allocation}% to {rec.recommended_allocation}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Life Event Advisor

```javascript
// src/pages/LifeEvent.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function LifeEvent() {
  const [advice, setAdvice] = useState(null);

  const getAdvice = async (eventType, amount) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.GET_LIFE_EVENT_ADVICE,
        {
          event_type: eventType,
          event_amount: parseFloat(amount),
          current_age: 28,
          annual_income: 1200000,
          current_corpus: 2000000,
          tax_bracket: "30%",
          risk_profile: "moderate",
          existing_investments: {}
        },
        token
      );
      
      setAdvice(response);
    } catch (error) {
      console.error("Life event advice error:", error);
    }
  };

  return (
    <div>
      {advice && (
        <div>
          <h2>{advice.event_type} - Financial Advice</h2>
          
          <h3>Recommendations:</h3>
          {advice.recommendations.map((rec, idx) => (
            <div key={idx}>
              <h4>{rec.action}</h4>
              <p>Amount: ₹{rec.allocation_amount}</p>
              <p>Reason: {rec.reason}</p>
              <p>Tax: {rec.tax_implications}</p>
            </div>
          ))}
          
          <h3>Priority Actions:</h3>
          <ul>
            {advice.priority_actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Couple's Money Planner

```javascript
// src/pages/CoupleePlanner.jsx
import { useState } from "react";
import { apiCall } from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export default function CoupleePlanner() {
  const [optimization, setOptimization] = useState(null);

  const optimizeCouple = async (member1, member2) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiCall(
        "POST",
        API_ENDPOINTS.OPTIMIZE_COUPLES,
        {
          member1: {
            name: member1.name,
            age: parseInt(member1.age),
            annual_income: parseFloat(member1.income),
            monthly_expenses: parseFloat(member1.expenses),
            current_investments: parseFloat(member1.investments),
            existing_hra: parseFloat(member1.hra),
            existing_nps: parseFloat(member1.nps)
          },
          member2: {
            name: member2.name,
            age: parseInt(member2.age),
            annual_income: parseFloat(member2.income),
            monthly_expenses: parseFloat(member2.expenses),
            current_investments: parseFloat(member2.investments),
            existing_hra: parseFloat(member2.hra),
            existing_nps: parseFloat(member2.nps)
          },
          combined_goals: "FIRE in 15 years",
          risk_profile: "moderate"
        },
        token
      );
      
      setOptimization(response);
    } catch (error) {
      console.error("Couple optimization error:", error);
    }
  };

  return (
    <div>
      {optimization && (
        <div>
          <p>Combined Income: ₹{optimization.combined_annual_income}</p>
          <p>Tax Efficiency Gains: ₹{optimization.tax_efficiency_gains}</p>
          
          <h3>Optimized Allocations:</h3>
          <p>Monthly SIP: ₹{optimization.optimized_sip_split.total_monthly}</p>
          <p>NPS Total: ₹{optimization.optimized_nps_allocation.total_contribution}</p>
          
          <h3>Recommendations:</h3>
          <ul>
            {optimization.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## ⚠️ Important Configuration

### CORS Setup
Make sure backend has CORS enabled (already done in app.py):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token Management
```javascript
// Create axios interceptor (if using axios)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/form";
    }
    return Promise.reject(error);
  }
);
```

## 🔄 Common Patterns

### Protected Route Component
```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ Component }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/form" />;
  }
  
  return <Component />;
};
```

### Error Handling
```javascript
const handleError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    // Redirect to login
  }
  
  const errorMessage = error.response?.data?.error || 
                       error.message || 
                       "An error occurred";
  
  showErrorNotification(errorMessage);
};
```

## ✅ Testing Checklist

- [ ] Register new user
- [ ] Login existing user
- [ ] Get user profile
- [ ] Calculate FIRE
- [ ] Calculate money score
- [ ] Calculate tax
- [ ] Analyze portfolio
- [ ] Get life event advice
- [ ] Optimize couple finances
- [ ] Verify token refresh
- [ ] Test error handling
- [ ] Test timeout scenarios

---

Your frontend is now ready to integrate with the Money Mentor backend!
