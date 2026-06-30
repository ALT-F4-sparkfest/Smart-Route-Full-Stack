// src/components/operator/AIRecommendationPanel.jsx

import { Sparkles, ArrowRight, AlertTriangle } from "lucide-react";

export default function AIRecommendationPanel({
  vehicles = [],
  waitingCommuters = [],
}) {
  const waiting = waitingCommuters.length;

  const recommendation =
    waiting > 10
      ? {
          level: "High",
          message:
            "High commuter demand detected. Dispatch another vehicle immediately.",
          color: "#EF4444",
        }
      : waiting > 5
        ? {
            level: "Medium",
            message: "Demand is increasing. Prepare an additional jeepney.",
            color: "#F59E0B",
          }
        : {
            level: "Normal",
            message: "Fleet distribution is healthy. No intervention required.",
            color: "#22C55E",
          };

  return (
    <div className="dash-section">
      <h2 className="panel-title">
        <Sparkles size={18} /> AI Dispatch Assistant
      </h2>

      <div
        style={{
          marginTop: 16,
          padding: 18,
          borderRadius: 16,
          background: recommendation.color,
          color: "white",
        }}
      >
        <h3
          style={{
            marginBottom: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <AlertTriangle size={18} />
          {recommendation.level} Priority
        </h3>

        <p
          style={{
            lineHeight: 1.5,
            marginBottom: 18,
          }}
        >
          {recommendation.message}
        </p>

        <button
          style={{
            background: "white",
            color: recommendation.color,
            border: "none",
            borderRadius: 12,
            padding: "10px 16px",
            cursor: "pointer",
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          View Recommendation
          <ArrowRight size={16} />
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <Metric label="Vehicles" value={vehicles.length} />

        <Metric label="Waiting" value={waitingCommuters.length} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748B",
        }}
      >
        {label}
      </div>
    </div>
  );
}
