// src/pages/CommuterView.jsx
import { useState, useEffect } from "react";
import LiveMap from "../components/LiveMap";

export default function CommuterView() {
  const [vehicles, setVehicles] = useState({});
  const [isWaiting, setIsWaiting] = useState(false);

  // Simulate vehicle data (replace with WebSocket later)
  useEffect(() => {
    // For now, use mock data if no vehicles
    const mockVehicles = {
      "PUV-001": {
        vehicle_id: "PUV-001",
        lat: 14.567214,
        lng: 121.029426,
        speed: 21.8,
        route: "Cubao - Quiapo",
        status: "on_route",
      },
    };
    setVehicles(mockVehicles);
  }, []);

  const vehicleList = Object.values(vehicles);

  const handleWaiting = () => {
    setIsWaiting(!isWaiting);
    // In real app, send to backend
  };

  return (
    <div className="commuter-view">
      {/* Map */}
      <div className="commuter-map">
        <LiveMap vehicles={vehicles} />
      </div>

      {/* Status Bar */}
      <div className="commuter-status">
        <span className="vehicle-count">
          {vehicleList.length} vehicle(s) active
        </span>
        <button
          className={`waiting-btn ${isWaiting ? "active" : ""}`}
          onClick={handleWaiting}
        >
          {isWaiting ? "🟢 Waiting..." : "🟡 I'm Waiting for a Jeep"}
        </button>
      </div>

      {/* Vehicle List (compact) */}
      <div className="commuter-list">
        {vehicleList.length === 0 ? (
          <p className="empty-state">No vehicles nearby</p>
        ) : (
          vehicleList.map((v) => (
            <div key={v.vehicle_id} className="vehicle-item">
              <span className="vehicle-icon">🚌</span>
              <div className="vehicle-info">
                <div className="vehicle-id">{v.vehicle_id}</div>
                <div className="vehicle-route">{v.route}</div>
              </div>
              <div className="vehicle-speed">{v.speed} km/h</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
