import fleetStats from "../data/fleetStats.json";

export default function KPICards() {
  const stats = fleetStats;

  const cards = [
    {
      label: "Trips Today",
      value: stats.total_trips.toLocaleString(),
      icon: "🚌",
    },
    {
      label: "Distance",
      value: `${stats.total_km.toLocaleString()} km`,
      icon: "🛣️",
    },
    {
      label: "Average Speed",
      value: `${stats.avg_speed_kmh} km/h`,
      icon: "⚡",
    },
    {
      label: "On Time",
      value: `${stats.on_time_percentage}%`,
      icon: "⏱️",
    },
    {
      label: "Fleet Utilization",
      value: `${stats.avg_utilization_percent}%`,
      icon: "📈",
    },
    {
      label: "Revenue",
      value: `₱${stats.avg_daily_revenue_php.toLocaleString()}`,
      icon: "💰",
    },
    {
      label: "Peak Hour",
      value: `${stats.peak_hour}:00`,
      icon: "🕐",
    },
    {
      label: "Active Fleet",
      value: stats.vehicles_active,
      icon: "🚍",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 18,
        marginBottom: 24,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 8px 24px rgba(15,23,42,.08)",
            transition: ".25s",
          }}
        >
          <div
            style={{
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            {card.icon}
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {card.value}
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
