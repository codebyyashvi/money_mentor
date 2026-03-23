import { useState } from "react";
import Navbar from "../components/Navbar";

export default function MFXray() {
  const [uploadFile, setUploadFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const mockAnalysis = {
    totalValue: 1850000,
    xirr: 12.5,
    investedAmount: 1450000,
    gain: 400000,
    holdings: [
      {
        name: "SBI Bluechip Fund",
        value: 520000,
        units: 8500,
        nav: 61.18,
        allocationPercent: 28,
        er: 0.76,
        category: "Large Cap",
        performance: 13.2
      },
      {
        name: "Axis Midcap Fund",
        value: 380000,
        units: 6200,
        nav: 61.29,
        allocationPercent: 20.5,
        er: 1.42,
        category: "Mid Cap",
        performance: 18.5
      },
      {
        name: "ICICI Balanced Advantage",
        value: 450000,
        units: 4100,
        nav: 109.76,
        allocationPercent: 24.3,
        er: 0.93,
        category: "Balanced",
        performance: 14.8
      },
      {
        name: "DSP Small Cap Fund",
        value: 320000,
        units: 2800,
        nav: 114.29,
        allocationPercent: 17.3,
        er: 1.87,
        category: "Small Cap",
        performance: 22.1
      },
      {
        name: "Liquid Bees",
        value: 180000,
        units: 18000,
        nav: 10,
        allocationPercent: 9.9,
        er: 0.003,
        category: "Liquid",
        performance: 6.5
      }
    ],
    overlaps: [
      { funds: ["SBI Bluechip", "ICICI Balanced"], overlap: 15, commonHoldings: "HDFC, Infosys" }
    ],
    benchmarkComparison: [
      { name: "Nifty 50", return: 11.5 },
      { name: "Sensex", return: 10.8 },
      { name: "Your Portfolio", return: 12.5 }
    ],
    topRecommendations: [
      {
        id: 1,
        title: "Reduce Expense Ratio Drag",
        desc: "Replace DSP Small Cap (ER: 1.87%) with Quant Small Cap (ER: 0.45%)",
        savings: "₹2,500 annually",
        priority: "high"
      },
      {
        id: 2,
        title: "Optimize Asset Allocation",
        desc: "Rebalance to 50% Large Cap, 30% Mid Cap, 20% Liquid",
        impact: "Better risk-adjusted returns",
        priority: "medium"
      },
      {
        id: 3,
        title: "Eliminate Overlap",
        desc: "Reduce holdings overlap by selling ICICI Balanced Advantage",
        impact: "Better diversification",
        priority: "medium"
      }
    ]
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Simulate analysis
      setTimeout(() => setAnalysis(mockAnalysis), 1000);
    }
  };

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Portfolio X-Ray</h1>
        <p className="section-subtitle">Deep dive analysis of your mutual fund portfolio</p>

        {!analysis ? (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="text-2xl font-bold mb-2">Upload Your Portfolio Statement</h2>
              <p className="text-secondary-400 mb-8">Paste CAMS or KFintech statements for instant analysis</p>

              <div className="border-2 border-dashed border-secondary-600 rounded-xl p-8 mb-6 hover:border-primary-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.csv,.jpg,.png"
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <p className="text-secondary-300 mb-2">Click to upload or drag and drop</p>
                  <p className="text-secondary-500 text-sm">PDF, Image, or CSV (max 10MB)</p>
                </label>
              </div>

              <button onClick={() => setAnalysis(mockAnalysis)} className="btn-primary">
                Try Demo Analysis
              </button>

              <p className="text-secondary-400 text-sm mt-6">
                Your data is encrypted and processed securely
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-primary-400">₹{(analysis.totalValue / 100000).toFixed(2)}L</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Extended IRR (XIRR)</p>
                <p className="text-3xl font-bold text-green-400">{analysis.xirr}%</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Gain</p>
                <p className="text-3xl font-bold text-accent-400">₹{(analysis.gain / 100000).toFixed(2)}L</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Return on Investment</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {((analysis.gain / analysis.investedAmount) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Holdings Breakdown */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Your Holdings</h2>
              <div className="space-y-4">
                {analysis.holdings.map((holding, idx) => (
                  <div key={idx} className="border border-secondary-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold">{holding.name}</h3>
                        <p className="text-xs text-secondary-400">{holding.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-400">₹{(holding.value / 100000).toFixed(2)}L</p>
                        <p className="text-xs text-secondary-400">{holding.allocationPercent}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mb-3 pb-3 border-b border-secondary-700 text-sm">
                      <div>
                        <p className="text-secondary-400 text-xs">Units</p>
                        <p className="font-semibold">{holding.units}</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">NAV</p>
                        <p className="font-semibold">₹{holding.nav}</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">Expense Ratio</p>
                        <p className="font-semibold">{holding.er}%</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">1Y Performance</p>
                        <p className="font-semibold text-green-400">{holding.performance}%</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">Allocation %</p>
                        <p className="font-semibold text-accent-400">{holding.allocationPercent}%</p>
                      </div>
                    </div>

                    <div className="w-full bg-secondary-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${holding.allocationPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold mb-6">Performance vs Benchmarks</h3>
                <div className="space-y-4">
                  {analysis.benchmarkComparison.map((bench, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{bench.name}</span>
                        <span className={`font-bold ${idx === 2 ? 'text-primary-400' : 'text-secondary-400'}`}>
                          {bench.return}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${idx === 2 ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-secondary-600'}`}
                          style={{ width: `${(bench.return / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-6">Overlap Analysis</h3>
                {analysis.overlaps.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.overlaps.map((overlap, idx) => (
                      <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm font-semibold mb-1">
                          {overlap.funds.join(" & ") } - {overlap.overlap}% Overlap
                        </p>
                        <p className="text-xs text-secondary-400">
                          Common holdings: {overlap.commonHoldings}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-400">No significant overlaps detected ✓</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">AI Recommendations</h2>
              <div className="space-y-4">
                {analysis.topRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 border-l-4 rounded-lg ${
                      rec.priority === "high"
                        ? "border-l-red-500 bg-red-500/5"
                        : "border-l-yellow-500 bg-yellow-500/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{rec.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                        rec.priority === "high" ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-secondary-400 text-sm mb-2">{rec.desc}</p>
                    <p className="text-primary-400 font-semibold text-sm">
                      {rec.savings || rec.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setAnalysis(null)} className="btn-secondary w-full">
              Upload Different Statement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
