import fleetStats from "../data/fleetStats.json";

export default function KPICards() {
  const stats = fleetStats;

  const cards = [
    {
      label: "Total Trips",
      value: stats.total_trips.toLocaleString(),
      icon: "🚌",
    },
    { label: "Total KM", value: stats.total_km.toLocaleString(), icon: "📏" },
    { label: "Avg Speed", value: `${stats.avg_speed_kmh} km/h`, icon: "⚡" },
    { label: "On-Time %", value: `${stats.on_time_percentage}%`, icon: "⏱️" },
    {
      label: "Utilization",
      value: `${stats.avg_utilization_percent}%`,
      icon: "📊",
    },
    {
      label: "Daily Revenue",
      value: `₱${stats.avg_daily_revenue_php.toLocaleString()}`,
      icon: "💰",
    },
    { label: "Peak Hour", value: `${stats.peak_hour}:00`, icon: "🕐" },
    { label: "Active Vehicles", value: stats.vehicles_active, icon: "🚐" },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="kpi-card">
          <div className="kpi-icon">{card.icon}</div>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
