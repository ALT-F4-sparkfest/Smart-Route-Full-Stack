import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Users } from "lucide-react";

export default function WaitingMarker({ person }) {
  if (!person) return null;

  if (person.lat == null || person.lng == null) return null;

  return (
    <AdvancedMarker
      position={{
        lat: person.lat,
        lng: person.lng,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "#EF4444",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "3px solid white",
          boxShadow: "0 8px 18px rgba(0,0,0,.25)",
          animation: "pulse 2s infinite",
        }}
      >
        <Users size={18} />
      </div>
    </AdvancedMarker>
  );
}
