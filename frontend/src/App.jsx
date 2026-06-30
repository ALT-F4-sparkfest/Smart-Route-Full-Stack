// src/App.jsx
import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import CommuterView from "./pages/CommuterView";
import AdminDashboard from "./pages/AdminDashboard";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  const [activeView, setActiveView] = useState("landing");

  const renderView = () => {
    switch (activeView) {
      case "landing":
        return <LandingPage setActiveView={setActiveView} />;
      case "commuter":
        return <CommuterView />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <LandingPage setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">{renderView()}</div>
      {activeView !== "landing" && (
        <MobileBottomNav
          activeView={activeView}
          setActiveView={setActiveView}
        />
      )}
    </div>
  );
}

export default App;
