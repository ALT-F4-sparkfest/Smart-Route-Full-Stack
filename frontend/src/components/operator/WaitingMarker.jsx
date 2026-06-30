// src/components/operator/WaitingMarker.jsx

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { UserRound } from "lucide-react";

export default function WaitingMarker({ person }) {
  return (
    <AdvancedMarker
      position={{
        lat: person.lat,
        lng: person.lng,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#EF4444",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid white",
          boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        }}
      >
        <UserRound size={18} />
      </div>
    </AdvancedMarker>
  );
}
