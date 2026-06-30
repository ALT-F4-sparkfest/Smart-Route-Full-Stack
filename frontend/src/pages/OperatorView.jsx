// src/pages/OperatorView.jsx
import AIRecommendationPanel from "../components/operator/AIRecommendationPanel";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import FleetMap from "../components/operator/FleetMap";
import VehicleDetailsPanel from "../components/operator/VehicleDetailsPanel";

import KPICards from "../components/KPICards";
import TravelTimeChart from "../components/TravelTimeChart";

import hotspots from "../data/demandHotspots.json";

import { useConnectionStatus } from "../hooks/useConnectionStatus";
import ConnectionStatusPill from "../components/ConnectionStatusPill";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function OperatorView({ onBack }) {
  const [vehicles, setVehicles] = useState({});
  const [waiters, setWaiters] = useState([]);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // NEW
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const socketRef = useRef(null);

  const { status, markUpdated } = useConnectionStatus(connected);

  useEffect(() => {
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
      .then((res) => res.json())
      .then((data) => {
        const map = {};

        data.forEach((vehicle) => {
          map[vehicle.id || vehicle.vehicle_id] = vehicle;
        });

        setVehicles(map);

        markUpdated();
      });

    return () => socketRef.current?.disconnect();
  }, []);

  const vehicleList = Object.values(vehicles);

  const topHotspots = [...hotspots]
    .sort((a, b) => b.demand_score - a.demand_score)
    .slice(0, 5);

  return (
    <div className="operator-mode">
      <div className="operator-topbar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <h1 className="operator-title">Fleet Operations</h1>

        <ConnectionStatusPill status={status} inline />
      </div>

      <KPICards />

      {/* NEW Fleet Map */}
      <FleetMap
        vehicles={vehicleList}
        waitingCommuters={waiters}
        onVehicleSelect={setSelectedVehicle}
      />

      <TravelTimeChart />

      <div className="operator-layout">
        <div className="operator-sidebar">
          {/* NEW Vehicle Details */}
          <VehicleDetailsPanel vehicle={selectedVehicle} />

          <div className="dash-section">
            <h2 className="panel-title">Fleet Overview</h2>

            <div className="stat-cards">
              <div className="stat-card">
                <span className="stat-card-value">{vehicleList.length}</span>

                <span className="stat-card-label">Active Vehicles</span>
              </div>

              <div className="stat-card">
                <span className="stat-card-value">{waiters.length}</span>

                <span className="stat-card-label">Waiting Commuters</span>
              </div>

              <div className="stat-card">
                <span className="stat-card-value">
                  {vehicleList.length
                    ? Math.round(
                        vehicleList.reduce(
                          (sum, vehicle) => sum + (vehicle.speed || 0),
                          0,
                        ) / vehicleList.length,
                      )
                    : 0}
                </span>

                <span className="stat-card-label">Avg Speed</span>
              </div>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="dash-section alert-section">
              <h2 className="panel-title">Alerts</h2>

              {alerts.map((alert, index) => (
                <div key={alert.alert_id || index} className="alert-card">
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          <div className="dash-section">
            <h2 className="panel-title">Demand Hotspots</h2>

            {topHotspots.map((hotspot, index) => (
              <div key={index} className="hotspot-card">
                <div className="hotspot-name">{hotspot.stop_name}</div>

                <div className="hotspot-meta">
                  {hotspot.route_id} · {hotspot.avg_wait_minutes} min
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
