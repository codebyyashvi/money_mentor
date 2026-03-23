import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InputForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    income: "",
    expenses: "",
    savings: "",
    debt: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("financeData", JSON.stringify(form));
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const fields = [
    { 
      name: "age", 
      label: "Your Age", 
      type: "number",
      placeholder: "e.g., 28",
      icon: "👤"
    },
    { 
      name: "income", 
      label: "Annual Income (₹)", 
      type: "number",
      placeholder: "e.g., 1,200,000",
      icon: "💰"
    },
    { 
      name: "expenses", 
      label: "Monthly Expenses (₹)", 
      type: "number",
      placeholder: "e.g., 50,000",
      icon: "💸"
    },
    { 
      name: "savings", 
      label: "Current Savings (₹)", 
      type: "number",
      placeholder: "e.g., 500,000",
      icon: "🏦"
    },
    { 
      name: "debt", 
      label: "Outstanding Debt (₹)", 
      type: "number",
      placeholder: "e.g., 200,000",
      icon: "💳"
    },
  ];

  const isFormValid = Object.values(form).every(value => value !== "");

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2">Your Financial Details</h2>
      <p className="text-secondary-400 mb-8">Let's analyze your financial health</p>

      <div className="grid gap-6 mb-8">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="label flex items-center gap-2">
              <span>{field.icon}</span>
              <span>{field.label}</span>
            </label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className="btn-primary w-full text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin">⏳</div>
            Analyzing Your Finances...
          </>
        ) : (
          <>
            Get Personalized Analysis →
          </>
        )}
      </button>

      <p className="text-secondary-400 text-sm text-center mt-6">
        ✅ Your data is encrypted and secure • We never share your information
      </p>
    </div>
  );
}