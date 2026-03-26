import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { moneyScoreAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MoneyScore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [input, setInput] = useState({
    emergency_fund: 200000,
    emergency_fund_months: 3,
    total_monthly_expenses: 50000,
    insurance_sum_assured: 500000,
    income: 100000,
    has_health_insurance: true,
    has_life_insurance: false,
    has_property_insurance: false,
    diversification_score: 60,
    total_debt: 500000,
    total_income: 1200000,
    investment_portfolio_value: 1000000,
    annual_returns_on_investment: 100000,
    tax_paid_last_year: 150000,
    retirement_corpus: 500000,
    retirement_target: 5000000,
  });

  const calculateScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await moneyScoreAPI.calculate(input);
      setResult(response);
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to calculate Money Health Score");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
    }).format(value);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 bg-green-500/10";
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const getStatusConfig = (score) => {
    let status = "fair";
    if (score >= 80) status = "excellent";
    else if (score >= 60) status = "good";
    else if (score >= 40) status = "needs-work";
    else status = "critical";

    const config = {
      excellent: { text: "Excellent", bg: "bg-green-500/20", border: "border-green-500/30" },
      good: { text: "Good", bg: "bg-blue-500/20", border: "border-blue-500/30" },
      "needs-work": { text: "Needs Work", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
      critical: { text: "Critical", bg: "bg-red-500/20", border: "border-red-500/30" },
      fair: { text: "Fair", bg: "bg-orange-500/20", border: "border-orange-500/30" }
    };
    return config[status];
  };

  const scoreCategories = result ? [
    {
      category: "Emergency Preparedness",
      score: result.emergency_preparedness,
      icon: "🆘",
      description: `You have ${input.emergency_fund_months} months of expenses saved.`
    },
    {
      category: "Insurance Coverage",
      score: result.insurance_coverage,
      icon: "🛡️",
      description: `Your sum assured is ${formatCurrency(input.insurance_sum_assured)}.`
    },
    {
      category: "Investment Diversification",
      score: result.investment_diversification,
      icon: "📊",
      description: "Your portfolio diversification score is important for risk management."
    },
    {
      category: "Debt Health",
      score: result.debt_health,
      icon: "💳",
      description: `Your total debt is ${formatCurrency(input.total_debt)}.`
    },
    {
      category: "Tax Efficiency",
      score: result.tax_efficiency,
      icon: "💸",
      description: `You paid ${formatCurrency(input.tax_paid_last_year)} in taxes last year.`
    },
    {
      category: "Retirement Readiness",
      score: result.retirement_readiness,
      icon: "🎯",
      description: `You need ${formatCurrency(input.retirement_target - input.retirement_corpus)} more for retirement.`
    }
  ] : [];

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="section-title mb-2">Money Health Score</h1>
          <p className="section-subtitle">Comprehensive financial wellness assessment across 6 dimensions</p>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="card mb-12 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Your Financial Information</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Emergency Fund Saved (₹)</label>
                  <input
                    type="number"
                    value={input.emergency_fund}
                    onChange={e => setInput({...input, emergency_fund: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Emergency Fund Months</label>
                  <input
                    type="number"
                    value={input.emergency_fund_months}
                    onChange={e => setInput({...input, emergency_fund_months: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={input.income}
                    onChange={e => setInput({...input, income: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={input.total_monthly_expenses}
                    onChange={e => setInput({...input, total_monthly_expenses: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Total Debt (₹)</label>
                  <input
                    type="number"
                    value={input.total_debt}
                    onChange={e => setInput({...input, total_debt: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Annual Income (₹)</label>
                  <input
                    type="number"
                    value={input.total_income}
                    onChange={e => setInput({...input, total_income: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Investment Portfolio Value (₹)</label>
                  <input
                    type="number"
                    value={input.investment_portfolio_value}
                    onChange={e => setInput({...input, investment_portfolio_value: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Insurance Sum Assured (₹)</label>
                  <input
                    type="number"
                    value={input.insurance_sum_assured}
                    onChange={e => setInput({...input, insurance_sum_assured: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>

              <button
                onClick={calculateScore}
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Calculate Money Health Score'}
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && result.total_score !== undefined && (
          <>
            {/* Overall Score */}
            <div className="card mb-12 border-2 border-primary-500/30">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="flex justify-center md:justify-start">
                  <div className="relative">
                    <svg className="w-40 h-40" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="6" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        strokeDasharray={`${(result.total_score / 100) * 282} 282`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                      <text x="50" y="50" textAnchor="middle" dy="5" className="text-3xl font-bold fill-primary-400">
                        {Math.round(result.total_score)}
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold mb-2">Your Score: {Math.round(result.total_score)}/100</h2>
                  <p className="text-secondary-300 mb-6">{result.overall_status}</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-outline"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-6 mb-12">
              {scoreCategories.map((item, idx) => {
                const statusConfig = getStatusConfig(item.score);
                return (
                  <div key={idx} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{item.category}</h3>
                          <p className="text-secondary-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-3xl font-bold ${getScoreColor(item.score)} px-4 py-2 rounded-lg`}>
                          {Math.round(item.score)}
                        </div>
                        <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
                          {statusConfig.text}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-secondary-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            item.score >= 80 ? "bg-green-500" : item.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">AI Recommendations</h2>
                <div className="space-y-4">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-secondary-700/30 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-500/20">
                          <span className="font-bold text-primary-400">{idx + 1}</span>
                        </div>
                      </div>
                      <p className="text-secondary-200">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
