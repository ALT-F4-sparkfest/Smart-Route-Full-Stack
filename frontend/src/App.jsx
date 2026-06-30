// src/App.jsx
import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import CommuterView from "./pages/CommuterView";
import OperatorView from "./pages/OperatorView";

function App() {
  const [activeView, setActiveView] = useState("landing");

  const goLanding = () => setActiveView("landing");

  const renderView = () => {
    switch (activeView) {
      case "commuter":
        return <CommuterView onBack={goLanding} />;
      case "operator":
        return <OperatorView onBack={goLanding} />;
      case "landing":
      default:
        return <LandingPage setActiveView={setActiveView} />;
    }
  };

  // Commuter and Operator modes own their full screen layout;
  // Landing keeps the original padded app shell.
  if (activeView === "landing") {
    return (
      <div className="app-container">
        <div className="app-content">{renderView()}</div>
      </div>
    );
  }

  return <div className="app-fullscreen">{renderView()}</div>;
}

export default App;
