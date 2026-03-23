export default function ProgressBar({ 
  label = "Progress", 
  value = 65, 
  max = 100,
  showPercentage = true,
  color = "from-primary-500 to-accent-500"
}) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-secondary-300 font-semibold">{label}</p>
        {showPercentage && <p className={`text-sm font-bold bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
          {percentage.toFixed(1)}%
        </p>}
      </div>
      <div className="w-full bg-secondary-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
