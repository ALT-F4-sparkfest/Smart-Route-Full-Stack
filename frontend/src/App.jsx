import { useState } from "react";
import "./App.css";
import CommuterView from "./pages/CommuterView";
import AdminDashboard from "./pages/AdminDashboard";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  const [activeView, setActiveView] = useState("commuter");

  return (
    <div className="app-container">
      <div className="app-content">
        {activeView === "commuter" && <CommuterView />}
        {activeView === "admin" && <AdminDashboard />}
      </div>
      <MobileBottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

export default App;
