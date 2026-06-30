// src/components/KPICards.jsx

import fleetStats from "../data/fleetStats.json";

const cards = [
  {
    key: "vehicles_active",
    title: "Active Fleet",
    icon: "🚌",
    color: "#2563EB",
  },
  {
    key: "total_trips",
    title: "Trips Today",
    icon: "🛣️",
    color: "#10B981",
  },
  {
    key: "avg_speed_kmh",
    title: "Avg Speed",
    icon: "⚡",
    color: "#F59E0B",
    suffix: " km/h",
  },
  {
    key: "on_time_percentage",
    title: "On-Time",
    icon: "⏱️",
    color: "#8B5CF6",
    suffix: "%",
  },
];

export default function KPICards() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 28,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.key}
          title={card.title}
          value={fleetStats[card.key]}
          icon={card.icon}
          color={card.color}
          suffix={card.suffix}
        />
      ))}
    </section>
  );
}

function Card({ title, value, icon, color, suffix = "" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 22,
        boxShadow: "0 10px 35px rgba(15,23,42,.08)",
        border: "1px solid #E2E8F0",
        transition: ".2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: "#64748B",
            fontWeight: 600,
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: "#0F172A",
          marginTop: 18,
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#94A3B8",
          fontSize: 13,
        }}
      >
        Live operational metric
      </div>
    </div>
  );
}
