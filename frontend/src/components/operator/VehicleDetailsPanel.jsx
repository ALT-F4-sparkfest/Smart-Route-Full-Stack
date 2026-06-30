import {
  Bus,
  User,
  Gauge,
  Users,
  Route,
  Clock3,
  MapPinned,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function VehicleDetailsPanel({ vehicle }) {
  if (!vehicle) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 30,
          border: "1px solid #E2E8F0",
          boxShadow: "0 16px 40px rgba(15,23,42,.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 28,
            color: "#0F172A",
          }}
        >
          Vehicle Details
        </h2>

        <div
          style={{
            height: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#94A3B8",
          }}
        >
          <Bus size={64} />

          <h3
            style={{
              marginTop: 22,
              marginBottom: 8,
            }}
          >
            No Vehicle Selected
          </h3>

          <p>Select a vehicle from the live map.</p>
        </div>
      </div>
    );
  }

  const passengers = vehicle.passengers ?? 18;
  const capacity = vehicle.capacity ?? 30;

  const occupancy = Math.min(Math.round((passengers / capacity) * 100), 100);

  const delayed = (vehicle.delay ?? 0) > 5;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 28,
        border: "1px solid #E2E8F0",
        boxShadow: "0 16px 40px rgba(15,23,42,.08)",
      }}
    >
      {/* HEADER */}

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
            gap: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2563EB,#60A5FA)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {vehicle.driver?.charAt(0) || "J"}
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0F172A",
              }}
            >
              {vehicle.id}
            </h2>

            <div
              style={{
                marginTop: 6,
                color: "#64748B",
              }}
            >
              {vehicle.driver || "Juan Dela Cruz"}
            </div>
          </div>
        </div>

        <div
          style={{
            background: delayed ? "#FEF2F2" : "#DCFCE7",
            color: delayed ? "#DC2626" : "#15803D",
            padding: "10px 16px",
            borderRadius: 999,
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {delayed ? (
            <>
              <AlertTriangle size={16} />
              Delayed
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Online
            </>
          )}
        </div>
      </div>

      {/* OCCUPANCY */}

      <div
        style={{
          marginTop: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <strong>Occupancy</strong>

          <span>{occupancy}%</span>
        </div>

        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: "#E2E8F0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${occupancy}%`,
              height: "100%",
              background:
                occupancy > 80
                  ? "#EF4444"
                  : occupancy > 60
                    ? "#F59E0B"
                    : "#22C55E",
            }}
          />
        </div>
      </div>

      {/* INFO */}

      <div
        style={{
          marginTop: 28,
        }}
      >
        <Info
          icon={<Route size={18} />}
          label="Route"
          value={vehicle.route || "Cubao - Katipunan"}
        />

        <Info
          icon={<Gauge size={18} />}
          label="Speed"
          value={`${vehicle.speed || 0} km/h`}
        />

        <Info
          icon={<Users size={18} />}
          label="Passengers"
          value={`${passengers}/${capacity}`}
        />

        <Info
          icon={<Clock3 size={18} />}
          label="ETA"
          value={`${vehicle.eta || 5} mins`}
        />

        <Info
          icon={<MapPinned size={18} />}
          label="Destination"
          value={vehicle.destination || "Terminal"}
        />
      </div>

      {/* METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginTop: 28,
        }}
      >
        <MiniCard
          title="Speed"
          value={`${vehicle.speed || 0}`}
          color="#DBEAFE"
        />

        <MiniCard
          title="Delay"
          value={`${vehicle.delay || 0}m`}
          color="#FEF3C7"
        />

        <MiniCard title="Load" value={`${occupancy}%`} color="#DCFCE7" />
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

      <strong>{value}</strong>
    </div>
  );
}

function MiniCard({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 16,
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
          fontSize: 13,
          color: "#475569",
        }}
      >
        {title}
      </div>
    </div>
  );
}
