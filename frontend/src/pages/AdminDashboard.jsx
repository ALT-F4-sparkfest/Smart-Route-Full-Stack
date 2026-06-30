// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import LiveMap from "../components/LiveMap";
import KPICards from "../components/KPICards";
import TravelTimeChart from "../components/TravelTimeChart";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState({});
  const [waiters, setWaiters] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
      fetch(`${BACKEND_URL}/commuter/waiting/all`)
        .then((r) => r.json())
        .then((d) => setWaiters(d.waiters || []));
    });

    socketRef.current.on("disconnect", () => setConnected(false));

    socketRef.current.on("vehicle-update", (vehicleData) => {
      setVehicles((prev) => ({
        ...prev,
        [vehicleData.id]: vehicleData,
      }));
    });

    socketRef.current.on("waiting-update", (data) => {
      setWaiters(data.waiters || []);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const vehicleList = Object.values(vehicles);

  return (
    <div className="page-content">
      <KPICards />
      <TravelTimeChart />
      <div className="dashboard-layout">
        <div className="dashboard-map">
          <LiveMap vehicles={vehicles} waiters={waiters} />
        </div>
        <div className="dashboard-sidebar">
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
                  {vehicleList.length > 0
                    ? Math.round(
                        vehicleList.reduce((a, v) => a + v.speed, 0) /
                          vehicleList.length,
                      )
                    : 0}
                </span>
                <span className="stat-card-label">Avg Speed (km/h)</span>
              </div>
            </div>
          </div>

          <div className="dash-section">
            <h2 className="panel-title">Active Vehicles</h2>
            {vehicleList.length === 0 ? (
              <div className="empty-state">No vehicles active</div>
            ) : (
              vehicleList.map((v) => (
                <div key={v.id || v.vehicle_id} className="vehicle-card">
                  <div className="vehicle-header">
                    <span className="vehicle-id">{v.id || v.vehicle_id}</span>
                    <span
                      className={`vehicle-status ${v.status || "on_route"}`}
                    >
                      {v.status || "On Route"}
                    </span>
                  </div>
                  <div className="vehicle-route">{v.route}</div>
                  <div className="vehicle-stats">
                    <div className="stat">
                      <span className="stat-label">Speed</span>
                      <span className="stat-value">{v.speed} km/h</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Lat</span>
                      <span className="stat-value">{v.lat}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Lng</span>
                      <span className="stat-value">{v.lng}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dash-section">
            <h2 className="panel-title">Demand Hotspots</h2>
            {waiters.length === 0 ? (
              <div className="empty-state">No commuters waiting yet</div>
            ) : (
              waiters.map((w, i) => (
                <div key={i} className="waiter-card">
                  <span className="waiter-icon">🧍</span>
                  <div>
                    <div className="waiter-coords">
                      {w.lat?.toFixed(4)}, {w.lng?.toFixed(4)}
                    </div>
                    <div className="waiter-time">{w.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
