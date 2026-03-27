import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { portfolioAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const createEmptyHolding = () => ({
  name: "",
  units: "",
  nav: "",
  purchase_price: "",
  purchase_date: "",
  sector: "",
});

const sampleHoldings = [
  {
    name: "SBI Bluechip Fund",
    units: 8500,
    nav: 61.18,
    purchase_price: 45.5,
    purchase_date: "2022-01-10",
    sector: "Large Cap",
  },
  {
    name: "Axis Midcap Fund",
    units: 6200,
    nav: 61.29,
    purchase_price: 40,
    purchase_date: "2021-08-15",
    sector: "Mid Cap",
  },
  {
    name: "ICICI Balanced Advantage",
    units: 4100,
    nav: 109.76,
    purchase_price: 85,
    purchase_date: "2020-02-12",
    sector: "Balanced",
  },
];

const normalizeKey = (key = "") =>
  key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");

const parseCsvText = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV needs a header row and at least one holding row.");
  }

  const headers = lines[0].split(",").map((h) => normalizeKey(h));
  const findIndex = (...possibleKeys) =>
    headers.findIndex((h) => possibleKeys.some((k) => h === normalizeKey(k)));

  const idx = {
    name: findIndex("name", "fund_name", "scheme_name"),
    units: findIndex("units", "unit"),
    nav: findIndex("nav", "current_nav"),
    purchase_price: findIndex("purchase_price", "buy_nav", "cost_nav", "avg_nav"),
    purchase_date: findIndex("purchase_date", "buy_date", "transaction_date", "date"),
    sector: findIndex("sector", "category", "fund_category"),
  };

  if ([idx.name, idx.units, idx.nav, idx.purchase_price, idx.purchase_date].some((v) => v < 0)) {
    throw new Error(
      "CSV must contain columns: name, units, nav, purchase_price, purchase_date (optional: sector/category)."
    );
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      name: cols[idx.name] || "",
      units: cols[idx.units] || "",
      nav: cols[idx.nav] || "",
      purchase_price: cols[idx.purchase_price] || "",
      purchase_date: cols[idx.purchase_date] || "",
      sector: idx.sector >= 0 ? cols[idx.sector] || "" : "",
    };
  });
};

export default function MFXray() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [holdings, setHoldings] = useState([createEmptyHolding()]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const formatInr = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const validHoldings = useMemo(
    () =>
      holdings.filter(
        (h) =>
          h.name &&
          Number(h.units) > 0 &&
          Number(h.nav) > 0 &&
          Number(h.purchase_price) >= 0 &&
          h.purchase_date
      ),
    [holdings]
  );

  const updateHolding = (index, key, value) => {
    setHoldings((prev) =>
      prev.map((holding, idx) => (idx === index ? { ...holding, [key]: value } : holding))
    );
  };

  const addHolding = () => {
    setHoldings((prev) => [...prev, createEmptyHolding()]);
  };

  const removeHolding = (index) => {
    setHoldings((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length > 0 ? next : [createEmptyHolding()];
    });
  };

  const loadSampleData = () => {
    setError(null);
    setAnalysis(null);
    setHoldings(
      sampleHoldings.map((h) => ({
        ...h,
        units: String(h.units),
        nav: String(h.nav),
        purchase_price: String(h.purchase_price),
      }))
    );
  };

  const handleStatementUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setAnalysis(null);

    const fileName = (file.name || "").toLowerCase();
    if (!fileName.endsWith(".csv") && !fileName.endsWith(".pdf")) {
      setError("Please upload a CAMS/KFin statement in PDF format or a CSV file.");
      return;
    }

    try {
      if (fileName.endsWith(".pdf")) {
        setLoading(true);
        const response = await portfolioAPI.xrayFromStatement(file);
        setAnalysis(response);
      } else {
        const text = await file.text();
        const parsed = parseCsvText(text);
        setHoldings(parsed);
      }
    } catch (err) {
      const detailFromArray = Array.isArray(err?.data?.detail)
        ? err.data.detail.map((x) => x?.msg || JSON.stringify(x)).join("; ")
        : null;
      const detailFromObject =
        err?.data?.detail && typeof err.data.detail === "object"
          ? JSON.stringify(err.data.detail)
          : null;
      const detailFromString =
        typeof err?.data === "string" ? err.data : null;

      setError(
        detailFromArray ||
          detailFromObject ||
          err?.data?.detail ||
          err?.data?.message ||
          detailFromString ||
          err.message ||
          "Could not process uploaded statement."
      );
    } finally {
      setLoading(false);
    }
  };

  const runXray = async () => {
    if (validHoldings.length === 0) {
      setError("Add at least one valid holding before running Portfolio X-Ray.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      holdings: validHoldings.map((h) => ({
        name: h.name.trim(),
        units: Number(h.units),
        nav: Number(h.nav),
        purchase_price: Number(h.purchase_price),
        purchase_date: h.purchase_date,
        sector: h.sector?.trim() || undefined,
      })),
      cams_statement_text: null,
    };

    try {
      const response = await portfolioAPI.xray(payload);
      setAnalysis(response);
    } catch (err) {
      setError(err.message || "Portfolio analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const overlaps = analysis?.overlap_analysis?.overlaps || [];
  const sectorAllocation = analysis?.sector_allocation || {};
  const benchmark = analysis?.benchmark_comparison || {};

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Portfolio X-Ray</h1>
        <p className="section-subtitle">Upload holdings, run real analysis, and get actionable rebalancing insights</p>

        {error && (
          <div className="mt-6 mb-8 p-4 bg-red-900/20 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="card mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input
              type="file"
              accept=".pdf,.csv"
              onChange={handleStatementUpload}
              className="text-sm text-secondary-300"
            />
            <button onClick={loadSampleData} className="btn-secondary text-sm">
              Load Sample Holdings
            </button>
            <button onClick={addHolding} className="btn-secondary text-sm">
              Add Holding Row
            </button>
            <button onClick={runXray} disabled={loading} className="btn-primary text-sm disabled:opacity-50">
              {loading ? "Analyzing..." : "Run Portfolio X-Ray"}
            </button>
          </div>

          <p className="text-secondary-400 text-sm mb-4">
            Upload CAMS/KFin PDF directly for automatic extraction, or use CSV/manual entry for precise control.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-secondary-400 border-b border-secondary-700">
                  <th className="py-2 pr-4">Fund Name</th>
                  <th className="py-2 pr-4">Units</th>
                  <th className="py-2 pr-4">NAV</th>
                  <th className="py-2 pr-4">Purchase Price</th>
                  <th className="py-2 pr-4">Purchase Date</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, idx) => (
                  <tr key={idx} className="border-b border-secondary-800/60">
                    <td className="py-2 pr-4 min-w-[220px]">
                      <input
                        value={holding.name}
                        onChange={(e) => updateHolding(idx, "name", e.target.value)}
                        className="input-field"
                        placeholder="Fund name"
                      />
                    </td>
                    <td className="py-2 pr-4 min-w-[120px]">
                      <input
                        type="number"
                        value={holding.units}
                        onChange={(e) => updateHolding(idx, "units", e.target.value)}
                        className="input-field"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 pr-4 min-w-[120px]">
                      <input
                        type="number"
                        value={holding.nav}
                        onChange={(e) => updateHolding(idx, "nav", e.target.value)}
                        className="input-field"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 pr-4 min-w-[140px]">
                      <input
                        type="number"
                        value={holding.purchase_price}
                        onChange={(e) => updateHolding(idx, "purchase_price", e.target.value)}
                        className="input-field"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 pr-4 min-w-[180px]">
                      <input
                        type="date"
                        value={holding.purchase_date}
                        onChange={(e) => updateHolding(idx, "purchase_date", e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td className="py-2 pr-4 min-w-[160px]">
                      <input
                        value={holding.sector}
                        onChange={(e) => updateHolding(idx, "sector", e.target.value)}
                        className="input-field"
                        placeholder="Large Cap"
                      />
                    </td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => removeHolding(idx)}
                        className="text-red-400 hover:text-red-300 text-xs"
                        type="button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {analysis && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-primary-400">{formatInr(analysis.total_value)}</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-blue-400">{formatInr(analysis.total_invested)}</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">Total Gain</p>
                <p className="text-2xl font-bold text-accent-400">{formatInr(analysis.total_gain)}</p>
              </div>
              <div className="card">
                <p className="text-secondary-400 text-sm mb-1">XIRR</p>
                <p className="text-2xl font-bold text-green-400">{Number(analysis.xirr || 0).toFixed(2)}%</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Holdings Analysis</h2>
              <div className="space-y-4">
                {(analysis.holdings_analysis || []).map((holding, idx) => (
                  <div key={idx} className="border border-secondary-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold">{holding.name}</h3>
                        <p className="text-xs text-secondary-400">{holding.category || "Unknown"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-400">{formatInr(holding.value)}</p>
                        <p className="text-xs text-secondary-400">{Number(holding.allocation_percent || 0).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-secondary-400 text-xs">Units</p>
                        <p className="font-semibold">{holding.units}</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">NAV</p>
                        <p className="font-semibold">{formatInr(holding.nav)}</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">Allocation</p>
                        <p className="font-semibold text-accent-400">{Number(holding.allocation_percent || 0).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-secondary-400 text-xs">Performance</p>
                        <p className="font-semibold">{Number(holding.performance || 0).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Overlap Analysis</h3>
                {overlaps.length === 0 ? (
                  <p className="text-secondary-300">No major category overlaps found.</p>
                ) : (
                  <div className="space-y-3">
                    {overlaps.map((overlap, idx) => (
                      <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="font-semibold text-sm mb-1">{overlap.category}</p>
                        <p className="text-xs text-secondary-300 mb-1">Funds: {(overlap.funds || []).join(", ")}</p>
                        <p className="text-xs text-secondary-400">{overlap.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-4">Benchmark Comparison</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Benchmark</span>
                    <span className="font-semibold">{benchmark.benchmark || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Outperformance</span>
                    <span className="font-semibold text-green-400">{Number(benchmark.outperformance || 0).toFixed(2)}%</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold mt-6 mb-3">Sector Allocation</h4>
                <div className="space-y-2 text-sm">
                  {Object.keys(sectorAllocation).length === 0 ? (
                    <p className="text-secondary-300">No sector split available.</p>
                  ) : (
                    Object.entries(sectorAllocation).map(([sector, value]) => (
                      <div key={sector} className="flex justify-between">
                        <span className="text-secondary-400">{sector}</span>
                        <span className="font-semibold">{Number(value).toFixed(2)}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Rebalancing Recommendations</h2>
              {(analysis.rebalancing_recommendations || []).length === 0 ? (
                <p className="text-secondary-300">No immediate rebalancing required based on current allocations.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.rebalancing_recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-secondary-700/30 border border-secondary-700 rounded-lg">
                      <p className="font-semibold">{rec.fund}</p>
                      <p className="text-sm text-secondary-300">
                        Current: {Number(rec.current_allocation || 0).toFixed(2)}% | Target: {Number(rec.recommended_allocation || 0).toFixed(2)}% | Action: {rec.action}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
