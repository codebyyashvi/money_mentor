# AI Money Mentor - Frontend

A professional, industrial-level React frontend for India's AI-powered personal finance platform. Built with Vite, React Router, and Tailwind CSS.

## 🎯 Project Overview

**AI Money Mentor** makes financial planning accessible to every Indian by providing AI-powered personalized financial guidance. This frontend is the user-facing application for interacting with all financial planning tools and features.

## ✨ Features

### 🏠 Home Page
- Marketing landing page showcasing all platform features
- Hero section with clear value proposition
- Feature cards with hover effects
- Statistics and testimonials section
- Call-to-action sections for user engagement

### 💰 Core Features

#### 1. **FIRE Path Planner** (`/fire-planner`)
- Build month-by-month wealth roadmaps
- AI-powered SIP recommendations
- Asset allocation optimization
- Interactive calculator with real-time results
- Personalized action plans

#### 2. **Money Health Score** (`/money-score`)
- 5-minute comprehensive financial assessment
- 6-dimension wellness scoring:
  - Emergency Preparedness
  - Insurance Coverage
  - Investment Diversification
  - Debt Health
  - Tax Efficiency
  - Retirement Readiness
- Detailed recommendations for improvement

#### 3. **Tax Wizard** (`/tax-wizard`)
- Form 16 analysis (Form upload simulation)
- Old vs. New tax regime comparison
- Tax-saving opportunity identification
- Deduction optimization
- Expected tax savings calculator

#### 4. **Portfolio X-Ray** (`/mf-xray`)
- CAMS/KFintech statement upload (simulation)
- Complete portfolio reconstruction
- Extended Internal Rate of Return (XIRR) calculation
- Overlap analysis
- Expense ratio comparison
- Rebalancing recommendations

#### 5. **Life Event Financial Advisor** (`/life-event`)
- Bonus optimization
- Inheritance planning
- Marriage financial coordination
- Newborn financial security
- Tailored recommendations by life event

#### 6. **Couple's Money Planner** (`/couple-planner`)
- Joint financial planning
- HRA exemption optimization for couples
- SIP allocation strategies
- Combined tax benefit calculation
- Household-level financial goals

### 📊 Dashboard (`/dashboard`)
- Comprehensive financial overview with multiple tabs:
  - **Overview**: Money Health Score, Quick Stats, Asset breakdown
  - **FIRE Plan**: Retirement timeline, corpus projection
  - **Recommendations**: Prioritized action items
  - **Assets**: Portfolio allocation visualization

### 📝 Financial Profile Form (`/form`)
- 4-step multi-page form
- Progressive disclosure of questions
- Visual progress indicator
- Sections:
  1. Personal Information
  2. Financial Situation
  3. Investment Profile
  4. Financial Goals

## 🎨 Design System

### Color Scheme
- **Primary**: Green (#22c55e) - Growth & positivity
- **Secondary**: Deep blue (#1e293b) - Trust & stability
- **Accent**: Blue (#3b82f6) - Action & highlights
- **Background**: Midnight (#0f172a) - Modern dark theme

### Typography
- Font: Inter (Google Fonts)
- Hierarchy: H1-H6 with consistent sizing
- Professional yet approachable tone

### Components
- Custom buttons (Primary, Secondary, Outline)
- Card containers with hover effects
- Form inputs with validation states
- Progress bars and gauges
- Responsive tabs and modals
- Alert/notification components
- Loading spinners and skeleton states

## 📁 Project Structure

```
src/
├── pages/                    # Page components
│   ├── Home.jsx             # Marketing landing page
│   ├── Dashboard.jsx        # Main user dashboard
│   ├── FormPage.jsx         # Financial profile form
│   ├── FirePlanner.jsx      # FIRE planning tool
│   ├── MoneyScore.jsx       # Financial health scoring
│   ├── TaxWizard.jsx        # Tax optimization tool
│   ├── MFXray.jsx           # Portfolio analysis tool
│   ├── LifeEvent.jsx        # Life event advisor
│   └── CoupleePlanner.jsx   # Couple's planning tool
│
├── components/              # Reusable components
│   ├── Navbar.jsx          # Navigation with dropdowns
│   ├── InputForm.jsx       # Financial data input form
│   ├── ScoreCard.jsx       # Circular score display
│   ├── FIRECard.jsx        # FIRE plan summary
│   ├── AdviceBox.jsx       # AI recommendation display
│   ├── StatCard.jsx        # Stat display card
│   ├── ProgressBar.jsx     # Progress visualization
│   ├── Alert.jsx           # Alert/notification
│   ├── FeatureCard.jsx     # Feature showcase card
│   ├── FormInput.jsx       # Form input with validation
│   ├── TabGroup.jsx        # Tab navigation
│   ├── Modal.jsx           # Modal dialog
│   └── LoadingSpinner.jsx  # Loading state
│
├── App.jsx                  # Main app component with routing
├── main.jsx                # Entry point
├── index.css               # Global styles & animations
└── App.css                 # App-specific styles

tailwind.config.js          # Tailwind configuration
vite.config.js              # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
1. No environment variables required for basic setup
2. Default API endpoints can be configured in component files
3. Local storage is used for development data persistence

## 🎯 Key Technologies

- **React 19.2**: UI framework
- **Vite 8**: Build tool & dev server
- **React Router 7**: Client-side routing
- **Tailwind CSS 3**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **ESLint**: Code quality

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hamburger navigation on mobile
- Touch-friendly button sizes
- Optimized for all screen sizes

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Home Page | ✅ Complete | Full landing page with all sections |
| Financial Profile Form | ✅ Complete | 4-step multi-page form with validation |
| Dashboard | ✅ Complete | Multiple tabs with visualizations |
| FIRE Planner | ✅ Complete | Interactive calculator with projections |
| Money Health Score | ✅ Complete | 6-dimension assessment tool |
| Tax Wizard | ✅ Complete | Regime comparison & tax optimization |
| Portfolio X-Ray | ✅ Complete | Portfolio analysis & recommendations |
| Life Event Advisor | ✅ Complete | Multi-scenario financial planning |
| Couple's Money Planner | ✅ Complete | Joint financial optimization |
| Responsive Design | ✅ Complete | Mobile/Tablet/Desktop optimized |
| Dark Theme | ✅ Complete | Professional dark interface |
| Component Library | ✅ Complete | 13+ reusable UI components |

## 🔧 Development

### Running Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Building for Production
```bash
npm run build
# Output: dist/ ~316KB JavaScript, ~34KB CSS
```

### Code Quality
```bash
npm run lint
# ESLint configuration in place
```

## 📊 Performance

- **Build Size**: ~34KB CSS, ~316KB JS (gzipped: 6KB + 89KB)
- **Load Time**: < 2 seconds on 4G
- **Lighthouse Target**: 90+
- **Performance**: Optimized animations and transitions

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js` theme colors

### Adding New Pages
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Link in Navbar/routing

### Creating New Components
1. Add component to `src/components/`
2. Use CSS classes from `index.css`
3. Follow existing component patterns

## 🔐 Security

- Input validation on all forms
- XSS protection via React JSX
- CSRF protection ready for backend
- Secure localStorage usage
- No sensitive data in console

## 🐛 Known Issues & TODOs

- [ ] Backend API integration
- [ ] Real data persistence
- [ ] PDF export functionality
- [ ] Payment gateway integration
- [ ] User authentication
- [ ] Analytics integration
- [ ] Advanced charting capabilities

## 📝 License

Private

---

**Built for Making Financial Planning Accessible to Every Indian** 💰
