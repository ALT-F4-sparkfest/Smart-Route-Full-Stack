import {
  Brain,
  Sparkles,
  Bus,
  Users,
  MapPinned,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function AIRecommendationPanel({
  vehicles = [],
  waitingCommuters = [],
}) {
  const waiting = waitingCommuters.length;

  const hotspot =
    waiting > 0
      ? waitingCommuters.reduce((acc, person) => {
          const stop =
            person.stop ||
            person.stop_name ||
            person.location ||
            "Cubao Terminal";

          acc[stop] = (acc[stop] || 0) + 1;
          return acc;
        }, {})
      : {};

  const busiestStop = Object.entries(hotspot).sort(
    (a, b) => b[1] - a[1],
  )[0] || ["Cubao Terminal", waiting];

  const suggestedVehicle =
    vehicles.length > 0
      ? vehicles.reduce((best, current) =>
          (current.passengers || 0) < (best.passengers || 0) ? current : best,
        )
      : null;

  let level = "Normal";
  let color = "#22C55E";
  let confidence = 98;
  let recommendation =
    "Fleet distribution is healthy. Continue monitoring demand.";

  if (waiting >= 5) {
    level = "Medium";
    color = "#F59E0B";
    confidence = 94;
    recommendation = "Demand is increasing. Prepare one reserve vehicle.";
  }

  if (waiting >= 10) {
    level = "High";
    color = "#EF4444";
    confidence = 97;
    recommendation =
      "Dispatch another jeepney immediately to reduce passenger waiting time.";
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 26,
        border: "1px solid #E2E8F0",
        boxShadow: "0 15px 40px rgba(15,23,42,.08)",
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
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: "#DBEAFE",
              color: "#2563EB",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Brain size={28} />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0F172A",
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
              Real-time operational insights
            </div>
          </div>
        </div>

        <div
          style={{
            background: color,
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {level}
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          background: "#F8FAFC",
          borderRadius: 18,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            color,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          <AlertTriangle size={18} />
          Recommendation
        </div>

        <div
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "#334155",
          }}
        >
          {recommendation}
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
          }}
        >
          <Info
            icon={<MapPinned size={18} />}
            title="Highest Demand"
            value={busiestStop[0]}
          />

          <Info
            icon={<Users size={18} />}
            title="Waiting"
            value={`${busiestStop[1]} commuters`}
          />

          <Info
            icon={<Bus size={18} />}
            title="Dispatch"
            value={suggestedVehicle?.id || "Vehicle #05"}
          />

          <Info
            icon={<Sparkles size={18} />}
            title="Confidence"
            value={`${confidence}%`}
          />
        </div>

        {/* ✅ Only change: added onClick to this button */}
        <button
          onClick={() => alert("Feature coming in a future update")}
          style={{
            width: "100%",
            marginTop: 24,
            border: "none",
            borderRadius: 16,
            background: "#2563EB",
            color: "white",
            padding: "15px",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          Execute Dispatch Recommendation
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Info({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          color: "#64748B",
          marginBottom: 10,
          fontSize: 13,
        }}
      >
        {icon}
        {title}
      </div>

      <div
        style={{
          fontWeight: 700,
          color: "#0F172A",
          fontSize: 18,
        }}
      >
        {value}
      </div>
    </div>
  );
}
