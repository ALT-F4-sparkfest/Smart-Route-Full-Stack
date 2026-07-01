import { Bus, Route, Clock3, Gauge, Navigation, MapPin, X } from "lucide-react";

export default function VehiclePopup({ vehicle, onClose }) {
  if (!vehicle) return null;

  const lastSeen = vehicle.last_updated
    ? new Date(vehicle.last_updated).toLocaleTimeString()
    : "Unknown";

  return (
    <div
      style={{
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 22,
        padding: 24,
        border: "1px solid #E2E8F0",
        boxShadow: "0 20px 50px rgba(15,23,42,.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {vehicle.id}
          </div>

          <div style={{ color: "#64748B" }}>Live Vehicle</div>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "#F1F5F9",
            width: 38,
            height: 38,
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      <Info icon={<Route size={17} />} label="Route" value={vehicle.route_id} />

      <Info
        icon={<Gauge size={17} />}
        label="Speed"
        value={`${Math.round(vehicle.speed ?? 0)} km/h`}
      />

      <Info
        icon={<Navigation size={17} />}
        label="Heading"
        value={`${vehicle.heading ?? 0}°`}
      />

      <Info
        icon={<MapPin size={17} />}
        label="On Route"
        value={vehicle.on_route ? "Yes" : "No"}
      />

      <Info icon={<Clock3 size={17} />} label="Last Update" value={lastSeen} />

      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: vehicle.on_route ? "#DCFCE7" : "#FEE2E2",
          color: vehicle.on_route ? "#15803D" : "#DC2626",
          padding: "10px 14px",
          borderRadius: 12,
          fontWeight: 700,
        }}
      >
        <Bus size={18} />

        {vehicle.on_route ? "Vehicle Operating Normally" : "Vehicle Off Route"}
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          color: "#475569",
          fontWeight: 600,
        }}
      >
        {icon}
        {label}
      </div>

      <div
        style={{
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value}
      </div>
    </div>
  );
}
