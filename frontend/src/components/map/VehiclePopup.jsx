import Button from "../ui/Button";

export default function VehiclePopup({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="vehicle-popup">
      <div className="popup-header">
        <div>
          <h3>{vehicle.id}</h3>

          <p>{vehicle.route}</p>
        </div>

        <button className="popup-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="popup-content">
        <div className="popup-row">
          <span>🚀 Speed</span>
          <strong>{vehicle.speed} km/h</strong>
        </div>

        <div className="popup-row">
          <span>📍 Status</span>
          <strong>{vehicle.status || "On Route"}</strong>
        </div>

        <div className="popup-row">
          <span>🧭 Latitude</span>
          <strong>{vehicle.lat}</strong>
        </div>

        <div className="popup-row">
          <span>🧭 Longitude</span>
          <strong>{vehicle.lng}</strong>
        </div>
      </div>

      <Button
        style={{
          width: "100%",
          marginTop: "16px",
        }}
      >
        Track Vehicle
      </Button>
    </div>
  );
}
