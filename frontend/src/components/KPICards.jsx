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
      title: "Active Vehicles",
      value: metrics.activeVehicles,
      icon: <Bus size={22} />,
      gradient: "linear-gradient(135deg,#2563EB,#60A5FA)",
    },
    {
      title: "Waiting Riders",
      value: waiters.length,
      icon: <Users size={22} />,
      gradient: "linear-gradient(135deg,#EF4444,#FB7185)",
    },
    {
      title: "Average Speed",
      value: `${avgSpeed} km/h`,
      icon: <Gauge size={22} />,
      gradient: "linear-gradient(135deg,#10B981,#34D399)",
    },
    {
      title: "On-Time Rate",
      value: `${metrics.onTimePct}%`,
      icon: <Clock3 size={22} />,
      gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)",
    },
    {
      title: "Trips Today",
      value: metrics.totalTripsToday,
      icon: <Route size={22} />,
      gradient: "linear-gradient(135deg,#7C3AED,#A855F7)",
    },
    {
      title: "Passengers",
      value: metrics.totalPassengersToday.toLocaleString(),
      icon: <TrendingUp size={22} />,
      gradient: "linear-gradient(135deg,#EC4899,#F472B6)",
    },
    {
      title: "Revenue",
      value: `₱${(metrics.totalPassengersToday * 15).toLocaleString()}`,
      icon: <DollarSign size={22} />,
      gradient: "linear-gradient(135deg,#14B8A6,#2DD4BF)",
    },
    {
      title: "Fleet Health",
      value: "98%",
      subtitle: "Excellent",
      icon: <Activity size={22} />,
      gradient: "linear-gradient(135deg,#22C55E,#4ADE80)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 28,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            padding: 24,
            color: "white",
            background: card.gradient,
            boxShadow: "0 18px 45px rgba(0,0,0,.15)",
            transition: "all .25s ease",
            minHeight: 150,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "rgba(255,255,255,.12)",
            }}
          />

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(255,255,255,.18)",
              backdropFilter: "blur(10px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            {card.icon}
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {card.value}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 15,
              opacity: 0.95,
            }}
          >
            {card.title}
          </div>

          {card.subtitle && (
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                opacity: 0.8,
              }}
            >
              {card.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
