import { useState } from "react";
import Navbar from "../components/Navbar";

export default function FirePlanner() {
  const [input, setInput] = useState({
    currentAge: 28,
    retirementAge: 45,
    currentIncome: 1000000,
    currentExpenses: 500000,
    existingCorpus: 1850000,
    expectedInflation: 5.5,
    expectedReturn: 10,
  });

  const [plan, setPlan] = useState(null);

  const calculateFire = () => {
    const yearsToRetirement = input.retirementAge - input.currentAge;
    const futureExpenses = input.currentExpenses * Math.pow(1 + input.expectedInflation / 100, yearsToRetirement);
    const targetCorpus = (futureExpenses * 25) / 100; // 4% rule

    const rate = input.expectedReturn / 100;
    const monthlyInvestmentNeeded = (targetCorpus - input.existingCorpus * Math.pow(1 + rate, yearsToRetirement)) /
      (((Math.pow(1 + rate, yearsToRetirement) - 1) / rate) * 12);

    setPlan({
      yearsToRetirement,
      targetCorpus: Math.round(targetCorpus),
      futureExpenses: Math.round(futureExpenses),
      monthlyInvestmentNeeded: Math.round(monthlyInvestmentNeeded),
      projectedCorpus: Math.round(input.existingCorpus * Math.pow(1 + rate, yearsToRetirement)),
      shortage: Math.max(0, Math.round(targetCorpus - (input.existingCorpus * Math.pow(1 + rate, yearsToRetirement))))
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">FIRE Path Planner</h1>
        <p className="section-subtitle">Build your month-by-month wealth roadmap</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Your Information</h2>

            <div className="space-y-4">
              <div>
                <label className="label">Current Age</label>
                <input
                  type="number"
                  value={input.currentAge}
                  onChange={e => setInput({...input, currentAge: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Target Retirement Age</label>
                <input
                  type="number"
                  value={input.retirementAge}
                  onChange={e => setInput({...input, retirementAge: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Annual Income (₹)</label>
                <input
                  type="number"
                  value={input.currentIncome}
                  onChange={e => setInput({...input, currentIncome: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Annual Expenses (₹)</label>
                <input
                  type="number"
                  value={input.currentExpenses}
                  onChange={e => setInput({...input, currentExpenses: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Existing Investments (₹)</label>
                <input
                  type="number"
                  value={input.existingCorpus}
                  onChange={e => setInput({...input, existingCorpus: parseInt(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={input.expectedReturn}
                  onChange={e => setInput({...input, expectedReturn: parseFloat(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Expected Annual Inflation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={input.expectedInflation}
                  onChange={e => setInput({...input, expectedInflation: parseFloat(e.target.value)})}
                  className="input-field"
                />
              </div>

              <button onClick={calculateFire} className="btn-primary w-full mt-6">
                Generate FIRE Plan
              </button>
            </div>
          </div>

          {/* Results */}
          {plan && (
            <div className="space-y-4">
              <div className="card border-l-4 border-l-primary-500 bg-primary-500/5">
                <p className="text-secondary-400 text-sm mb-2">Years to Retirement</p>
                <p className="text-4xl font-bold text-primary-400">{plan.yearsToRetirement}</p>
                <p className="text-secondary-400 mt-2">By age {input.retirementAge}</p>
              </div>

              <div className="card border-l-4 border-l-accent-500 bg-accent-500/5">
                <p className="text-secondary-400 text-sm mb-2">Target FIRE Corpus</p>
                <p className="text-4xl font-bold text-accent-400">{formatCurrency(plan.targetCorpus)}</p>
                <p className="text-secondary-400 text-sm mt-2">Based on 4% withdrawal rule</p>
              </div>

              <div className="card border-l-4 border-l-yellow-500 bg-yellow-500/5">
                <p className="text-secondary-400 text-sm mb-2">Monthly SIP Required</p>
                <p className="text-3xl font-bold text-yellow-400">{formatCurrency(plan.monthlyInvestmentNeeded)}</p>
                <p className="text-secondary-400 text-sm mt-2">To achieve your FIRE goal</p>
              </div>

              <div className="card border-l-4 border-l-cyan-500 bg-cyan-500/5">
                <p className="text-secondary-400 text-sm mb-2">Projected Corpus (at retirement)</p>
                <p className="text-3xl font-bold text-cyan-400">{formatCurrency(plan.projectedCorpus)}</p>
              </div>

              {plan.shortage > 0 && (
                <div className="card border-l-4 border-l-red-500 bg-red-500/5">
                  <p className="text-secondary-400 text-sm mb-2">Funding Shortage</p>
                  <p className="text-3xl font-bold text-red-400">{formatCurrency(plan.shortage)}</p>
                  <p className="text-secondary-400 text-sm mt-2">Increase monthly SIP to close the gap</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Plan */}
        {plan && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your FIRE Action Plan</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Optimize SIP Allocation",
                  desc: `Set up monthly SIP of ${formatCurrency(plan.monthlyInvestmentNeeded)} across diversified funds`
                },
                {
                  step: 2,
                  title: "Tax-Efficient Investments",
                  desc: "Use ELSS, NPS, and tax-saving fixed deposits to reduce tax burden"
                },
                {
                  step: 3,
                  title: "Annual Rebalancing",
                  desc: "Review and rebalance portfolio to maintain target asset allocation"
                },
                {
                  step: 4,
                  title: "Increase Income",
                  desc: "Boost savings rate by 2-3% annually to accelerate FIRE timeline"
                }
              ].map(item => (
                <div key={item.step} className="card flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20">
                      <span className="font-bold text-primary-400">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-secondary-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
