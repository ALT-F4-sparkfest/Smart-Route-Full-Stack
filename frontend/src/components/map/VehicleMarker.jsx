import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Bus } from "lucide-react";
import useAnimatedPosition from "../../hooks/useAnimatedPosition";

export default function VehicleMarker({ vehicle, selected = false, onClick }) {
  if (!vehicle) return null;

  if (vehicle.lat == null || vehicle.lng == null) return null;

  const position = useAnimatedPosition({
    lat: vehicle.lat,
    lng: vehicle.lng,
  });

  return (
    <AdvancedMarker position={position} onClick={() => onClick?.(vehicle)}>
      <div
        style={{
          width: selected ? 50 : 42,
          height: selected ? 50 : 42,
          borderRadius: "50%",
          background: selected ? "#2563EB" : "#fff",
          color: selected ? "#fff" : "#2563EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #2563EB",
          boxShadow: "0 10px 24px rgba(0,0,0,.18)",
          cursor: "pointer",
          transition: ".2s",
        }}
      >
        <Bus size={22} />
      </div>
    </AdvancedMarker>
  );
}
