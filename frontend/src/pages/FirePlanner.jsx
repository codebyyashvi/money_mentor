import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fireAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FirePlanner() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const [input, setInput] = useState({
    current_age: 28,
    target_retirement_age: 45,
    monthly_income: 83333,
    monthly_expenses: 41667,
    current_corpus: 1850000,
    expected_inflation: 5.5,
    expected_return: 10,
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateFire = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform frontend field names to backend field names
      const fireData = {
        current_age: input.current_age,
        target_retirement_age: input.target_retirement_age,
        monthly_income: input.monthly_income,
        monthly_expenses: input.monthly_expenses,
        current_corpus: input.current_corpus,
        inflation_rate: input.expected_inflation,
        annual_return_rate: input.expected_return,
      };

      const response = await fireAPI.calculate(fireData);
      setPlan(response);
    } catch (err) {
      setError(err.message || "Failed to calculate FIRE plan");
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

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">FIRE Path Planner</h1>
        <p className="section-subtitle">Build your month-by-month wealth roadmap</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Your Information</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Current Age</label>
                <input
                  type="number"
                  value={input.current_age}
                  onChange={e => setInput({...input, current_age: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Target Retirement Age</label>
                <input
                  type="number"
                  value={input.target_retirement_age}
                  onChange={e => setInput({...input, target_retirement_age: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Monthly Income (₹)</label>
                <input
                  type="number"
                  value={input.monthly_income}
                  onChange={e => setInput({...input, monthly_income: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={input.monthly_expenses}
                  onChange={e => setInput({...input, monthly_expenses: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Existing Investments (₹)</label>
                <input
                  type="number"
                  value={input.current_corpus}
                  onChange={e => setInput({...input, current_corpus: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expected Inflation (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={input.expected_inflation}
                    onChange={e => setInput({...input, expected_inflation: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Expected Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={input.expected_return}
                    onChange={e => setInput({...input, expected_return: parseFloat(e.target.value)})}
                    className="input-field"
                  />
                </div>
              </div>

              <button
                onClick={calculateFire}
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Generate FIRE Plan'}
              </button>
            </div>
          </div>

          {/* Results */}
          {plan && (
            <div className="space-y-4">
              <div className="card border-l-4 border-l-primary-500 bg-primary-500/5">
                <p className="text-secondary-400 text-sm mb-2">Years to Retirement</p>
                <p className="text-4xl font-bold text-primary-400">{plan.projection.years_to_retirement}</p>
                <p className="text-secondary-400 mt-2">By age {input.target_retirement_age}</p>
              </div>

              <div className="card border-l-4 border-l-accent-500 bg-accent-500/5">
                <p className="text-secondary-400 text-sm mb-2">Target FIRE Corpus</p>
                <p className="text-4xl font-bold text-accent-400">{formatCurrency(plan.projection.target_corpus)}</p>
                <p className="text-secondary-400 text-sm mt-2">Based on 4% withdrawal rule</p>
              </div>

              <div className="card border-l-4 border-l-yellow-500 bg-yellow-500/5">
                <p className="text-secondary-400 text-sm mb-2">Monthly SIP Required</p>
                <p className="text-3xl font-bold text-yellow-400">{formatCurrency(plan.projection.monthly_sip_required)}</p>
                <p className="text-secondary-400 text-sm mt-2">To achieve your FIRE goal</p>
              </div>

              <div className="card border-l-4 border-l-cyan-500 bg-cyan-500/5">
                <p className="text-secondary-400 text-sm mb-2">Projected Corpus (at retirement)</p>
                <p className="text-3xl font-bold text-cyan-400">{formatCurrency(plan.projection.projected_corpus)}</p>
              </div>

              {plan.projection.shortage_amount && plan.projection.shortage_amount > 0 && (
                <div className="card border-l-4 border-l-red-500 bg-red-500/5">
                  <p className="text-secondary-400 text-sm mb-2">Funding Shortage</p>
                  <p className="text-3xl font-bold text-red-400">{formatCurrency(plan.projection.shortage_amount)}</p>
                  <p className="text-secondary-400 text-sm mt-2">Increase monthly SIP to close the gap</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {plan && plan.recommendations && plan.recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">AI Recommendations</h2>
            <div className="space-y-4">
              {plan.recommendations.map((rec, idx) => (
                <div key={idx} className="card flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20">
                      <span className="font-bold text-primary-400">{idx + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary-200">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
