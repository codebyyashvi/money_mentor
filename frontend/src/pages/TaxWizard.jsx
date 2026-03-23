import { useState } from "react";
import Navbar from "../components/Navbar";

export default function TaxWizard() {
  const [step, setStep] = useState(1);
  const [taxData, setTaxData] = useState({
    salary: 1200000,
    bonus: 100000,
    capitalGains: 50000,
    otherIncome: 0,
    hra: 480000,
    taxSavingInvestments: 150000,
    nps: 50000,
    medicalExpenses: 0,
    homeLoans: 0,
    educationLoan: 0,
  });

  const [taxComparison, setTaxComparison] = useState(null);

  const calculateTax = () => {
    const totalIncome = taxData.salary + taxData.bonus + taxData.capitalGains + taxData.otherIncome;
    const deductions = Math.min(150000, taxData.taxSavingInvestments) + taxData.nps + (taxData.medicalExpenses * 0.5);
    const homeInterestDeduction = Math.min(200000, taxData.homeLoans);
    const educationDeduction = Math.min(100000, taxData.educationLoan);
    
    const oldRegimeTaxable = totalIncome - 250000 - deductions - homeInterestDeduction - educationDeduction;
    const newRegimeTaxable = totalIncome - 250000;

    // Simplified tax calculation
    const calculateOldRegimeTax = (taxable) => {
      if (taxable <= 0) return 0;
      if (taxable <= 500000) return taxable * 0.05;
      if (taxable <= 1000000) return 25000 + (taxable - 500000) * 0.20;
      return 125000 + (taxable - 1000000) * 0.30;
    };

    const calculateNewRegimeTax = (taxable) => {
      if (taxable <= 0) return 0;
      if (taxable <= 300000) return 0;
      if (taxable <= 600000) return (taxable - 300000) * 0.05;
      if (taxable <= 900000) return 15000 + (taxable - 600000) * 0.10;
      if (taxable <= 1200000) return 45000 + (taxable - 900000) * 0.15;
      if (taxable <= 1500000) return 90000 + (taxable - 1200000) * 0.20;
      return 150000 + (taxable - 1500000) * 0.30;
    };

    const oldTax = calculateOldRegimeTax(Math.max(0, oldRegimeTaxable));
    const newTax = calculateNewRegimeTax(Math.max(0, newRegimeTaxable));
    const savings = oldTax - newTax;

    setTaxComparison({
      oldRegime: { taxable: oldRegimeTaxable, tax: oldTax },
      newRegime: { taxable: newRegimeTaxable, tax: newTax },
      savings: savings,
      recommendedRegime: savings > 0 ? "old" : "new"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const taxSavingOpportunities = [
    {
      title: "Maximize ELSS Investment",
      desc: "Invest ₹50,000 more in ELSS funds",
      savings: 12500,
      icon: "📈"
    },
    {
      title: "Use NPS for Additional Deduction",
      desc: "Contribute ₹50,000 more to NPS (Section 80CCD)",
      savings: 12500,
      icon: "📊"
    },
    {
      title: "Claim HRA Exemption",
      desc: "Optimize HRA exemption to save on tax",
      savings: 25000,
      icon: "🏠"
    },
    {
      title: "Health Insurance Premium",
      desc: "Take parent health insurance for ₹30,000",
      savings: 7500,
      icon: "🏥"
    }
  ];

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Tax Wizard</h1>
        <p className="section-subtitle">Optimize your taxes with AI-powered recommendations</p>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Income Input */}
          <div className="lg:col-span-1 card">
            <h2 className="text-xl font-bold mb-6">Your Income</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Salary (₹)</label>
                <input
                  type="number"
                  name="salary"
                  value={taxData.salary}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Bonus (₹)</label>
                <input
                  type="number"
                  name="bonus"
                  value={taxData.bonus}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Capital Gains (₹)</label>
                <input
                  type="number"
                  name="capitalGains"
                  value={taxData.capitalGains}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Other Income (₹)</label>
                <input
                  type="number"
                  name="otherIncome"
                  value={taxData.otherIncome}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <button onClick={calculateTax} className="btn-primary w-full">
                Calculate Tax Savings
              </button>
            </div>
          </div>

          {/* Deductions Input */}
          <div className="lg:col-span-1 card">
            <h2 className="text-xl font-bold mb-6">Your Deductions</h2>
            <div className="space-y-4">
              <div>
                <label className="label">HRA (₹)</label>
                <input
                  type="number"
                  name="hra"
                  value={taxData.hra}
                  onChange={handleChange}
                  className="input-field"
                  disabled
                />
              </div>

              <div>
                <label className="label">Tax-Saving Investments (₹)</label>
                <input
                  type="number"
                  name="taxSavingInvestments"
                  value={taxData.taxSavingInvestments}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="ELSS, PPF, etc."
                />
              </div>

              <div>
                <label className="label">NPS Contribution (₹)</label>
                <input
                  type="number"
                  name="nps"
                  value={taxData.nps}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Medical Expenses (₹)</label>
                <input
                  type="number"
                  name="medicalExpenses"
                  value={taxData.medicalExpenses}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Home Loan Interest (₹)</label>
                <input
                  type="number"
                  name="homeLoans"
                  value={taxData.homeLoans}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Education Loan Interest (₹)</label>
                <input
                  type="number"
                  name="educationLoan"
                  value={taxData.educationLoan}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {taxComparison && (
            <div className="lg:col-span-1 space-y-4">
              <div className="card border-l-4 border-l-blue-500 bg-blue-500/5">
                <p className="text-secondary-400 text-sm mb-2">Old Tax Regime</p>
                <p className="text-3xl font-bold text-blue-400">₹{taxComparison.oldRegime.tax.toLocaleString()}</p>
                <p className="text-xs text-secondary-400 mt-1">Taxable: ₹{taxComparison.oldRegime.taxable.toLocaleString()}</p>
              </div>

              <div className="card border-l-4 border-l-green-500 bg-green-500/5">
                <p className="text-secondary-400 text-sm mb-2">New Tax Regime</p>
                <p className="text-3xl font-bold text-green-400">₹{taxComparison.newRegime.tax.toLocaleString()}</p>
                <p className="text-xs text-secondary-400 mt-1">Taxable: ₹{taxComparison.newRegime.taxable.toLocaleString()}</p>
              </div>

              <div className={`card border-2 ${taxComparison.savings > 0 ? 'border-primary-500/30 bg-primary-500/5' : 'border-secondary-700'}`}>
                <p className="text-secondary-400 text-sm mb-2">Total Savings</p>
                <p className={`text-3xl font-bold ${taxComparison.savings > 0 ? 'text-primary-400' : 'text-secondary-400'}`}>
                  ₹{Math.abs(taxComparison.savings).toLocaleString()}
                </p>
                <p className="text-xs text-secondary-400 mt-2">
                  ✅ Choose {taxComparison.recommendedRegime === "old" ? "Old" : "New"} Regime
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tax-Saving Opportunities */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Tax-Saving Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {taxSavingOpportunities.map((opp, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{opp.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{opp.title}</h3>
                    <p className="text-secondary-400 text-sm">{opp.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-secondary-700 flex justify-between items-center">
                  <p className="text-primary-400 font-bold">Save ₹{opp.savings.toLocaleString()}</p>
                  <button className="text-primary-400 font-semibold text-sm">Explore →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deduction Checklist */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-6">Don't Miss These Deductions</h2>
          <div className="space-y-3">
            {[
              "Life Insurance Premiums (Section 80C)",
              "Equity-Linked Saving Schemes (ELSS)",
              "Public Provident Fund (PPF)",
              "National Pension System (NPS)",
              "Home Loan Principal Repayment (Section 80C)",
              "Home Loan Interest (Section 24)",
              "Education Loan Interest (Section 80E)",
              "Medical Insurance Premium (Section 80D)",
              "Charitable Donations (Section 80G)",
              "Senior Citizen Savings Scheme"
            ].map((deduction, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-500"
                  defaultChecked={idx < 4}
                />
                <span>{deduction}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
