// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdown, setIsToolsDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-secondary-900 to-secondary-800 backdrop-blur-md border-b border-secondary-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="text-2xl">💰</div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">Money Mentor</span>
              <span className="text-xs text-secondary-400">AI Finance</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className={`font-medium transition-colors border-none bg-none cursor-pointer ${
                isActive("/") ? "text-primary-400" : "text-secondary-300 hover:text-primary-400"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className={`font-medium transition-colors border-none bg-none cursor-pointer ${
                isActive("/dashboard") ? "text-primary-400" : "text-secondary-300 hover:text-primary-400"
              }`}
            >
              Dashboard
            </button>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="font-medium text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-secondary-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-secondary-700">
                <button onClick={() => navigate("/fire-planner")} className="w-full text-left block px-4 py-3 hover:bg-secondary-700 text-secondary-300 hover:text-primary-400 rounded-t-lg first:rounded-t-lg transition-colors border-none bg-none cursor-pointer">
                  FIRE Path Planner
                </button>
                <button onClick={() => navigate("/money-score")} className="w-full text-left block px-4 py-3 hover:bg-secondary-700 text-secondary-300 hover:text-primary-400 transition-colors border-none bg-none cursor-pointer">
                  Money Health Score
                </button>
                <button onClick={() => navigate("/tax-wizard")} className="w-full text-left block px-4 py-3 hover:bg-secondary-700 text-secondary-300 hover:text-primary-400 transition-colors border-none bg-none cursor-pointer">
                  Tax Wizard
                </button>
                <button onClick={() => navigate("/mf-xray")} className="w-full text-left block px-4 py-3 hover:bg-secondary-700 text-secondary-300 hover:text-primary-400 rounded-b-lg transition-colors border-none bg-none cursor-pointer">
                  Portfolio X-Ray
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate("/articles")}
              className="font-medium text-secondary-300 hover:text-primary-400 transition-colors border-none bg-none cursor-pointer"
            >
              Articles
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary text-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col w-6 h-6 justify-between items-center"
          >
            <div className={`w-full h-0.5 bg-primary-400 transition-all ${isMenuOpen ? "transform rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-full h-0.5 bg-primary-400 transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-full h-0.5 bg-primary-400 transition-all ${isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-secondary-800 border-t border-secondary-700 px-6 py-4 space-y-3">
            <button 
              onClick={() => navigate("/")} 
              className="block w-full text-left text-secondary-300 hover:text-primary-400 font-medium border-none bg-none cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="block w-full text-left text-secondary-300 hover:text-primary-400 font-medium border-none bg-none cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => setIsToolsDropdown(!isToolsDropdown)}
              className="w-full text-left text-secondary-300 hover:text-primary-400 font-medium flex justify-between items-center border-none bg-none cursor-pointer"
            >
              Tools
              <svg className={`w-4 h-4 transition-transform ${isToolsDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {isToolsDropdown && (
              <div className="pl-4 space-y-2 animate-fadeInUp">
                <button onClick={() => navigate("/fire-planner")} className="block w-full text-left text-secondary-400 hover:text-primary-400 text-sm border-none bg-none cursor-pointer">
                  FIRE Path Planner
                </button>
                <button onClick={() => navigate("/money-score")} className="block w-full text-left text-secondary-400 hover:text-primary-400 text-sm border-none bg-none cursor-pointer">
                  Money Health Score
                </button>
                <button onClick={() => navigate("/tax-wizard")} className="block w-full text-left text-secondary-400 hover:text-primary-400 text-sm border-none bg-none cursor-pointer">
                  Tax Wizard
                </button>
                <button onClick={() => navigate("/mf-xray")} className="block w-full text-left text-secondary-400 hover:text-primary-400 text-sm border-none bg-none cursor-pointer">
                  Portfolio X-Ray
                </button>
              </div>
            )}
            <button
              onClick={() => navigate("/articles")}
              className="block w-full text-left text-secondary-300 hover:text-primary-400 font-medium border-none bg-none cursor-pointer"
            >
              Articles
            </button>
            <div className="flex gap-3 pt-4">
              <button onClick={() => navigate("/login")} className="btn-secondary text-sm flex-1">
                Sign In
              </button>
              <button onClick={() => navigate("/login")} className="btn-primary text-sm flex-1">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}