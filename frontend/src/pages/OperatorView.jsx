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

        <ConnectionStatusPill
          status={DEMO_MODE ? "connected" : status}
          inline
        />
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

          {alertList.length > 0 && (
            <div className="dash-section">
              <h2 className="panel-title">Alerts</h2>

              {alertList.map((alert, index) => (
                <div key={alert.id || index} className="alert-card">
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          <div className="dash-section">
            <h2 className="panel-title">Demand Hotspots</h2>

            {topHotspots.map((spot, index) => (
              <div key={index} className="hotspot-card">
                <div className="hotspot-name">{spot.stop_name}</div>

                <div className="hotspot-meta">
                  {spot.route_id} • {spot.avg_wait_minutes} mins
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
