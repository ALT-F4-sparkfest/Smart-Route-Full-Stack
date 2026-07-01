// src/components/commuter/BottomSheet.jsx
import { Bus, Clock3, Users, Zap } from "lucide-react";

const STATUS_COLOR = {
  "On Route": "#22C55E",
  Delayed: "#F59E0B",
  Stopped: "#94A3B8",
  "Off Route": "#EF4444",
};

export default function BottomSheet({
  nearest = [],
  eta,
  waiting,
  onWait,
  onSelectVehicle,
  selectedVehicleId,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        background: "rgba(255,255,255,.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: "0 -12px 40px rgba(15,23,42,.12)",
        padding: "14px 18px 28px",
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: "#CBD5E1",
          margin: "0 auto 14px",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
            {nearest.length} vehicle{nearest.length !== 1 ? "s" : ""} nearby
          </div>
          {eta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#64748B",
                fontSize: 12,
                marginTop: 3,
              }}
            >
              <Clock3 size={13} />
              ETA to{" "}
              <strong style={{ color: "#0F172A" }}>
                {eta.destination}
              </strong>: {eta.eta_minutes} min
            </div>
          )}
        </div>

        {/* I'm Waiting button */}
        <button
          onClick={onWait}
          style={{
            border: "none",
            padding: "10px 18px",
            borderRadius: 14,
            background: waiting
              ? "linear-gradient(135deg,#16A34A,#15803D)"
              : "linear-gradient(135deg,#2563EB,#1D4ED8)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            boxShadow: waiting
              ? "0 4px 14px rgba(22,163,74,0.4)"
              : "0 4px 14px rgba(37,99,235,0.35)",
            transition: "all 0.2s",
          }}
        >
          <Bus size={15} />
          {waiting ? "✓ Waiting..." : "I'm Waiting"}
        </button>
      </div>

      {/* Vehicle cards */}
      {nearest.length > 0 ? (
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {nearest.slice(0, 6).map((v) => {
            const isSelected = v.id === selectedVehicleId;
            const statusColor = STATUS_COLOR[v.status] ?? "#64748B";
            const [cur, cap] = (v.passengers ?? "0/32")
              .split("/")
              .map((s) => parseInt(s.trim(), 10));
            const pct =
              isNaN(cur) || isNaN(cap) ? 0 : Math.round((cur / cap) * 100);

            return (
              <div
                key={v.id}
                onClick={() => onSelectVehicle?.(v.id)}
                style={{
                  minWidth: 140,
                  background: isSelected ? "#EFF6FF" : "#F8FAFC",
                  border: `1.5px solid ${isSelected ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: 16,
                  padding: "12px 14px",
                  flexShrink: 0,
                  cursor: "pointer",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(37,99,235,0.15)"
                    : "none",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}
                  >
                    {v.id}
                  </div>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColor,
                      display: "inline-block",
                      marginTop: 3,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                  {v.route_id ?? v.route ?? "—"}
                </div>

                {/* Occupancy bar */}
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: "#94A3B8",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Users size={10} /> Load
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color:
                          pct >= 90
                            ? "#EF4444"
                            : pct >= 60
                              ? "#F59E0B"
                              : "#22C55E",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: "#E2E8F0",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 2,
                        background:
                          pct >= 90
                            ? "#EF4444"
                            : pct >= 60
                              ? "#F59E0B"
                              : "#22C55E",
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#64748B",
                  }}
                >
                  <span>
                    <Zap size={10} style={{ display: "inline" }} />{" "}
                    {Math.round(v.speed ?? 0)} km/h
                  </span>
                  <span>📍 {v.dist?.toFixed(1) ?? "?"} km</span>
                </div>

                {v.eta != null && (
                  <div
                    style={{
                      marginTop: 6,
                      textAlign: "center",
                      background: isSelected ? "#DBEAFE" : "#EFF6FF",
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563EB",
                    }}
                  >
                    ETA {v.eta} min
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#94A3B8",
            background: "#F8FAFC",
            borderRadius: 14,
            fontSize: 13,
          }}
        >
          No vehicles nearby right now
        </div>
      )}
    </div>
  );
}
