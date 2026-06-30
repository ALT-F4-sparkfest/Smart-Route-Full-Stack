// src/pages/OperatorView.jsx

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import FleetMap from "../components/operator/FleetMap";
import VehicleDetailsPanel from "../components/operator/VehicleDetailsPanel";
import AIRecommendationPanel from "../components/operator/AIRecommendationPanel";

import KPICards from "../components/KPICards";
import TravelTimeChart from "../components/TravelTimeChart";

import hotspots from "../data/demandHotspots.json";

import ConnectionStatusPill from "../components/ConnectionStatusPill";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { useDemoSimulation } from "../hooks/useDemoSimulation";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const DEMO_MODE = true;

export default function OperatorView({ onBack }) {
  const [vehicles, setVehicles] = useState({});
  const [waiters, setWaiters] = useState([]);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const socketRef = useRef(null);

  const demo = useDemoSimulation();

  const { status, markUpdated } = useConnectionStatus(connected);

  useEffect(() => {
    if (DEMO_MODE) return;

    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);

      fetch(`${BACKEND_URL}/commuter/waiting/all`)
        .then((r) => r.json())
        .then((d) => setWaiters(d.waiters || []))
        .catch(() => {});
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
    });

    socketRef.current.on("vehicle-update", (vehicle) => {
      setVehicles((prev) => ({
        ...prev,
        [vehicle.id]: vehicle,
      }));

      markUpdated();
    });

    socketRef.current.on("waiting-update", (data) => {
      setWaiters(data.waiters || []);
    });

    socketRef.current.on("bunching-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    fetch(`${BACKEND_URL}/vehicles`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};

        data.forEach((v) => {
          map[v.id || v.vehicle_id] = v;
        });

        setVehicles(map);

        markUpdated();
      });

    return () => socketRef.current?.disconnect();
  }, [markUpdated]);

  const vehicleList = DEMO_MODE ? demo.vehicles : Object.values(vehicles);

  const waitingList = DEMO_MODE ? demo.waiters : waiters;

  const alertList = DEMO_MODE ? demo.alerts : alerts;

  const topHotspots = [...hotspots]
    .sort((a, b) => b.demand_score - a.demand_score)
    .slice(0, 5);

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
              }}
            >
              Fleet Operations
            </h1>

            <span
              style={{
                color: "#64748B",
              }}
            >
              BUSINA Operator Dashboard
            </span>
          </div>
        </div>

        <ConnectionStatusPill status={DEMO_MODE ? "live" : status} inline />
      </div>

      <KPICards />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 420px",
          gap: 24,
          marginTop: 24,
        }}
      >
        {/* LEFT */}

        <div>
          <FleetMap
            vehicles={vehicleList}
            waitingCommuters={waitingList}
            onVehicleSelect={setSelectedVehicle}
          />

          <div
            style={{
              marginTop: 24,
            }}
          >
            <TravelTimeChart />
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <VehicleDetailsPanel vehicle={selectedVehicle} />

          <AIRecommendationPanel
            vehicles={vehicleList}
            waitingCommuters={waitingList}
          />

          <OperationsPanel
            alerts={alertList}
            hotspots={topHotspots}
            vehicles={vehicleList}
            waiting={waitingList}
          />
        </div>
      </div>
    </div>
  );
}

function OperationsPanel({
  alerts = [],
  hotspots = [],
  vehicles = [],
  waiting = [],
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: 24,
        border: "1px solid #E2E8F0",
        boxShadow: "0 15px 35px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
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
        <MiniStat title="Health" value="98%" color="#22C55E" />
      </div>

      <h3>🚨 Live Alerts</h3>

      {alerts.length ? (
        alerts
          .slice(0, 5)
          .map((alert, index) => (
            <AlertRow
              key={index}
              color={
                index === 0 ? "#EF4444" : index === 1 ? "#F59E0B" : "#2563EB"
              }
              text={alert.message}
            />
          ))
      ) : (
        <AlertRow color="#22C55E" text="No operational alerts." />
      )}

      <hr
        style={{
          margin: "24px 0",
          border: 0,
          borderTop: "1px solid #E2E8F0",
        }}
      />

      <h3>📍 Demand Ranking</h3>

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
        <strong style={{ color: "#2563EB" }}>🤖 AI Summary</strong>

        <p
          style={{
            marginTop: 10,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Fleet is operating normally. Current demand can be served using the
          existing active fleet. Continue monitoring passenger growth around the
          highest-ranked hotspot.
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
      <div
        style={{
          color,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#64748B",
        }}
      >
        {title}
      </div>
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
        }}
      />

      <div
        style={{
          color: "#334155",
          lineHeight: 1.5,
        }}
      >
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
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: colors[rank - 1],
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
          <strong>{spot.stop_name}</strong>

          <div
            style={{
              color: "#64748B",
              fontSize: 13,
            }}
          >
            {spot.route_id}
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "right",
        }}
      >
        <strong>{spot.avg_wait_minutes} min</strong>

        <div
          style={{
            color: "#64748B",
            fontSize: 13,
          }}
        >
          Avg Wait
        </div>
      </div>
    </div>
  );
}
