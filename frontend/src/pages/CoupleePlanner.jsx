import { useState } from "react";
import Navbar from "../components/Navbar";

export default function CoupleePlanner() {
  const [step, setStep] = useState(1);
  const [partner1, setPartner1] = useState({
    name: "Raj Kumar",
    income: 1000000,
    allowance: 150000,
    hasNps: true,
    npsAmount: 50000,
    investments: 800000,
  });

  const [partner2, setPartner2] = useState({
    name: "Priya Singh",
    income: 1200000,
    allowance: 180000,
    hasNps: true,
    npsAmount: 60000,
    investments: 1000000,
  });

  const [plan, setPlan] = useState(null);

  const generatePlan = () => {
    const combined = {
      totalIncome: partner1.income + partner2.income,
      totalAllowance: partner1.allowance + partner2.allowance,
      totalNps: (partner1.hasNps ? partner1.npsAmount : 0) + (partner2.hasNps ? partner2.npsAmount : 0),
      totalInvestments: partner1.investments + partner2.investments,
      hraOptimization: {
        partner1: { salary: partner1.income, hra: partner1.allowance, optimizedClaim: partner1.allowance * 0.8 },
        partner2: { salary: partner2.income, hra: partner2.allowance, optimizedClaim: partner2.allowance * 0.85 },
      },
      sipAllocation: {
        jointSip: 35000,
        individual1: 15000,
        individual2: 18000,
      },
      jointHoldings: [
        { name: "Home (Expected)", value: 5000000, owner: "Joint" },
        { name: "Investments", value: 1800000, owner: "Joint" },
      ],
      taxSavings: {
        partner1: 30000,
        partner2: 35000,
        joint: 12000,
      },
      netWorth: partner1.investments + partner2.investments,
    };

    setPlan(combined);
  };

  const handlePartner1Change = (field, value) => {
    setPartner1(prev => ({...prev, [field]: value}));
  };

  const handlePartner2Change = (field, value) => {
    setPartner2(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Couple's Money Planner</h1>
        <p className="section-subtitle">India's first AI-powered joint financial planning tool</p>

        {!plan ? (
          <div className="space-y-8">
            {/* Partner Information Forms */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Partner 1 */}
              <div className="card">
                <h2 className="text-xl font-bold mb-6">Partner 1</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      value={partner1.name}
                      onChange={e => handlePartner1Change("name", e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={partner1.income}
                      onChange={e => handlePartner1Change("income", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">HRA/Allowance (₹)</label>
                    <input
                      type="number"
                      value={partner1.allowance}
                      onChange={e => handlePartner1Change("allowance", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">NPS Contribution (₹)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={partner1.npsAmount}
                        onChange={e => handlePartner1Change("npsAmount", parseInt(e.target.value))}
                        disabled={!partner1.hasNps}
                        className="input-field flex-1"
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={partner1.hasNps}
                        onChange={e => handlePartner1Change("hasNps", e.target.checked)}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span className="text-sm">Has NPS Account</span>
                    </label>
                  </div>

                  <div>
                    <label className="label">Current Investments (₹)</label>
                    <input
                      type="number"
                      value={partner1.investments}
                      onChange={e => handlePartner1Change("investments", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="card">
                <h2 className="text-xl font-bold mb-6">Partner 2</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      value={partner2.name}
                      onChange={e => handlePartner2Change("name", e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={partner2.income}
                      onChange={e => handlePartner2Change("income", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">HRA/Allowance (₹)</label>
                    <input
                      type="number"
                      value={partner2.allowance}
                      onChange={e => handlePartner2Change("allowance", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">NPS Contribution (₹)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={partner2.npsAmount}
                        onChange={e => handlePartner2Change("npsAmount", parseInt(e.target.value))}
                        disabled={!partner2.hasNps}
                        className="input-field flex-1"
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={partner2.hasNps}
                        onChange={e => handlePartner2Change("hasNps", e.target.checked)}
                        className="w-4 h-4 accent-primary-500"
                      />
                      <span className="text-sm">Has NPS Account</span>
                    </label>
                  </div>

                  <div>
                    <label className="label">Current Investments (₹)</label>
                    <input
                      type="number"
                      value={partner2.investments}
                      onChange={e => handlePartner2Change("investments", parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={generatePlan} className="btn-primary w-full">
              Generate Joint Financial Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Combined Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Combined Annual Income</p>
                <p className="text-2xl font-bold text-primary-400">
                  ₹{(plan.totalIncome / 100000).toFixed(2)}L
                </p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Investments</p>
                <p className="text-2xl font-bold text-accent-400">
                  ₹{(plan.totalInvestments / 100000).toFixed(2)}L
                </p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Combined Net Worth</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{(plan.netWorth / 100000).toFixed(2)}L
                </p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Tax Savings</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ₹{((plan.taxSavings.partner1 + plan.taxSavings.partner2 + plan.taxSavings.joint) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>

            {/* HRA Optimization */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">HRA Exemption Optimization</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: partner1.name, data: plan.hraOptimization.partner1 },
                  { name: partner2.name, data: plan.hraOptimization.partner2 }
                ].map((partner, idx) => (
                  <div key={idx} className="border border-secondary-700 rounded-lg p-4">
                    <h3 className="font-bold mb-4">{partner.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-secondary-700">
                        <span>Salary</span>
                        <span className="font-semibold">₹{(partner.data.salary / 100000).toFixed(2)}L</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-secondary-700">
                        <span>HRA</span>
                        <span className="font-semibold">₹{(partner.data.hra / 100000).toFixed(2)}L</span>
                      </div>
                      <div className="flex justify-between bg-primary-500/10 px-3 py-2 rounded border border-primary-500/30">
                        <span className="font-semibold">Claim</span>
                        <span className="font-bold text-primary-400">₹{(partner.data.optimizedClaim / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIP Allocation Strategy */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Recommended SIP Allocation</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Joint SIP</h3>
                    <span className="text-primary-400 font-bold">₹{plan.sipAllocation.jointSip.toLocaleString()}/month</span>
                  </div>
                  <p className="text-sm text-secondary-400 mb-2">For shared goals (home, retirement, children)</p>
                  <div className="w-full bg-secondary-700 rounded-full h-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{width: '50%'}} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{partner1.name}'s Individual SIP</h3>
                    <span className="text-accent-400 font-bold">₹{plan.sipAllocation.individual1.toLocaleString()}/month</span>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-3">
                    <div className="h-3 rounded-full bg-accent-500" style={{width: '30%'}} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{partner2.name}'s Individual SIP</h3>
                    <span className="text-green-400 font-bold">₹{plan.sipAllocation.individual2.toLocaleString()}/month</span>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-3">
                    <div className="h-3 rounded-full bg-green-500" style={{width: '35%'}} />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded">
                <p className="text-primary-300 text-sm">
                  <strong>Total Monthly Investment:</strong> ₹{(plan.sipAllocation.jointSip + plan.sipAllocation.individual1 + plan.sipAllocation.individual2).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Tax Benefits Summary */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Combined Tax Benefits</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-secondary-700 rounded-lg p-4">
                  <p className="text-secondary-400 text-sm mb-2">{partner1.name}</p>
                  <p className="text-2xl font-bold text-yellow-400">₹{plan.taxSavings.partner1.toLocaleString()}</p>
                  <p className="text-xs text-secondary-400 mt-2">Annual tax savings</p>
                </div>
                <div className="border border-secondary-700 rounded-lg p-4">
                  <p className="text-secondary-400 text-sm mb-2">{partner2.name}</p>
                  <p className="text-2xl font-bold text-yellow-400">₹{plan.taxSavings.partner2.toLocaleString()}</p>
                  <p className="text-xs text-secondary-400 mt-2">Annual tax savings</p>
                </div>
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                  <p className="text-primary-300 text-sm mb-2">Joint Benefits</p>
                  <p className="text-2xl font-bold text-primary-400">₹{plan.taxSavings.joint.toLocaleString()}</p>
                  <p className="text-xs text-primary-300 mt-2">HUF + other benefits</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="btn-primary flex-1">Download Plan</button>
                <button onClick={() => setPlan(null)} className="btn-secondary flex-1">
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
