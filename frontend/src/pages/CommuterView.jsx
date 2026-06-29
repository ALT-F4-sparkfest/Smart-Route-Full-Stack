import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import LiveMap from "../components/LiveMap";
import VehicleList from "../components/VehicleList";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const WS_URL = BACKEND_URL.replace("https", "wss").replace("http", "ws");

export default function CommuterView() {
  const [vehicles, setVehicles] = useState({});
  const [connected, setConnected] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [reportSent, setReportSent] = useState(false);
  const [eta, setEta] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_URL}/ws`);
    ws.current.onopen = () => setConnected(true);
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "vehicle_update") {
        setVehicles((prev) => ({
          ...prev,
          [msg.data.vehicle_id]: msg.data,
        }));
      }
      if (msg.type === "waiting_update") {
        setWaitingCount(msg.total);
      }
    };
    ws.current.onclose = () => setConnected(false);

    const vehiclesRef = ref(db, "vehicles");
    onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setVehicles(data);
    });

    return () => ws.current.close();
  }, []);

  const fetchEta = (lat, lng) => {
    fetch(`${BACKEND_URL}/eta?lat=${lat}&lng=${lng}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.eta !== null) setEta(d);
      });
  };

  const reportWaiting = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      fetch(`${BACKEND_URL}/commuter/waiting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, lng: longitude }),
      });

      fetchEta(latitude, longitude);
      setReportSent(true);
      setTimeout(() => setReportSent(false), 3000);
    });
  };

  return (
    <div className="page-content">
      <div className="commuter-bar">
        <div className="commuter-status">
          <div className={`status-badge ${connected ? "online" : "offline"}`}>
            <span className="status-dot"></span>
            {connected ? "Live" : "Offline"}
          </div>
          <span className="vehicle-count">
            {Object.keys(vehicles).length} vehicle(s) active
          </span>
          {waitingCount > 0 && (
            <span className="waiting-count">
              🧍 {waitingCount} waiting nearby
            </span>
          )}
        </div>
        <button
          className={`waiting-btn ${reportSent ? "sent" : ""}`}
          onClick={reportWaiting}
        >
          {reportSent ? "✓ Reported!" : "🙋 I'm Waiting for a Jeep"}
        </button>
      </div>

      {eta && (
        <div className="eta-banner">
          <div className="eta-main">
            <span className="eta-icon">🚌</span>
            <div>
              <div className="eta-time">{eta.eta} mins away</div>
              <div className="eta-route">
                {eta.nearest.route} · {eta.nearest.speed} km/h
              </div>
            </div>
          </div>
          <div className="eta-vehicle">{eta.nearest.vehicle_id}</div>
        </div>
      )}

      <div className="content">
        <LiveMap vehicles={vehicles} />
        <VehicleList vehicles={vehicles} />
      </div>
    </div>
  );
}
