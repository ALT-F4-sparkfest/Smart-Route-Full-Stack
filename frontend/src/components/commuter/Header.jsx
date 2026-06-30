// src/components/commuter/Header.jsx

import { ArrowLeft, Bus, Bell } from "lucide-react";
import ConnectionStatusPill from "../ConnectionStatusPill";

export default function Header({ onBack, status }) {
  return (
    <header className="commuter-header-modern">
      <button className="header-icon-btn" onClick={onBack} aria-label="Go back">
        <ArrowLeft size={22} />
      </button>

      <div className="header-brand">
        <Bus size={26} />
        <div>
          <h1>BUSINA</h1>
          <span>Real-time commuter</span>
        </div>
      </div>

      <div className="header-right">
        <ConnectionStatusPill status={status} />

        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
