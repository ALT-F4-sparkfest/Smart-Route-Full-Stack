// src/components/map/VehicleMarker.jsx

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Bus } from "lucide-react";

export default function VehicleMarker({ vehicle, selected = false, onClick }) {
  return (
    <AdvancedMarker
      position={{
        lat: vehicle.lat,
        lng: vehicle.lng,
      }}
      onClick={() => onClick?.(vehicle)}
    >
      <div
        style={{
          width: selected ? 52 : 42,
          height: selected ? 52 : 42,
          borderRadius: "50%",
          background: selected ? "#2563EB" : "#FFFFFF",
          color: selected ? "#FFFFFF" : "#2563EB",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          border: "2px solid #2563EB",

          cursor: "pointer",

          transition: "all .25s ease",

          transform: selected ? "scale(1.15)" : "scale(1)",

          boxShadow: selected
            ? "0 12px 28px rgba(37,99,235,.45)"
            : "0 8px 18px rgba(0,0,0,.18)",
        }}
      >
        <Bus size={22} />
      </div>
    </AdvancedMarker>
  );
}
