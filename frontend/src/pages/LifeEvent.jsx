import { useState } from "react";
import Navbar from "../components/Navbar";

export default function LifeEvent() {
  const [selectedEvent, setSelectedEvent] = useState("bonus");

  const events = {
    bonus: {
      title: "Got a Bonus 💰",
      amount: 200000,
      desc: "You've just received a bonus. Let's optimize it!",
      recommendations: [
        {
          id: 1,
          action: "Emergency Fund Boost",
          amount: 50000,
          reason: "Ensure 6-month emergency coverage first",
          taxImplication: "No tax impact"
        },
        {
          id: 2,
          action: "Tax-Saving Investment",
          amount: 150000,
          reason: "Invest in ELSS for tax deduction + growth",
          taxImplication: "Save ₹30,000 in taxes"
        }
      ]
    },
    inheritance: {
      title: "Received Inheritance 🏡",
      amount: 5000000,
      desc: "You've received inheritance. Smart decisions ahead!",
      recommendations: [
        {
          id: 1,
          action: "Emergency Fund",
          amount: 300000,
          reason: "6-month living expenses at one place",
          taxImplication: "No inheritance tax in India"
        },
        {
          id: 2,
          action: "Diversified Portfolio",
          amount: 3500000,
          reason: "Build long-term wealth with 60-30-10 allocation",
          taxImplication: "Plan for future tax on returns"
        },
        {
          id: 3,
          action: "Real Estate Investment",
          amount: 1200000,
          reason: "Consider property investment or REIT",
          taxImplication: "Check capital gains rules"
        }
      ]
    },
    marriage: {
      title: "Getting Married 💍",
      amount: 1000000,
      desc: "Life milestone! Let's plan finances together.",
      recommendations: [
        {
          id: 1,
          action: "Combine Finances",
          amount: null,
          reason: "Review both incomes and assets",
          taxImplication: "Optimize joint taxation"
        },
        {
          id: 2,
          action: "Emergency Fund",
          amount: 150000,
          reason: "Combined 6-month expenses for household",
          taxImplication: "No tax implication"
        },
        {
          id: 3,
          action: "Joint Insurance",
          amount: 500000,
          reason: "Review and consolidate family protection",
          taxImplication: "Potential HUF benefits"
        }
      ]
    },
    baby: {
      title: "New Baby Born 👶",
      amount: 500000,
      desc: "Congratulations! Let's secure your child's future.",
      recommendations: [
        {
          id: 1,
          action: "Children's Insurance",
          amount: 25000,
          reason: "Start a CVCL policy for child education",
          taxImplication: "Deductible under Section 80C"
        },
        {
          id: 2,
          action: "Education Fund",
          amount: 300000,
          reason: "Monthly SIP for future education costs",
          taxImplication: "Growth tax-deferred"
        },
        {
          id: 3,
          action: "Life Insurance",
          amount: 175000,
          reason: "Increase your protection for family security",
          taxImplication: "Deductible under Section 80C"
        }
      ]
    }
  };

  const currentEvent = events[selectedEvent];

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Life Event Financial Advisor</h1>
        <p className="section-subtitle">AI-powered guidance for major life-event financial decisions</p>

        {/* Event Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {Object.entries(events).map(([key, event]) => (
            <button
              key={key}
              onClick={() => setSelectedEvent(key)}
              className={`card text-center cursor-pointer transition-all ${
                selectedEvent === key ? "border-primary-500 bg-primary-500/10" : ""
              }`}
            >
              <div className="text-3xl mb-2">{event.title.split(" ")[event.title.split(" ").length - 1]}</div>
              <p className="font-semibold text-sm">{event.title.split(" ").slice(0, -1).join(" ")}</p>
            </button>
          ))}
        </div>

        {/* Event Details */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{currentEvent.title}</h2>
              <p className="text-secondary-400">{currentEvent.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-secondary-400 text-sm">Amount Available</p>
              <p className="text-2xl font-bold text-primary-400">
                ₹{(currentEvent.amount / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </div>

        {/* Smart Allocation Strategy */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Smart Allocation Strategy</h2>

          <div className="space-y-4">
            {currentEvent.recommendations.map((rec, idx) => {
              const allocation = rec.amount ? (rec.amount / currentEvent.amount) * 100 : 0;
              return (
                <div key={rec.id} className="border border-secondary-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg">{idx + 1}.</span>
                        <h3 className="text-xl font-bold">{rec.action}</h3>
                      </div>
                      <p className="text-secondary-400 mb-3">{rec.reason}</p>
                      <p className="text-sm text-primary-400 font-semibold">📊 {rec.taxImplication}</p>
                    </div>
                    {rec.amount && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-primary-400">
                          ₹{(rec.amount / 100000).toFixed(2)}L
                        </p>
                        <p className="text-xs text-secondary-400 mt-1">{allocation.toFixed(1)}% allocation</p>
                      </div>
                    )}
                  </div>

                  {rec.amount && (
                    <div className="w-full bg-secondary-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${allocation}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <p className="text-primary-300 text-sm">
              <strong>Total Allocation:</strong> 100% • This allocation is personalized based on your tax bracket, goals, and risk profile
            </p>
          </div>
        </div>

        {/* Action Checklist */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Action Checklist</h2>
          <div className="space-y-3">
            {[
              "Review your tax bracket to optimize deductions",
              "Consult with a certified financial planner",
              "Check current investment options and returns",
              "Review insurance and emergency fund status",
              "Update your financial goals",
              "Set up automated SIP for long-term investments",
              "Track your portfolio performance"
            ].map((action, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-500"
                />
                <span>{action}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
