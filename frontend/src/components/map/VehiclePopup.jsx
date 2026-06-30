import Card from "../ui/Card";
import { Bus, Gauge, Users, Route, Clock } from "lucide-react";

export default function VehiclePopup({ vehicle }) {
  if (!vehicle) return null;

  return (
    <Card title={`Vehicle ${vehicle.id}`}>
      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <Info
          icon={<Bus size={18} />}
          label="Status"
          value={vehicle.status || "Online"}
        />

        <Info
          icon={<Gauge size={18} />}
          label="Speed"
          value={`${vehicle.speed || 0} km/h`}
        />

        <Info
          icon={<Users size={18} />}
          label="Passengers"
          value={vehicle.passengers ?? "--"}
        />

        <Info
          icon={<Route size={18} />}
          label="Route"
          value={vehicle.route || "Unknown"}
        />

        <Info icon={<Clock size={18} />} label="Updated" value="Just now" />
      </div>
    </Card>
  );
}

function Info({ icon, label, value }) {
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
          gap: 8,
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
