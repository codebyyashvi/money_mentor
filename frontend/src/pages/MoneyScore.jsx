import Navbar from "../components/Navbar";

export default function MoneyScore() {
  const scores = [
    {
      id: 1,
      category: "Emergency Preparedness",
      score: 60,
      outOf: 100,
      status: "needs-work",
      description: "You have 3 months of expenses saved. Ideal is 6 months.",
      recommendations: [
        "Build emergency fund to 6 months of expenses",
        "Keep in high-yield savings account",
        "Target: ₹3,00,000 by next year"
      ],
      icon: "🆘"
    },
    {
      id: 2,
      category: "Insurance Coverage",
      score: 45,
      outOf: 100,
      status: "critical",
      description: "Your insurance coverage has gaps. Family needs more protection.",
      recommendations: [
        "Get ₹25L term life insurance",
        "Increase health insurance cover to ₹10L",
        "Add disability insurance"
      ],
      icon: "🛡️"
    },
    {
      id: 3,
      category: "Investment Diversification",
      score: 85,
      outOf: 100,
      status: "excellent",
      description: "Great portfolio mix across asset classes!",
      recommendations: [
        "Maintain current diversification",
        "Consider adding international exposure",
        "Annual rebalancing recommended"
      ],
      icon: "📊"
    },
    {
      id: 4,
      category: "Debt Health",
      score: 80,
      outOf: 100,
      status: "excellent",
      description: "Your debt-to-income ratio is healthy.",
      recommendations: [
        "Continue current debt repayment plan",
        "Focus on high-interest debt first",
        "Avoid taking new loans"
      ],
      icon: "💳"
    },
    {
      id: 5,
      category: "Tax Efficiency",
      score: 70,
      outOf: 100,
      status: "good",
      description: "You're saving some taxes, but can optimize better.",
      recommendations: [
        "Maximize NPS contributions for tax deduction",
        "Utilize Section 80C provisions fully",
        "Consider HRA exemption optimization"
      ],
      icon: "💸"
    },
    {
      id: 6,
      category: "Retirement Readiness",
      score: 75,
      outOf: 100,
      status: "good",
      description: "On track but needs attention to maintain pace.",
      recommendations: [
        "Increase monthly SIP to ₹25,000",
        "Diversify retirement savings across funds",
        "Review retirement goals annually"
      ],
      icon: "🎯"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 bg-green-500/10";
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const getStatusConfig = (status) => {
    const config = {
      excellent: { text: "Excellent", bg: "bg-green-500/20", border: "border-green-500/30" },
      good: { text: "Good", bg: "bg-blue-500/20", border: "border-blue-500/30" },
      "needs-work": { text: "Needs Work", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
      critical: { text: "Critical", bg: "bg-red-500/20", border: "border-red-500/30" },
    };
    return config[status];
  };

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="section-title mb-2">Money Health Score</h1>
          <p className="section-subtitle">Comprehensive financial wellness assessment across 6 dimensions</p>
        </div>

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
                    strokeDasharray="408 471"
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
                    72
                  </text>
                </svg>
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-2">Your Score: 72/100</h2>
              <p className="text-secondary-300 mb-6">
                You're doing great overall! Focus on emergency preparedness and insurance to boost your score.
              </p>
              <div className="flex gap-4">
                <button className="btn-primary">Get Personalized Plan</button>
                <button className="btn-outline">Download Report</button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="space-y-6">
          {scores.map(item => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <div key={item.id} className="card">
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
                      {item.score}
                    </div>
                    <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
                      {statusConfig.text}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-secondary-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        item.score >= 80 ? "bg-green-500" : item.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-secondary-100 mb-3">How to improve:</h4>
                  <ul className="space-y-2">
                    {item.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-secondary-300 text-sm">
                        <span className="text-primary-400 mt-1">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Items */}
        <div className="mt-12 card-blur border-2 border-primary-500/30">
          <h2 className="text-2xl font-bold mb-6">Immediate Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Increase Emergency Fund</h3>
                <p className="text-sm text-secondary-400">Add ₹1.5L to reach 6-month target</p>
                <button className="text-primary-400 font-semibold text-sm mt-2">→ Create Plan</button>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-bold mb-1">Review Insurance</h3>
                <p className="text-sm text-secondary-400">Get ₹25L additional coverage</p>
                <button className="text-primary-400 font-semibold text-sm mt-2">→ Get Quotes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
