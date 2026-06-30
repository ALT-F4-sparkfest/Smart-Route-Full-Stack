// src/components/KPICards.jsx

import {
  Bus,
  Users,
  Gauge,
  Clock3,
  Route,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

import { useDemoSimulation } from "../hooks/useDemoSimulation";

export default function KPICards() {
  const { metrics, vehicles, waiters } = useDemoSimulation();

  const avgSpeed = vehicles.length
    ? Math.round(
        vehicles.reduce((sum, v) => sum + (v.speed || 0), 0) / vehicles.length,
      )
    : 0;

  const cards = [
    {
      icon: <Bus size={22} />,
      title: "Active Vehicles",
      value: metrics.activeVehicles,
      color: "#2563EB",
    },
    {
      icon: <Users size={22} />,
      title: "Waiting Riders",
      value: waiters.length,
      color: "#EF4444",
    },
    {
      icon: <Gauge size={22} />,
      title: "Average Speed",
      value: `${avgSpeed} km/h`,
      color: "#10B981",
    },
    {
      icon: <Clock3 size={22} />,
      title: "On-Time Rate",
      value: `${metrics.onTimePct}%`,
      color: "#F59E0B",
    },
    {
      icon: <Route size={22} />,
      title: "Trips Today",
      value: metrics.totalTripsToday,
      color: "#7C3AED",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Passengers",
      value: metrics.totalPassengersToday,
      color: "#EC4899",
    },
    {
      icon: <DollarSign size={22} />,
      title: "Estimated Revenue",
      value: `₱${(metrics.totalPassengersToday * 15).toLocaleString()}`,
      color: "#14B8A6",
    },
    {
      icon: <Activity size={22} />,
      title: "Fleet Health",
      value: "Excellent",
      color: "#22C55E",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
        gap: 18,
        marginBottom: 28,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(15,23,42,.08)",
            transition: ".2s",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: `${card.color}20`,
              color: card.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            {card.icon}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            {card.value}
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#64748B",
              fontSize: 14,
            }}
          >
            {card.title}
          </div>
        </div>
      ))}
    </div>
  );
}
