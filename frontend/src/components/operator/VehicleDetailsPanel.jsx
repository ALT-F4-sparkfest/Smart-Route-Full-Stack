// src/components/operator/VehicleDetailsPanel.jsx

import { Bus, User, Gauge, Users, Route, Clock, MapPinned } from "lucide-react";

export default function VehicleDetailsPanel({ vehicle }) {
  if (!vehicle) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 10px 30px rgba(15,23,42,.08)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 20,
            fontSize: 20,
            color: "#0F172A",
          }}
        >
          Vehicle Details
        </h2>

        <div
          style={{
            height: 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#94A3B8",
          }}
        >
          <Bus size={54} />

          <p
            style={{
              marginTop: 16,
              fontSize: 15,
            }}
          >
            Select a vehicle on the map
          </p>
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
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            {vehicle.id}
          </div>

          <div
            style={{
              color: "#64748B",
              marginTop: 4,
            }}
          >
            Fleet Vehicle
          </div>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            color: "#15803D",
            padding: "8px 16px",
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          ● Online
        </div>
      </div>

      <Info
        icon={<User size={18} />}
        label="Driver"
        value={vehicle.driver || "Juan Dela Cruz"}
      />

      <Info
        icon={<Route size={18} />}
        label="Route"
        value={vehicle.route || "Cubao - Makati"}
      />

      <Info
        icon={<Gauge size={18} />}
        label="Speed"
        value={`${vehicle.speed || 0} km/h`}
      />

      <Info
        icon={<Users size={18} />}
        label="Passengers"
        value={vehicle.passengers ?? 18}
      />

      <Info
        icon={<Clock size={18} />}
        label="ETA"
        value={vehicle.eta || "5 min"}
      />

      <Info
        icon={<MapPinned size={18} />}
        label="Destination"
        value={vehicle.destination || "Terminal"}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginTop: 24,
        }}
      >
        <MiniCard value={vehicle.speed || 0} label="km/h" color="#DBEAFE" />

        <MiniCard
          value={vehicle.passengers ?? 18}
          label="Riders"
          color="#DCFCE7"
        />

        <MiniCard value={vehicle.delay ?? 0} label="Delay" color="#FEF3C7" />
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
        padding: "14px 0",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
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
          fontWeight: 600,
          color: "#0F172A",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniCard({ value, label, color }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 14,
        padding: 18,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#475569",
          fontSize: 13,
        }}
      >
        {label}
      </div>
    </div>
  );
}
