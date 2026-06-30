import Card from "../ui/Card";
import Button from "../ui/Button";

import { Bus, Clock3, Gauge, MapPinned, X } from "lucide-react";

export default function VehiclePopup({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3>{vehicle.id}</h3>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="popup-row">
        <Bus size={18} />
        <span>{vehicle.route}</span>
      </div>

      <div className="popup-row">
        <Gauge size={18} />
        <span>{vehicle.speed} km/h</span>
      </div>

      <div className="popup-row">
        <Clock3 size={18} />
        <span>ETA 5 mins</span>
      </div>

      <div className="popup-row">
        <MapPinned size={18} />
        <span>
          {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
        </span>
      </div>

      <Button
        style={{
          marginTop: 20,
          width: "100%",
        }}
      >
        Track Vehicle
      </Button>
    </Card>
  );
}
