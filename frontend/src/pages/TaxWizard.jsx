import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { taxAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function TaxWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taxComparison, setTaxComparison] = useState(null);
  const [taxData, setTaxData] = useState({
    salary: 1200000,
    bonus: 100000,
    capitalGains: 50000,
    otherIncome: 0,
    standardDeduction: 50000,
    hraExemption: 480000,
    taxSavingInvestments: 150000,
    healthInsurance: 0,
    educationLoan: 0,
    homeLoanInterest: 0,
    otherDeductions: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const toNumber = (value) => Number(value) || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const calculateTax = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      salary: toNumber(taxData.salary),
      bonus: toNumber(taxData.bonus),
      capital_gains: toNumber(taxData.capitalGains),
      other_income: toNumber(taxData.otherIncome),
      standard_deduction: toNumber(taxData.standardDeduction),
      "80c_investments": toNumber(taxData.taxSavingInvestments),
      "80d_health_insurance": toNumber(taxData.healthInsurance),
      "80e_education_loan": toNumber(taxData.educationLoan),
      hra_exemption: toNumber(taxData.hraExemption),
      other_deductions: toNumber(taxData.otherDeductions),
      loss_from_house_property: toNumber(taxData.homeLoanInterest),
    };

    try {
      const response = await taxAPI.calculate(payload);
      setTaxComparison(response);
    } catch (err) {
      setError(err.message || "Failed to calculate tax optimization");
    } finally {
      setLoading(false);
    }
  };

  const opportunities = taxComparison?.tax_saving_opportunities || [];
  const missingDeductions = taxComparison?.missing_deductions || [];

  const cleanRecommendationText = (text = "") => {
    return String(text)
      .replace(/\*\*/g, "")
      .replace(/__+/g, "")
      .replace(/^\s*\d+[\).:-]?\s*/, "")
      .trim();
  };

  const aiRecommendations = opportunities
    .filter((opp) => String(opp?.name || "").toLowerCase() === "ai recommendation")
    .map((opp) => cleanRecommendationText(opp.description || opp.benefit || ""))
    .filter(Boolean);

  const coreOpportunities = opportunities.filter(
    (opp) => String(opp?.name || "").toLowerCase() !== "ai recommendation"
  );

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Tax Wizard</h1>
        <p className="section-subtitle">AI-backed regime comparison, deduction discovery, and tax-saving recommendations</p>

        {error && (
          <div className="mt-6 mb-8 p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
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

              <button onClick={calculateTax} disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Calculating..." : "Calculate Tax Savings"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 card">
            <h2 className="text-xl font-bold mb-6">Your Deductions</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Standard Deduction (₹)</label>
                <input
                  type="number"
                  name="standardDeduction"
                  value={taxData.standardDeduction}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">HRA Exemption (₹)</label>
                <input
                  type="number"
                  name="hraExemption"
                  value={taxData.hraExemption}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">80C Investments (₹)</label>
                <input
                  type="number"
                  name="taxSavingInvestments"
                  value={taxData.taxSavingInvestments}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="ELSS, PPF, NPS, LIC"
                />
              </div>

              <div>
                <label className="label">80D Health Insurance (₹)</label>
                <input
                  type="number"
                  name="healthInsurance"
                  value={taxData.healthInsurance}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Education Loan Interest 80E (₹)</label>
                <input
                  type="number"
                  name="educationLoan"
                  value={taxData.educationLoan}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">House Property Loss / Home Loan Interest (₹)</label>
                <input
                  type="number"
                  name="homeLoanInterest"
                  value={taxData.homeLoanInterest}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Other Deductions (₹)</label>
                <input
                  type="number"
                  name="otherDeductions"
                  value={taxData.otherDeductions}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {taxComparison && (
            <div className="lg:col-span-1 space-y-4">
              <div className="card border-l-4 border-l-blue-500 bg-blue-500/5">
                <p className="text-secondary-400 text-sm mb-2">Old Tax Regime</p>
                <p className="text-3xl font-bold text-blue-400">₹{taxComparison.old_regime_tax.toLocaleString()}</p>
              </div>

              <div className="card border-l-4 border-l-green-500 bg-green-500/5">
                <p className="text-secondary-400 text-sm mb-2">New Tax Regime</p>
                <p className="text-3xl font-bold text-green-400">₹{taxComparison.new_regime_tax.toLocaleString()}</p>
              </div>

              <div className="card border-2 border-primary-500/30 bg-primary-500/5">
                <p className="text-secondary-400 text-sm mb-2">Estimated Savings</p>
                <p className="text-3xl font-bold text-primary-400">₹{Math.abs(taxComparison.tax_savings).toLocaleString()}</p>
                <p className="text-xs text-secondary-400 mt-2">Recommended: {taxComparison.recommended_regime}</p>
              </div>

              {taxComparison.sip_recommendation && (
                <div className="card border-l-4 border-l-yellow-500 bg-yellow-500/5">
                  <p className="text-secondary-400 text-sm mb-1">Suggested SIP</p>
                  <p className="text-2xl font-bold text-yellow-300">
                    ₹{Math.round(taxComparison.sip_recommendation.monthly_amount).toLocaleString()}/month
                  </p>
                  <p className="text-xs text-secondary-400 mt-2">{taxComparison.sip_recommendation.reason}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Tax-Saving Opportunities</h2>
          {coreOpportunities.length === 0 && aiRecommendations.length === 0 ? (
            <div className="card text-secondary-300">Run the calculator to see personalized opportunities.</div>
          ) : (
            <div className="space-y-6">
              {coreOpportunities.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {coreOpportunities.map((opp, idx) => (
                    <div key={idx} className="card">
                      <h3 className="font-bold mb-2">{cleanRecommendationText(opp.name || "Opportunity")}</h3>
                      <p className="text-secondary-400 text-sm mb-3">
                        {cleanRecommendationText(opp.description || opp.benefit || "Potential tax optimization idea based on your data.")}
                      </p>
                      {opp.amount !== undefined && (
                        <p className="text-secondary-300 text-sm mb-2">Suggested amount: ₹{Math.round(opp.amount).toLocaleString()}</p>
                      )}
                      {opp.tax_saving !== undefined && (
                        <p className="text-primary-400 font-bold">Estimated tax saving: ₹{Math.round(opp.tax_saving).toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {aiRecommendations.length > 0 && (
                <div className="card border-l-4 border-l-violet-500 bg-violet-500/5">
                  <h3 className="text-lg font-bold mb-3">AI Recommendations</h3>
                  <div className="space-y-3">
                    {aiRecommendations.map((recommendation, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary-700/30 border border-secondary-700/80">
                        <p className="text-secondary-100 text-sm leading-relaxed">
                          <span className="text-violet-300 font-semibold mr-2">{idx + 1}.</span>
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-6">Missing Deductions Identified</h2>
          {missingDeductions.length === 0 ? (
            <p className="text-secondary-300">Run the tax calculation to discover deductions tailored to your numbers.</p>
          ) : (
            <div className="space-y-3">
              {missingDeductions.map((deduction, idx) => (
                <div key={idx} className="p-3 bg-secondary-700/30 rounded-lg border border-secondary-700">
                  <p className="text-secondary-100">{deduction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
