import { useState, useEffect, useRef } from "react";
import LiveMap from "./components/LiveMap";
import VehicleList from "./components/VehicleList";
import "./App.css";

export default function App() {
  const [vehicles, setVehicles] = useState({});
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => {
      console.log("Connected to SmartRoute backend");
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "vehicle_update") {
        setVehicles((prev) => ({
          ...prev,
          [msg.data.vehicle_id]: msg.data,
        }));
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected");
      setConnected(false);
    };

    return () => ws.current.close();
  }, []);

  const vehicleCount = Object.keys(vehicles).length;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">🚌</span>
          <div>
            <h1 className="title">SmartRoute PH</h1>
            <span className="subtitle">Live PUV Tracking</span>
          </div>
        </div>
        <div className="header-right">
          <div className={`status-badge ${connected ? "online" : "offline"}`}>
            <span className="status-dot"></span>
            {connected ? "Live" : "Offline"}
          </div>
          <div className="vehicle-count">
            {vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""} active
          </div>
        </div>
      </header>
      <div className="content">
        <LiveMap vehicles={vehicles} />
        <VehicleList vehicles={vehicles} />
      </div>
    </div>
  );
}
