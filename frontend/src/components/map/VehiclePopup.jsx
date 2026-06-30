import { Bus, User, Route, Clock3, Users, Gauge, X } from "lucide-react";

export default function VehiclePopup({ vehicle, onClose }) {
  if (!vehicle) return null;

  const occupancy = Math.min(
    100,
    Math.round(((vehicle.passengers || 18) / 30) * 100),
  );

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

          <div
            style={{
              color: "#64748B",
            }}
          >
            Fleet Vehicle
          </div>
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

      <Info
        icon={<User size={17} />}
        label="Driver"
        value={vehicle.driver || "Juan Dela Cruz"}
      />
      <Info
        icon={<Route size={17} />}
        label="Route"
        value={vehicle.route || "Cubao"}
      />
      <Info
        icon={<Clock3 size={17} />}
        label="ETA"
        value={`${vehicle.eta || 6} mins`}
      />
      <Info
        icon={<Gauge size={17} />}
        label="Speed"
        value={`${vehicle.speed || 32} km/h`}
      />
      <Info
        icon={<Users size={17} />}
        label="Passengers"
        value={vehicle.passengers || 18}
      />

      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          <span>Occupancy</span>
          <span>{occupancy}%</span>
        </div>

        <div
          style={{
            height: 10,
            background: "#E2E8F0",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${occupancy}%`,
              height: "100%",
              background: "linear-gradient(90deg,#2563EB,#60A5FA)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#DCFCE7",
          color: "#15803D",
          padding: "10px 14px",
          borderRadius: 12,
          fontWeight: 700,
        }}
      >
        <Bus size={18} />
        Vehicle Operating Normally
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
