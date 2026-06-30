import { Brain, AlertTriangle, Bus } from "lucide-react";
import { useDemoSimulation } from "../../hooks/useDemoSimulation";

export default function AIRecommendationPanel() {
  const { waiters, vehicles } = useDemoSimulation();

  const hotspot = [...waiters].sort((a, b) => b.waiting - a.waiting)[0];

  const vehicle = [...vehicles]
    .filter((v) => v.status !== "Delayed")
    .sort((a, b) => a.eta - b.eta)[0];

  if (!hotspot || !vehicle) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 24,
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Brain color="#2563EB" />
        <h2 style={{ margin: 0 }}>AI Recommendation</h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          color: "#DC2626",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        <AlertTriangle size={18} />
        High demand detected
      </div>

      <p>
        <strong>{hotspot.name}</strong>
      </p>

      <p>{hotspot.waiting} commuters waiting.</p>

      <hr style={{ margin: "18px 0" }} />

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Bus color="#2563EB" />
        Dispatch <strong>{vehicle.id}</strong> ({vehicle.route})
      </div>

      <div
        style={{
          marginTop: 18,
          display: "inline-block",
          padding: "8px 14px",
          borderRadius: 999,
          background: "#DBEAFE",
          color: "#1D4ED8",
          fontWeight: 700,
        }}
      >
        Confidence 93%
      </div>
    </div>
  );
}
