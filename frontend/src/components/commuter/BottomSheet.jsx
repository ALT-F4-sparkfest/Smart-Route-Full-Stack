// src/components/commuter/BottomSheet.jsx
import { Bus, Clock3 } from "lucide-react";

export default function BottomSheet({ nearest = [], eta, waiting, onWait }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: "0 -12px 40px rgba(15,23,42,.15)",
        padding: "18px 20px 28px",
      }}
    >
      <div
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: "#CBD5E1",
          margin: "0 auto 16px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {nearest.length} vehicle{nearest.length !== 1 ? "s" : ""} nearby
          </div>
          {eta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#64748B",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              <Clock3 size={14} />
              ETA to {eta.destination}: {eta.eta_minutes} min
            </div>
          )}
        </div>

        <button
          onClick={onWait}
          style={{
            border: "none",
            padding: "12px 20px",
            borderRadius: 16,
            background: waiting ? "#16A34A" : "#2563EB",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Bus size={16} />
          {waiting ? "Waiting..." : "I'm Waiting"}
        </button>
      </div>

      {nearest.length > 0 && (
        <div
          style={{ display: "flex", gap: 10, marginTop: 16, overflowX: "auto" }}
        >
          {nearest.slice(0, 5).map((v) => (
            <div
              key={v.id}
              style={{
                minWidth: 120,
                background: "#F1F5F9",
                borderRadius: 14,
                padding: "10px 12px",
                flexShrink: 0,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13 }}>{v.id}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                {v.route_id || "—"}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                {Math.round(v.speed ?? 0)} km/h · {v.dist?.toFixed(1) ?? "?"} km
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
