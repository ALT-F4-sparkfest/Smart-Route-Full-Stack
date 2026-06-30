// src/components/map/VehicleMarker.jsx

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Bus } from "lucide-react";
import useAnimatedPosition from "../../hooks/useAnimatedPosition";

export default function VehicleMarker({ vehicle, selected = false, onClick }) {
  // Prevent crashes
  if (
    !vehicle ||
    vehicle.lat == null ||
    vehicle.lng == null ||
    isNaN(vehicle.lat) ||
    isNaN(vehicle.lng)
  ) {
    return null;
  }

  const position = useAnimatedPosition({
    lat: Number(vehicle.lat),
    lng: Number(vehicle.lng),
  });

  return (
    <AdvancedMarker position={position} onClick={() => onClick?.(vehicle)}>
      <div
        style={{
          width: selected ? 50 : 42,
          height: selected ? 50 : 42,
          borderRadius: "50%",
          background: selected ? "#2563EB" : "#FFFFFF",
          color: selected ? "#FFFFFF" : "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #2563EB",
          boxShadow: "0 10px 24px rgba(0,0,0,.18)",
          cursor: "pointer",
          transition: "all .25s ease",
        }}
      >
        <Bus size={22} />
      </div>
    </AdvancedMarker>
  );
}
