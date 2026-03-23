export default function AdviceBox({ advice = "Increase your savings and reduce unnecessary expenses. Start investing in SIP.", priority = "medium", icon = "💡" }) {
  const priorityConfig = {
    high: "border-red-500/30 bg-red-500/10",
    medium: "border-yellow-500/30 bg-yellow-500/10",
    low: "border-blue-500/30 bg-blue-500/10"
  };

  const priorityText = {
    high: "High Priority",
    medium: "Recommended",
    low: "Consider"
  };

  return (
    <div className={`card border-l-4 ${
      priority === "high" 
        ? "border-l-red-500" 
        : priority === "medium" 
        ? "border-l-yellow-500" 
        : "border-l-blue-500"
    } ${priorityConfig[priority]}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-bold ${
              priority === "high" 
                ? "text-red-400" 
                : priority === "medium" 
                ? "text-yellow-400" 
                : "text-blue-400"
            }`}>
              AI Recommendation
            </h4>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              priority === "high" 
                ? "text-red-400 bg-red-500/20" 
                : priority === "medium" 
                ? "text-yellow-400 bg-yellow-500/20" 
                : "text-blue-400 bg-blue-500/20"
            }`}>
              {priorityText[priority]}
            </span>
          </div>
          <p className="text-secondary-300 leading-relaxed">{advice}</p>
          <button className="mt-3 text-primary-400 font-semibold text-sm hover:text-primary-300 transition-colors">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}