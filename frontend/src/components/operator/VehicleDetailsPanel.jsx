// src/components/operator/VehicleDetailsPanel.jsx

import {
  Bus,
  User,
  Gauge,
  Users,
  Route,
  Clock,
  MapPinned,
  Circle,
} from "lucide-react";

export default function VehicleDetailsPanel({ vehicle }) {
  if (!vehicle) {
    return (
      <div className="dash-section">
        <h2 className="panel-title">Vehicle Details</h2>

        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#64748B",
          }}
        >
          <Bus
            size={42}
            style={{
              marginBottom: 12,
              opacity: 0.35,
            }}
          />

          <p>Select a vehicle from the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 className="panel-title">{vehicle.id}</h2>

          <span
            style={{
              color: "#64748B",
              fontSize: 14,
            }}
          >
            Fleet Vehicle
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#22C55E",
            fontWeight: 600,
          }}
        >
          <Circle size={10} fill="#22C55E" strokeWidth={0} />
          Online
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
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
          value={vehicle.route || "Cubao - Makati"}
        />

        <Row
          icon={<MapPinned size={18} />}
          label="Destination"
          value={vehicle.destination || "Makati Terminal"}
        />

        <Row
          icon={<Clock size={18} />}
          label="ETA"
          value={vehicle.eta || "6 mins"}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginTop: 22,
        }}
      >
        <MiniCard value={`${vehicle.speed || 0}`} label="km/h" />

        <MiniCard value={vehicle.passengers ?? 18} label="Riders" />

        <MiniCard value={vehicle.delay ?? 0} label="Delay" />
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
        paddingBottom: 10,
        borderBottom: "1px solid #E5E7EB",
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

function MiniCard({ value, label }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 12,
        padding: 14,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#64748B",
        }}
      >
        {label}
      </div>
    </div>
  );
}
