import { useState, useEffect, useRef } from "react";
import LiveMap from "../components/LiveMap";
import VehicleList from "../components/VehicleList";

export default function CommuterView() {
  const [vehicles, setVehicles] = useState({});
  const [connected, setConnected] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [reportSent, setReportSent] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");
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
    return () => ws.current.close();
  }, []);

  const reportWaiting = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetch("http://localhost:8000/commuter/waiting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      });
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
      <div className="content">
        <LiveMap vehicles={vehicles} />
        <VehicleList vehicles={vehicles} />
      </div>
    </div>
  );
}
