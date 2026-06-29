import { Routes, Route, Link, useLocation } from "react-router-dom";
import CommuterView from "./pages/CommuterView";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">🚌</span>
          <div>
            <h1 className="title">SmartRoute PH</h1>
            <span className="subtitle">Live PUV Tracking</span>
          </div>
        </div>
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Commuter
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<CommuterView />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
