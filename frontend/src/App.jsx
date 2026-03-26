import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import FormPage from "./pages/FormPage";
import FirePlanner from "./pages/FirePlanner";
import MoneyScore from "./pages/MoneyScore";
import TaxWizard from "./pages/TaxWizard";
import MFXray from "./pages/MFXray";
import LifeEvent from "./pages/LifeEvent";
import CoupleePlanner from "./pages/CoupleePlanner";
import Articles from "./pages/Articles";
import APITest from "./pages/APITest";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gradient-midnight min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fire-planner" element={<FirePlanner />} />
          <Route path="/money-score" element={<MoneyScore />} />
          <Route path="/tax-wizard" element={<TaxWizard />} />
          <Route path="/mf-xray" element={<MFXray />} />
          <Route path="/life-event" element={<LifeEvent />} />
          <Route path="/couple-planner" element={<CoupleePlanner />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/api-test" element={<APITest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}