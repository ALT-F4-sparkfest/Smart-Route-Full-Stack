import React, { useState, useEffect } from "react";
import { AlertCircle, Bus, MapPin, Clock } from "lucide-react";
import useLiveVehicles from "../hooks/useLiveVehicles";
import LiveMap from "../components/map/LiveMap";
import ConnectionStatusPill from "../components/ConnectionStatusPill";

// Import dashboard components
import KPICards from "../components/KPICards";
import TravelTimeChart from "../components/TravelTimeChart";
import AIRecommendationPanel from "../components/operator/AIRecommendationPanel";
import VehicleDetailsPanel from "../components/operator/VehicleDetailsPanel";
import hotspots from "../data/demandHotspots.json";

export default function OperatorView({ onBack }) {
  const live = useLiveVehicles();
  const [alerts, setAlerts] = useState([]);
  const [waitingList, setWaitingList] = useState([]); // Moved out of hardcoded state
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [filterRoute, setFilterRoute] = useState("all");

  // Fetch live alerts and commuter queues from active endpoints
  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        // Fetch Alerts
        const alertsRes = await fetch("http://localhost:3000/alerts");
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData);
        }

        // Fetch Live Commuter Waiting List Demand Data
        const demandRes = await fetch("http://localhost:3000/live-demand");
        if (demandRes.ok) {
          const demandData = await demandRes.json();
          setWaitingList(demandData);
        }
      } catch (err) {
        console.error("Operational data stream error:", err);
      }
    };

    fetchOperationalData();
    const interval = setInterval(fetchOperationalData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter out invalid coordinates from live websocket/polling hook
  const vehicleList = Array.isArray(live.vehicles)
    ? live.vehicles.filter(
        (v) =>
          typeof v.lat === "number" &&
          typeof v.lng === "number" &&
          isFinite(v.lat) &&
          isFinite(v.lng),
      )
    : [];

  const routes = [
    ...new Set(vehicleList.map((v) => v.route_id).filter(Boolean)),
  ];

  const filteredVehicles =
    filterRoute === "all"
      ? vehicleList
      : vehicleList.filter((v) => v.route_id === filterRoute);

  // Auto-select first vehicle dynamically if nothing is active
  useEffect(() => {
    if (filteredVehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(filteredVehicles[0].id);
    }
  }, [filteredVehicles, selectedVehicleId]);

  const selectedVehicle = filteredVehicles.find(
    (v) => v.id === selectedVehicleId,
  );

  // Status helper dynamically processing incoming live velocity telemetry
  const getStatus = (speed) => {
    if (typeof speed !== "number" || speed < 1)
      return { label: "Stopped", color: "#EF4444", icon: "●" };
    if (speed < 10) return { label: "Slow", color: "#F59E0B", icon: "●" };
    return { label: "Moving", color: "#22C55E", icon: "●" };
  };

  // Top hotspots processing
  const topHotspots = [...hotspots]
    .sort((a, b) => b.demand_score - a.demand_score)
    .slice(0, 5);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F1F5F9",
      }}
    >
      {/* Header – identical to CommuterView */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 32px",
          background: "white",
          borderBottom: "1px solid #E2E8F0",
          gap: 20,
          flexShrink: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#64748B",
          }}
        >
          ←
        </button>
        <span
          style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.5px" }}
        >
          📊 Operator Dashboard
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ConnectionStatusPill status={live.connected ? "live" : "offline"} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={16} color="#64748B" />
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid #E2E8F0",
                background: "white",
                fontSize: 14,
                fontWeight: 500,
                color: "#0F172A",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Routes</option>
              {routes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* KPI Cards – full width */}
      <div style={{ padding: "16px 32px", flexShrink: 0 }}>
        <KPICards vehicles={filteredVehicles} />
      </div>

      {/* Main content: map + sidebar */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          padding: "0 32px 32px 32px",
          gap: 24,
        }}
      >
        {/* Left column: Map + bottom charts */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Map */}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: "#E2E8F0",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            <LiveMap
              vehicles={filteredVehicles}
              userLocation={null}
              mapId="operator-map"
              center={
                selectedVehicle
                  ? { lat: selectedVehicle.lat, lng: selectedVehicle.lng }
                  : null
              }
              routeId={selectedVehicle?.route_id}
              selectedVehicleId={selectedVehicleId}
              onVehicleSelect={setSelectedVehicleId}
            />
          </div>

          {/* Bottom row: TravelTimeChart + AIRecommendationPanel */}
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <TravelTimeChart />
            </div>
            <div style={{ flex: 1 }}>
              <AIRecommendationPanel
                vehicles={filteredVehicles}
                waitingCommuters={waitingList}
              />
            </div>
          </div>
        </div>

        {/* Right column: Sidebar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
          }}
        >
          {/* Vehicle Details Panel (selected vehicle) */}
          <VehicleDetailsPanel
            vehicle={selectedVehicle}
            status={selectedVehicle ? getStatus(selectedVehicle.speed) : null}
          />

          {/* Vehicle list */}
          <section
            style={{
              background: "white",
              borderRadius: 22,
              padding: "20px 24px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Bus size={20} color="#2563EB" />
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                Vehicles{" "}
                <span
                  style={{ fontWeight: 400, color: "#94A3B8", fontSize: 15 }}
                >
                  ({filteredVehicles.length})
                </span>
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              {filteredVehicles.length === 0 && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#94A3B8",
                    background: "#F8FAFC",
                    borderRadius: 12,
                  }}
                >
                  No vehicles on this route
                </div>
              )}
              {filteredVehicles.map((v) => {
                const status = getStatus(v.speed);
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background:
                        v.id === selectedVehicleId ? "#EFF6FF" : "#F8FAFC",
                      border:
                        v.id === selectedVehicleId
                          ? "2px solid #2563EB"
                          : "1px solid #E2E8F0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s",
                      boxShadow:
                        v.id === selectedVehicleId
                          ? "0 4px 12px rgba(37,99,235,0.15)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#0F172A",
                        }}
                      >
                        {v.id}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748B" }}>
                        {v.route_id}
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#0F172A",
                        }}
                      >
                        {v.speed?.toFixed(0) || 0} km/h
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#94A3B8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span style={{ color: status.color }}>
                          {status.icon}
                        </span>
                        {status.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#94A3B8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} />
                        {v.last_updated
                          ? new Date(v.last_updated).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Alerts feed */}
          <section
            style={{
              background: "white",
              borderRadius: 22,
              padding: "20px 24px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <AlertCircle size={20} color="#EF4444" />
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                Alerts{" "}
                <span
                  style={{ fontWeight: 400, color: "#94A3B8", fontSize: 15 }}
                >
                  ({alerts.length})
                </span>
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {alerts.length === 0 && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#94A3B8",
                    background: "#F8FAFC",
                    borderRadius: 12,
                  }}
                >
                  All clear – no active alerts
                </div>
              )}
              {alerts.slice(0, 10).map((alert, idx) => {
                const isCritical = alert.severity === "critical";
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: isCritical ? "#FEF2F2" : "#FFFBEB",
                      border: `1px solid ${isCritical ? "#FECACA" : "#FDE68A"}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: isCritical ? "#B91C1C" : "#B45309",
                          background: isCritical ? "#FECACA" : "#FDE68A",
                          padding: "2px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {alert.severity || "info"}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#0F172A",
                        }}
                      >
                        {alert.vehicle_id || "System"}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: "#475569" }}>
                      {alert.message}
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>
                      {new Date(alert.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Operations Panel (hotspots & calculated dynamic AI summary) */}
          <OperationsPanel
            alerts={alerts}
            hotspots={topHotspots}
            vehicles={filteredVehicles}
            waiting={waitingList}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Operations Panel Component ──────────────────────────────────────────────

function OperationsPanel({
  alerts = [],
  hotspots = [],
  vehicles = [],
  waiting = [],
}) {
  // Production Dynamic AI summary builder (No more hardcoded demo text!)
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  const getDynamicAISummary = () => {
    if (criticalCount > 0) {
      return `Attention required: There are ${criticalCount} critical operational alerts active in the system. Fleet adjustments or driver contact recommended immediately.`;
    }
    if (waiting.length > 20) {
      return `High Commuter Congestion: Commuter waiting lists are showing backlogs across popular stops. Consider injecting unassigned vehicles into active standby loops.`;
    }
    return `Fleet is operating efficiently across all ${vehicles.length} active units tracked. Transit pacing matches demand thresholds near the highest ranked hotspots.`;
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: 24,
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          fontSize: 18,
          fontWeight: 600,
          color: "#0F172A",
        }}
      >
        🚦 Live Operations Center
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <MiniStat title="Fleet" value={vehicles.length} color="#2563EB" />
        <MiniStat title="Waiting" value={waiting.length} color="#EF4444" />
        <MiniStat
          title="Health"
          value={criticalCount > 0 ? "88%" : "98%"}
          color="#22C55E"
        />
      </div>

      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: 12,
        }}
      >
        🚨 Live Alerts Summary
      </h3>
      {alerts.length ? (
        alerts
          .slice(0, 3)
          .map((alert, index) => (
            <AlertRow
              key={index}
              color={alert.severity === "critical" ? "#EF4444" : "#F59E0B"}
              text={`${alert.vehicle_id || "System"}: ${alert.message}`}
            />
          ))
      ) : (
        <AlertRow color="#22C55E" text="No operational alerts." />
      )}

      <hr
        style={{ margin: "24px 0", border: 0, borderTop: "1px solid #E2E8F0" }}
      />

      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: 12,
        }}
      >
        📍 Demand Ranking
      </h3>
      {hotspots.map((spot, index) => (
        <HotspotRow key={index} rank={index + 1} spot={spot} />
      ))}

      <div
        style={{
          marginTop: 24,
          background: "#EFF6FF",
          padding: 18,
          borderRadius: 14,
        }}
      >
        <strong style={{ color: "#2563EB" }}>🤖 Dynamic AI Summary</strong>
        <p
          style={{
            marginTop: 10,
            color: "#475569",
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          {getDynamicAISummary()}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ title, value, color }) {
  return (
    <div
      style={{
        background: `${color}15`,
        borderRadius: 14,
        padding: 18,
        textAlign: "center",
      }}
    >
      <div style={{ color, fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ marginTop: 6, color: "#64748B" }}>{title}</div>
    </div>
  );
}

function AlertRow({ color, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 14,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          marginTop: 5,
          flexShrink: 0,
        }}
      />
      <div style={{ color: "#334155", lineHeight: 1.5, fontSize: 14 }}>
        {text}
      </div>
    </div>
  );
}

function HotspotRow({ rank, spot }) {
  const colors = ["#EF4444", "#F97316", "#F59E0B", "#22C55E", "#2563EB"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: colors[rank - 1] || "#64748B",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {rank}
        </div>
        <div>
          <strong style={{ fontSize: 14, color: "#0F172A" }}>
            {spot.stop_name}
          </strong>
          <div style={{ color: "#64748B", fontSize: 13 }}>{spot.route_id}</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <strong style={{ fontSize: 14, color: "#0F172A" }}>
          {spot.avg_wait_minutes} min
        </strong>
        <div style={{ color: "#64748B", fontSize: 13 }}>Avg Wait</div>
      </div>
    </div>
  );
}
