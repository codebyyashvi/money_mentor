import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "FIRE Path Planner",
      description: "Build your month-by-month wealth roadmap with AI-powered SIP recommendations and asset allocation.",
      icon: "🎯",
      path: "/fire-planner",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      id: 2,
      title: "Money Health Score",
      description: "Get a comprehensive financial wellness score across 6 dimensions in just 5 minutes.",
      icon: "📊",
      path: "/money-score",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      id: 3,
      title: "Life Event Advisor",
      description: "AI guidance for bonus, inheritance, marriage, and major life event financial decisions.",
      icon: "🎊",
      path: "/life-event",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      id: 4,
      title: "Tax Wizard",
      description: "Upload Form 16, discover missing deductions, and optimize between tax regimes instantly.",
      icon: "💸",
      path: "/tax-wizard",
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: 5,
      title: "Couple's Money Planner",
      description: "India's first joint financial planning tool optimizing across both incomes.",
      icon: "💑",
      path: "/couple-planner",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      id: 6,
      title: "Portfolio X-Ray",
      description: "Upload CAMS statement and get instant portfolio analysis, XIRR, and rebalancing plans.",
      icon: "🔬",
      path: "/mf-xray",
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  const stats = [
    { value: "95%", label: "Indians without financial plan" },
    { value: "₹25,000+", label: "Annual advisor cost (HNIs only)" },
    { value: "5 mins", label: "To get your Money Health Score" },
    { value: "24/7", label: "AI guidance available" },
  ];

  return (
    <div className="bg-gradient-midnight min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -z-10 opacity-10">
            <div className="w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-full text-primary-300 text-sm font-semibold">
                ✨ AI-Powered Financial Planning
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Your Personal <span className="gradient-text">Finance Mentor</span>, Always by Your Side
              </h1>

              <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
                Turn confused savers into confident investors. Get a personalized financial plan in minutes, not months. 
                AI-powered insights that scale from students to entrepreneurs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate("/form")}
                  className="btn-primary text-lg font-semibold"
                >
                  Start Free Assessment → 
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-outline text-lg font-semibold"
                >
                  View Dashboard
                </button>
              </div>

              <p className="text-sm text-secondary-400">
                No credit card required • Takes 5 minutes • Get insights instantly
              </p>
            </div>

            <div className="relative animate-slideInRight">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-2xl opacity-20"></div>
                <div className="relative bg-secondary-800/80 backdrop-blur border border-secondary-700 rounded-2xl p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary-700/50 rounded-lg border border-primary-500/30">
                      <div className="text-2xl">📈</div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-400">Investment Growth</p>
                        <p className="font-bold text-primary-400">₹48.5L in 10 years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-700/50 rounded-lg border border-accent-500/30">
                      <div className="text-2xl">🎯</div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-400">Retirement Ready</p>
                        <p className="font-bold text-accent-400">Age 45 - On Track</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-700/50 rounded-lg border border-primary-500/30">
                      <div className="text-2xl">💰</div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-400">Monthly SIP</p>
                        <p className="font-bold text-primary-400">₹15,000 optimized</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-700/50 rounded-lg border border-accent-500/30">
                      <div className="text-2xl">🛡️</div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-400">Coverage Gap</p>
                        <p className="font-bold text-accent-400">₹25L needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="card text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">{stat.value}</p>
            <p className="text-secondary-400">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="section-title">Powerful Financial Tools</h2>
          <p className="section-subtitle">
            Everything you need to master your finances in one intelligent platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              onClick={() => navigate(feature.path)}
              className="card cursor-pointer group hover:border-primary-400 overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>

                <h3 className="text-xl font-bold mb-3 text-primary-50">{feature.title}</h3>

                <p className="text-secondary-400 mb-6 leading-relaxed">{feature.description}</p>

                <div className="flex items-center text-primary-400 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get your personalized financial plan in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: 1, title: "Assessment", desc: "Answer 20 quick questions about your finances" },
            { step: 2, title: "Analysis", desc: "AI analyzes your situation and risk profile" },
            { step: 3, title: "Insights", desc: "Get personalized recommendations and plans" },
            { step: 4, title: "Act", desc: "Track progress and adjust with AI guidance" },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="card text-center">
                <div className="text-4xl font-bold text-primary-500 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-secondary-400 text-sm">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/3 -right-3 text-primary-500 transform -translate-y-1/2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 mb-20">
        <div className="card-blur border-2 border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-center py-12">
          <h2 className="section-title mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians building wealth with confidence. Get your Money Health Score today.
          </p>
          <button
            onClick={() => navigate("/form")}
            className="btn-primary text-lg font-semibold"
          >
            Start Your Free Assessment Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-700 bg-secondary-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-12 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Money Mentor</h3>
              <p className="text-secondary-400 text-sm">Making financial planning accessible to every Indian.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li className="hover:text-primary-400 cursor-pointer">FIRE Planner</li>
                <li className="hover:text-primary-400 cursor-pointer">Tax Wizard</li>
                <li className="hover:text-primary-400 cursor-pointer">Portfolio X-Ray</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li className="hover:text-primary-400 cursor-pointer">Blog</li>
                <li className="hover:text-primary-400 cursor-pointer">Guides</li>
                <li className="hover:text-primary-400 cursor-pointer">FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li className="hover:text-primary-400 cursor-pointer">Privacy</li>
                <li className="hover:text-primary-400 cursor-pointer">Terms</li>
                <li className="hover:text-primary-400 cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">© 2024 AI Money Mentor. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-primary-400">Twitter</a>
              <a href="#" className="text-secondary-400 hover:text-primary-400">LinkedIn</a>
              <a href="#" className="text-secondary-400 hover:text-primary-400">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}