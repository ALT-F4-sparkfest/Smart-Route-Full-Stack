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
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 8px 24px rgba(15,23,42,.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Vehicle Details
        </h2>

        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          <Bus
            size={54}
            style={{
              marginBottom: 16,
              opacity: 0.3,
            }}
          />

          <h3>Select a Vehicle</h3>

          <p>Click any jeepney on the map to inspect its live information.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 8px 24px rgba(15,23,42,.08)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {vehicle.plate || vehicle.id}
          </div>

          <div
            style={{
              color: "#64748B",
              marginTop: 4,
            }}
          >
            {vehicle.route}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#22C55E",
            fontWeight: 600,
          }}
        >
          <Circle size={10} fill="#22C55E" strokeWidth={0} />
          Online
        </div>
      </div>

      {/* DETAILS */}

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <Row
          icon={<Bus size={18} />}
          label="Status"
          value={vehicle.status || "On Route"}
        />

        <Row
          icon={<User size={18} />}
          label="Driver"
          value={vehicle.driver || "Unknown"}
        />

        <Row
          icon={<Gauge size={18} />}
          label="Speed"
          value={`${vehicle.speed || 0} km/h`}
        />

        <Row
          icon={<Users size={18} />}
          label="Passengers"
          value={vehicle.passengers || "0 / 32"}
        />

        <Row icon={<Route size={18} />} label="Route" value={vehicle.route} />

        <Row
          icon={<MapPinned size={18} />}
          label="Destination"
          value={vehicle.destination}
        />

        <Row
          icon={<Clock size={18} />}
          label="ETA"
          value={`${vehicle.eta || 0} mins`}
        />
      </div>

      {/* QUICK METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginTop: 24,
        }}
      >
        <MiniCard value={vehicle.speed || 0} label="km/h" />

        <MiniCard value={vehicle.passengers || "0"} label="Occupancy" />

        <MiniCard value={vehicle.eta || 0} label="ETA" />
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
        paddingBottom: 12,
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          color: "#334155",
        }}
      >
        {icon}

        <span
          style={{
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          color: "#0F172A",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function MiniCard({ value, label }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 16,
        padding: 18,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#64748B",
        }}
      >
        {label}
      </div>
    </div>
  );
}
