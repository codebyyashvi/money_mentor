export default function Modal({ 
  isOpen = false,
  title = "Modal Title",
  children = null,
  onClose = null,
  actions = [],
  size = "md"
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`relative bg-secondary-800 rounded-2xl shadow-2xl p-6 ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        {title && (
          <h2 className="text-2xl font-bold mb-4 pr-8">{title}</h2>
        )}

        {/* Content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-700">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={action.primary ? "btn-primary" : "btn-secondary"}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
