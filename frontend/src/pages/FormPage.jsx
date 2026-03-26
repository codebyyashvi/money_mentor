// src/pages/FormPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { profileAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function FormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    age: "",
    gender: "",
    
    // Financial Situation
    currentIncome: "",
    incomeSource: "salary",
    monthlyExpenses: "",
    
    // Investment Profile
    existingInvestments: "",
    investmentTypes: [],
    riskProfile: "moderate",
    investmentExperience: "beginner",
    
    // Goals
    financialGoals: [],
    retirementAge: "",
    lifeGoals: "",
    
    // Additional Info
    loans: "",
    emergencyFund: "",
    insurance: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckbox = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert emergency fund values
      const emergencyFundMap = {
        "none": 0,
        "one": 1,
        "three": 3,
        "six": 6,
        "twelve": 12
      };

      // Transform frontend camelCase data to backend snake_case
      const backendData = {
        name: formData.name,
        age: parseInt(formData.age),
        annual_income: parseFloat(formData.currentIncome) || 0,
        monthly_expenses: parseFloat(formData.monthlyExpenses) || 0,
        current_savings: 0, // Not in form yet
        current_investments: parseFloat(formData.existingInvestments) || 0,
        debt: parseFloat(formData.loans === "yes" ? formData.monthlyExpenses : 0) || 0,
        risk_profile: formData.riskProfile,
        investment_experience: formData.investmentExperience,
        life_goals: formData.lifeGoals || formData.financialGoals.join(", "),
        emergency_fund_months: emergencyFundMap[formData.emergencyFund] || 6,
      };

      await profileAPI.create(backendData);
      localStorage.setItem("userProfile", JSON.stringify(formData));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="bg-gradient-midnight min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="section-title">Financial Profile</h1>
            <p className="text-secondary-400 text-sm">Step {step} of 4</p>
          </div>
          <div className="w-full bg-secondary-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="card mb-8 min-h-96">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Let's Start with Basics</h2>
                <p className="text-secondary-400">Tell us about yourself so we can personalize your financial plan.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Raj Kumar"
                    className="input-field"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="28"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Monthly Income (₹)</label>
                  <input
                    type="number"
                    name="currentIncome"
                    value={formData.currentIncome}
                    onChange={handleInputChange}
                    placeholder="₹1,00,000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Primary Income Source</label>
                  <select
                    name="incomeSource"
                    value={formData.incomeSource}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="salary">Salary/Employment</option>
                    <option value="business">Business/Self-Employed</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investment</option>
                    <option value="mixed">Mixed Sources</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Financial Situation */}
          {step === 2 && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Financial Situation</h2>
                <p className="text-secondary-400">Help us understand your current finances.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    name="monthlyExpenses"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    placeholder="₹50,000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Current Investments (₹)</label>
                  <input
                    type="number"
                    name="existingInvestments"
                    value={formData.existingInvestments}
                    onChange={handleInputChange}
                    placeholder="₹5,00,000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Where are your investments? (Select all)</label>
                  <div className="space-y-2">
                    {["Mutual Funds", "Stocks", "Fixed Deposits", "Bonds", "Real Estate", "Gold", "Savings Account"].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.investmentTypes.includes(type)}
                          onChange={() => handleCheckbox("investmentTypes", type)}
                          className="w-4 h-4 accent-primary-500"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Do you have any loans?</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                      <input
                        type="radio"
                        name="loans"
                        value="yes"
                        checked={formData.loans === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                      <input
                        type="radio"
                        name="loans"
                        value="no"
                        checked={formData.loans === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">Emergency Fund (months of expenses)</label>
                  <select
                    name="emergencyFund"
                    value={formData.emergencyFund}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select amount</option>
                    <option value="none">No emergency fund</option>
                    <option value="one">1 month</option>
                    <option value="three">3 months</option>
                    <option value="six">6 months</option>
                    <option value="twelve">12+ months</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Investment Profile */}
          {step === 3 && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Investment Profile</h2>
                <p className="text-secondary-400">We'll personalize recommendations based on your risk tolerance.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">What's your risk tolerance?</label>
                  <div className="space-y-2">
                    {[
                      { value: "conservative", label: "Conservative", desc: "Prefer stability, minimal risk" },
                      { value: "moderate", label: "Moderate", desc: "Balanced growth and safety" },
                      { value: "aggressive", label: "Aggressive", desc: "Maximize growth, can handle volatility" }
                    ].map(option => (
                      <label key={option.value} className="flex items-start gap-3 cursor-pointer p-4 border-2 border-secondary-700 rounded-lg hover:border-primary-500/50 transition-colors" style={{borderColor: formData.riskProfile === option.value ? '#22c55e' : 'inherit'}}>
                        <input
                          type="radio"
                          name="riskProfile"
                          value={option.value}
                          checked={formData.riskProfile === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-primary-500 mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-sm text-secondary-400">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Investment Experience</label>
                  <select
                    name="investmentExperience"
                    value={formData.investmentExperience}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="beginner">Beginner - Never invested</option>
                    <option value="intermediate">Intermediate - Some experience</option>
                    <option value="advanced">Advanced - Very experienced</option>
                  </select>
                </div>

                <div>
                  <label className="label">Insurance Coverage</label>
                  <select
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select coverage status</option>
                    <option value="none">No insurance</option>
                    <option value="basic">Basic life insurance</option>
                    <option value="adequate">Adequate coverage</option>
                    <option value="comprehensive">Comprehensive coverage</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Financial Goals</h2>
                <p className="text-secondary-400">What do you want to achieve? (Select all that apply)</p>
              </div>

              <div className="space-y-2">
                {[
                  "Early Retirement (FIRE)",
                  "Buy a Home",
                  "Build Emergency Fund",
                  "Pay Off Debt",
                  "Child's Education",
                  "Marriage/Wedding",
                  "World Travel",
                  "Start a Business"
                ].map(goal => (
                  <label key={goal} className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.financialGoals.includes(goal)}
                      onChange={() => handleCheckbox("financialGoals", goal)}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="label">Target Retirement Age</label>
                <input
                  type="number"
                  name="retirementAge"
                  value={formData.retirementAge}
                  onChange={handleInputChange}
                  placeholder="45"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Any other life goals? (Optional)</label>
                <textarea
                  name="lifeGoals"
                  value={formData.lifeGoals}
                  onChange={handleInputChange}
                  placeholder="Tell us about your aspirations..."
                  rows="4"
                  className="input-field"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            ← Previous
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary flex-1"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Profile →'}
            </button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-secondary-400 text-sm">
          <p>✅ Your data is encrypted and private • No credit card required • Takes 5 minutes</p>
        </div>
      </div>
    </div>
  );
}