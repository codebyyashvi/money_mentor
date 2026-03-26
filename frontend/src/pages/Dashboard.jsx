import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { profileAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const profile = await profileAPI.get();
        setUserProfile(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      } catch (err) {
        // Fallback to localStorage if API fails
        const cached = localStorage.getItem("userProfile");
        if (cached) {
          setUserProfile(JSON.parse(cached));
        } else {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Mock data - in production, this comes from AI backend
  const moneyHealthScore = {
    overall: 72,
    categories: [
      { name: "Emergency Preparedness", score: 60, status: "needs-work" },
      { name: "Insurance Coverage", score: 45, status: "critical" },
      { name: "Investment Diversification", score: 85, status: "excellent" },
      { name: "Debt Health", score: 80, status: "excellent" },
      { name: "Tax Efficiency", score: 70, status: "good" },
      { name: "Retirement Readiness", score: 75, status: "good" },
    ],
  };

  const fireProjection = {
    currentAge: 28,
    retirementAge: 45,
    yearsToRetirement: 17,
    targetCorpus: "₹5.2 Cr",
    projectedCorpus: "₹4.8 Cr",
    recommended_sip: "₹25,000",
    track: "ON_TRACK",
    shortage: "₹40 Lakhs",
  };

  const recommendations = [
    {
      id: 1,
      title: "Critical: Increase Health Insurance",
      description: "Your family needs ₹25L additional health coverage",
      action: "Get Quote",
      priority: "high",
      icon: "🛡️",
    },
    {
      id: 2,
      title: "Tax Opportunity: Use HRA Exemption",
      description: "You could save ₹3.2L annually in taxes with HRA optimization",
      action: "Explore",
      priority: "high",
      icon: "💸",
    },
    {
      id: 3,
      title: "Emergency Fund Boost",
      description: "Build 6-month emergency fund (₹3L additional needed)",
      action: "Plan",
      priority: "medium",
      icon: "🆘",
    },
    {
      id: 4,
      title: "Optimize Portfolio Allocation",
      description: "Rebalance to 60% Equity, 30% Debt, 10% Gold for better returns",
      action: "View",
      priority: "medium",
      icon: "⚖️",
    },
  ];

  const assets = {
    total: "₹18.5 L",
    breakdown: [
      { name: "Mutual Funds", value: "₹8.2 L", percent: 44, icon: "📈", color: "from-blue-500 to-cyan-500" },
      { name: "Fixed Deposits", value: "₹5.0 L", percent: 27, icon: "🏦", color: "from-green-500 to-emerald-500" },
      { name: "Stocks", value: "₹3.5 L", percent: 19, icon: "📊", color: "from-purple-500 to-pink-500" },
      { name: "Savings Account", value: "₹1.8 L", percent: 10, icon: "💳", color: "from-orange-500 to-red-500" },
    ],
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      excellent: { text: "Excellent", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      good: { text: "Good", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      "needs-work": { text: "Needs Work", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      critical: { text: "Critical", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const config = statusConfig[status] || statusConfig.good;
    return config;
  };

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="section-title">Welcome back, {userProfile?.name || "Investor"} 👋</h1>
            <p className="text-secondary-400">Here's your comprehensive financial health overview</p>
          </div>
          <button
            onClick={() => navigate("/form")}
            className="btn-secondary text-sm"
          >
            Update Profile
          </button>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex gap-4 overflow-x-auto border-b border-secondary-700">
          {["overview", "fire-plan", "recommendations", "assets"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold border-b-2 transition-all capitalize ${
                activeTab === tab
                  ? "border-primary-500 text-primary-400"
                  : "border-transparent text-secondary-400 hover:text-secondary-300"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Money Health Score */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card text-center sticky top-20">
                <p className="text-secondary-400 mb-2 text-sm">Money Health Score</p>
                <div className="relative flex justify-center mb-6">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(moneyHealthScore.overall / 100) * 283} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="50" textAnchor="middle" dy="8" className="text-2xl font-bold fill-white">
                      {moneyHealthScore.overall}
                    </text>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-primary-400 mb-2">72/100</p>
                <p className="text-secondary-400 text-sm mb-4">You're doing great! Room to improve in 2 areas.</p>
                <button
                  onClick={() => navigate("/money-score")}
                  className="btn-primary w-full text-sm"
                >
                  Get Detailed Report
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {moneyHealthScore.categories.map((category, idx) => {
                const statusConfig = getStatusBadge(category.status);
                return (
                  <div key={idx} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-secondary-100">{category.name}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                        {statusConfig.text}
                      </span>
                    </div>
                    <div className="w-full bg-secondary-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          category.score >= 80 ? "bg-green-500" : category.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                    <p className={`text-sm font-bold ${getScoreColor(category.score)}`}>{category.score}/100</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Total Invested", value: "₹18.5 L", change: "+12.5%" },
              { label: "Monthly Savings", value: "₹25,000", change: "vs ₹20K goal" },
              { label: "Annual Returns", value: "₹2.1 L", change: "+8.3% XIRR" },
              { label: "Retirement Readiness", value: "72%", change: "ON TRACK" },
            ].map((stat, idx) => (
              <div key={idx} className="card text-center">
                <p className="text-secondary-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-primary-400 mb-1">{stat.value}</p>
                <p className="text-xs text-secondary-400">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FIRE Plan Tab */}
      {activeTab === "fire-plan" && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-6">Your FIRE Journey</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card bg-secondary-700/50">
                <p className="text-secondary-400 text-sm mb-2">Current Age</p>
                <p className="text-3xl font-bold text-primary-400">{fireProjection.currentAge}</p>
              </div>
              <div className="card bg-secondary-700/50">
                <p className="text-secondary-400 text-sm mb-2">Target Retirement Age</p>
                <p className="text-3xl font-bold text-primary-400">{fireProjection.retirementAge}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-xl p-6 mb-6">
              <p className="text-secondary-400 mb-4">Your FIRE Timeline</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Years to Retirement</span>
                    <span className="text-primary-400 font-bold">{fireProjection.yearsToRetirement} years</span>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-secondary-400 text-sm mb-2">Target Corpus</p>
                <p className="text-2xl font-bold text-primary-400">{fireProjection.targetCorpus}</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-2">Projected Corpus</p>
                <p className="text-2xl font-bold text-accent-400">{fireProjection.projectedCorpus}</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-2">Monthly SIP Needed</p>
                <p className="text-2xl font-bold text-yellow-400">{fireProjection.recommended_sip}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
              ⚠️ Shortage Alert: You need ₹40 Lakhs additional to achieve your FIRE goal. Increase monthly SIP to ₹30,000.
            </div>

            <button
              onClick={() => navigate("/fire-planner")}
              className="btn-primary w-full mt-6"
            >
              Get Detailed FIRE Plan
            </button>
          </div>
        </section>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {recommendations.map(rec => {
              const priorityConfig = {
                high: "from-red-500 to-pink-500",
                medium: "from-yellow-500 to-orange-500",
                low: "from-blue-500 to-cyan-500",
              };
              return (
                <div
                  key={rec.id}
                  className={`card border-l-4 ${
                    rec.priority === "high"
                      ? "border-l-red-500 bg-red-500/5"
                      : rec.priority === "medium"
                      ? "border-l-yellow-500 bg-yellow-500/5"
                      : "border-l-blue-500 bg-blue-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-3xl">{rec.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{rec.title}</h3>
                        <p className="text-secondary-400">{rec.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded capitalize text-white bg-gradient-to-r ${
                      priorityConfig[rec.priority]
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <button className="btn-primary text-sm mt-3">
                    {rec.action} →
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Assets Tab */}
      {activeTab === "assets" && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card sticky top-20">
                <p className="text-secondary-400 mb-2 text-sm">Total Assets</p>
                <p className="text-4xl font-bold text-primary-400 mb-6">{assets.total}</p>
                <button className="btn-primary w-full text-sm mb-3">
                  Add Investment
                </button>
                <button
                  onClick={() => navigate("/mf-xray")}
                  className="btn-secondary w-full text-sm"
                >
                  Portfolio X-Ray
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {assets.breakdown.map((asset, idx) => (
                <div key={idx} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{asset.icon}</span>
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-secondary-400">{asset.value}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary-400">{asset.percent}%</span>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${asset.color}`}
                      style={{ width: `${asset.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}