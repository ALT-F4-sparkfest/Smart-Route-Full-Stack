// src/components/operator/VehicleDetailsPanel.jsx

import { Bus, User, Gauge, Users, Route, Clock, MapPinned } from "lucide-react";

export default function VehicleDetailsPanel({ vehicle }) {
  if (!vehicle) {
    return (
      <div className="dash-section">
        <h2 className="panel-title">Vehicle Details</h2>

        <p style={{ color: "#64748B" }}>Select a vehicle on the map.</p>
      </div>
    );
  }

  return (
    <div className="dash-section">
      <h2 className="panel-title">{vehicle.id}</h2>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <Row
          icon={<Bus size={18} />}
          label="Status"
          value={vehicle.status || "Online"}
        />

        <Row
          icon={<User size={18} />}
          label="Driver"
          value={vehicle.driver || "Juan Dela Cruz"}
        />

        <Row
          icon={<Gauge size={18} />}
          label="Speed"
          value={`${vehicle.speed || 0} km/h`}
        />

        <Row
          icon={<Users size={18} />}
          label="Passengers"
          value={vehicle.passengers ?? 18}
        />

        <Row
          icon={<Route size={18} />}
          label="Route"
          value={vehicle.route || "Unknown"}
        />

        <Row
          icon={<MapPinned size={18} />}
          label="Destination"
          value={vehicle.destination || "Terminal"}
        />

        <Row icon={<Clock size={18} />} label="ETA" value="6 mins" />
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        {icon}
        <strong>{label}</strong>
      </div>

      <span>{value}</span>
    </div>
  );
}
