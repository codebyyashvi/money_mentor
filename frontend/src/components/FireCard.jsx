export default function FIRECard({ corpus = "₹5.2 Cr", sip = "₹25,000", status = "ON_TRACK" }) {
  const getStatusColor = (status) => {
    if (status === "ON_TRACK") return "text-green-400 bg-green-500/10 border-green-500/30";
    if (status === "AT_RISK") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  const statusText = {
    ON_TRACK: "✓ On Track",
    AT_RISK: "⚠ At Risk",
    OFF_TRACK: "✗ Off Track"
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">FIRE Plan Overview</h3>
          <p className="text-secondary-400 text-sm">Financial Independence Journey</p>
        </div>
        <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(status)}`}>
          {statusText[status]}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-secondary-700/50 rounded-lg p-4">
          <p className="text-secondary-400 text-sm mb-1">Target FIRE Corpus</p>
          <p className="text-2xl font-bold text-primary-400">{corpus}</p>
        </div>

        <div className="bg-secondary-700/50 rounded-lg p-4">
          <p className="text-secondary-400 text-sm mb-1">Recommended Monthly SIP</p>
          <p className="text-2xl font-bold text-accent-400">{sip}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-secondary-400 text-xs mb-2">Progress to FIRE</p>
          <div className="w-full bg-secondary-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              style={{ width: "65%" }}
            />
          </div>
          <p className="text-xs text-secondary-400 mt-1">17 years remaining</p>
        </div>
      </div>

      <button className="btn-secondary w-full mt-6 text-sm">
        View Detailed FIRE Plan →
      </button>
    </div>
  );
}