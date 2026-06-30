// src/components/MobileBottomNav.jsx
export default function MobileBottomNav({ activeView, setActiveView }) {
  const tabs = [
    { id: "commuter", label: "Commuter", icon: "🗺️" },
    { id: "admin", label: "Dashboard", icon: "📊" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${activeView === tab.id ? "active" : ""}`}
          onClick={() => setActiveView(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
