export default function StatCard({ 
  label = "Stat Label", 
  value = "₹0", 
  trend = "+12.5%", 
  trendPositive = true,
  icon = "📊",
  gradient = "from-primary-500 to-accent-500"
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <p className="text-secondary-400 text-sm">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      
      <div className="flex items-center gap-1">
        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${
          trendPositive 
            ? "text-green-400 bg-green-500/10" 
            : "text-red-400 bg-red-500/10"
        }`}>
          {trendPositive ? "↑" : "↓"} {trend}
        </span>
      </div>
    </div>
  );
}
