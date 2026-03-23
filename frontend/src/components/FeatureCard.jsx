export default function FeatureCard({ 
  title = "Feature", 
  description = "Feature description",
  icon = "✨",
  gradient = "from-green-500 to-emerald-600",
  onClick = null,
  badge = null
}) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group hover:border-primary-400 overflow-hidden transition-all"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

      <div className="relative">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>

        {badge && (
          <div className="inline-block mb-3 px-2 py-1 text-xs font-bold rounded-full bg-primary-500/20 text-primary-300">
            {badge}
          </div>
        )}

        <h3 className="text-xl font-bold mb-3 text-primary-50">{title}</h3>

        <p className="text-secondary-400 mb-6 leading-relaxed">{description}</p>

        <div className="flex items-center text-primary-400 font-semibold group-hover:gap-2 transition-all">
          <span>Explore</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
