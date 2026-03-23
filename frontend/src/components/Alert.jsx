export default function Alert({ 
  type = "info", 
  title = "Alert", 
  message = "This is an alert message",
  onClose = null
}) {
  const typeConfig = {
    info: { 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/30", 
      text: "text-blue-400",
      icon: "ℹ️"
    },
    success: { 
      bg: "bg-green-500/10", 
      border: "border-green-500/30", 
      text: "text-green-400",
      icon: "✓"
    },
    warning: { 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-500/30", 
      text: "text-yellow-400",
      icon: "⚠️"
    },
    error: { 
      bg: "bg-red-500/10", 
      border: "border-red-500/30", 
      text: "text-red-400",
      icon: "✕"
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold ${config.text} mb-1`}>{title}</h3>
          <p className="text-secondary-300 text-sm">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className={`text-2xl flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
