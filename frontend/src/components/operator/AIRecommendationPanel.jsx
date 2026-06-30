// src/components/operator/AIRecommendationPanel.jsx

import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Bus,
  Users,
  Brain,
} from "lucide-react";

export default function AIRecommendationPanel({
  vehicles = [],
  waitingCommuters = [],
}) {
  const waiting = waitingCommuters.length;

  let recommendation = {
    level: "Normal",
    color: "#22C55E",
    confidence: "98%",
    message:
      "Fleet distribution is healthy. No dispatch action is currently required.",
  };

  if (waiting > 5) {
    recommendation = {
      level: "Medium",
      color: "#F59E0B",
      confidence: "93%",
      message:
        "Passenger demand is increasing. Prepare one reserve vehicle near the busiest hotspot.",
    };
  }

  if (waiting > 10) {
    recommendation = {
      level: "High",
      color: "#EF4444",
      confidence: "97%",
      message:
        "Demand spike detected. Dispatch an additional jeepney immediately to reduce passenger waiting time.",
    };
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Brain color="#2563EB" />

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              AI Dispatch Assistant
            </h2>

            <div
              style={{
                color: "#64748B",
                fontSize: 13,
              }}
            >
              Predictive fleet recommendations
            </div>
          </div>
        </div>

        <div
          style={{
            background: recommendation.color,
            color: "white",
            padding: "8px 16px",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {recommendation.level}
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 16,
          background: "#F8FAFC",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 14,
            color: recommendation.color,
            fontWeight: 700,
          }}
        >
          <AlertTriangle size={18} />
          AI Recommendation
        </div>

        <div
          style={{
            lineHeight: 1.6,
            color: "#334155",
          }}
        >
          {recommendation.message}
        </div>

        <button
          style={{
            marginTop: 20,
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Review Dispatch Plan
          <ArrowRight size={16} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginTop: 24,
        }}
      >
        <Metric
          icon={<Bus size={20} />}
          label="Vehicles"
          value={vehicles.length}
        />

        <Metric icon={<Users size={20} />} label="Waiting" value={waiting} />

        <Metric
          icon={<Sparkles size={20} />}
          label="Confidence"
          value={recommendation.confidence}
        />
      </div>
    </div>
  );
}

function Metric({ icon, value, label }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 16,
        padding: 18,
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: 10,
          color: "#2563EB",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: 13,
        }}
      >
        {label}
      </div>
    </div>
  );
}
