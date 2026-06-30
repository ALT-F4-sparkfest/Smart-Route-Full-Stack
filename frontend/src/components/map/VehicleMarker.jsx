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
          position: "relative",
          cursor: "pointer",
          transform: selected ? "scale(1.15)" : "scale(1)",
          transition: ".25s",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: "rgba(37,99,235,.18)",
            animation: "pulse 2s infinite",
          }}
        />

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#2563EB",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            border: "3px solid white",
            boxShadow: "0 12px 28px rgba(0,0,0,.25)",
            position: "relative",
          }}
        >
          <Bus size={22} />
        </div>
      </div>
    </AdvancedMarker>
  );
}
