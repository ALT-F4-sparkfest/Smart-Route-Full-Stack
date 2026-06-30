import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { User } from "lucide-react";

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
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F59E0B",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "3px solid white",
          boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        }}
      >
        <User size={18} />
      </div>
    </AdvancedMarker>
  );
}
