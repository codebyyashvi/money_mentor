import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Articles() {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "Understanding FIRE - Financial Independence, Retire Early",
      category: "Investment Planning",
      readTime: "8 min read",
      excerpt: "Learn the fundamentals of FIRE and how to build your path to financial independence...",
      image: "🎯"
    },
    {
      id: 2,
      title: "Emergency Fund 101 - Why 6 Months Matters",
      category: "Financial Security",
      readTime: "5 min read",
      excerpt: "Discover why an emergency fund is crucial and how to build yours step by step...",
      image: "🆘"
    },
    {
      id: 3,
      title: "Tax-Saving Investments: ELSS vs PPF vs NPS",
      category: "Tax Planning",
      readTime: "10 min read",
      excerpt: "Compare different tax-saving instruments and choose the best for your financial goals...",
      image: "💸"
    },
    {
      id: 4,
      title: "Mutual Fund Basics - Building Your Portfolio",
      category: "Investing",
      readTime: "7 min read",
      excerpt: "Start your mutual fund journey with comprehensive guidance on fund selection and strategy...",
      image: "📊"
    },
    {
      id: 5,
      title: "Debt Management - From Loans to Freedom",
      category: "Debt Management",
      readTime: "9 min read",
      excerpt: "Effective strategies to manage debt and accelerate your journey to financial freedom...",
      image: "💳"
    },
    {
      id: 6,
      title: "Insurance Planning - Protecting Your Family's Future",
      category: "Insurance",
      readTime: "6 min read",
      excerpt: "Understand different insurance types and build a comprehensive protection plan...",
      image: "🛡️"
    },
  ];

  const categories = [
    "All Articles",
    "Investment Planning",
    "Tax Planning",
    "Investing",
    "Insurance",
    "Debt Management",
    "Financial Security"
  ];

  return (
    <div className="bg-gradient-midnight min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-2">Financial Articles & Guides</h1>
          <p className="section-subtitle">
            Expert insights and actionable guides to help you master your finances
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto mb-12 pb-4 border-b border-secondary-700">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                cat === "All Articles"
                  ? "bg-primary-500 text-white"
                  : "bg-secondary-700/50 text-secondary-300 hover:bg-secondary-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map(article => (
            <div
              key={article.id}
              className="card cursor-pointer group hover:border-primary-400 hover:shadow-card-lg transition-all flex flex-col"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {article.image}
              </div>

              <div className="flex-1">
                <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/20 text-primary-300">
                  {article.category}
                </span>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-secondary-400 text-sm mb-4 flex-1">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-secondary-700">
                <span className="text-xs text-secondary-400">📖 {article.readTime}</span>
                <span className="text-primary-400 font-semibold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="card-blur border-2 border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-center py-12">
          <h2 className="text-2xl font-bold mb-3">Stay Updated on Financial Tips</h2>
          <p className="text-secondary-300 mb-6 max-w-2xl mx-auto">
            Get weekly articles and insights delivered to your inbox
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </div>

        {/* Related Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Start Your Financial Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Money Health Score",
                desc: "Get a 5-minute financial assessment",
                icon: "📊",
                action: () => navigate("/money-score")
              },
              {
                title: "FIRE Planner",
                desc: "Plan your path to financial independence",
                icon: "🎯",
                action: () => navigate("/fire-planner")
              },
              {
                title: "Tax Wizard",
                desc: "Optimize your taxes with AI insights",
                icon: "💸",
                action: () => navigate("/tax-wizard")
              }
            ].map((resource, idx) => (
              <div key={idx} className="card text-center hover:border-primary-400 transition-all">
                <div className="text-4xl mb-3">{resource.icon}</div>
                <h3 className="font-bold mb-2">{resource.title}</h3>
                <p className="text-secondary-400 text-sm mb-4">{resource.desc}</p>
                <button
                  onClick={resource.action}
                  className="btn-outline w-full text-sm"
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
