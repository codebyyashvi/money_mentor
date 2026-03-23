export default function FormInput({ 
  label = "Input Label",
  type = "text",
  placeholder = "Enter value",
  value = "",
  onChange = null,
  error = null,
  required = false,
  icon = null,
  helpText = null
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-3.5 text-lg">{icon}</span>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${icon ? "pl-10" : ""} ${error ? "border-red-500 focus:border-red-500" : ""}`}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-1">✕ {error}</p>
      )}

      {helpText && !error && (
        <p className="text-secondary-400 text-xs mt-1">💡 {helpText}</p>
      )}
    </div>
  );
}
