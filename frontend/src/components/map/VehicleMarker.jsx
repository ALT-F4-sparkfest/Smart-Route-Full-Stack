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
          width: selected ? 48 : 40,
          height: selected ? 48 : 40,
          borderRadius: "50%",
          background: selected ? "#2563EB" : "#ffffff",
          color: selected ? "#ffffff" : "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,.18)",
          border: "2px solid #2563EB",
          cursor: "pointer",
          transition: "all .2s ease",
        }}
      >
        <Bus size={22} />
      </div>
    </AdvancedMarker>
  );
}
