export default function ScoreCard({ score = 72 }) {
  const getScoreStatus = (score) => {
    if (score >= 80) return { status: "Excellent", color: "text-green-400 bg-green-500/10" };
    if (score >= 60) return { status: "Good", color: "text-yellow-400 bg-yellow-500/10" };
    return { status: "Needs Work", color: "text-red-400 bg-red-500/10" };
  };

  const status = getScoreStatus(score);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Money Health Score</h3>
          <p className="text-secondary-400 text-sm">Based on 6 dimensions</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
          {status.status}
        </span>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeDasharray={`${(score / 100) * 283} 283`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-400">{score}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-secondary-400 text-sm mb-4">
          You're doing great! Keep improving.
        </p>
        <button className="btn-primary w-full text-sm">
          View Detailed Report →
        </button>
      </div>
    </div>
  );
}