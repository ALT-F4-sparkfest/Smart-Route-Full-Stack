import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Navigation } from "lucide-react";

export default function UserMarker({ position }) {
  if (!position) return null;
  if (position.lat == null || position.lng == null) return null;

  return (
    <AdvancedMarker position={position}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#2563EB",
          border: "4px solid white",
          boxShadow: "0 4px 16px rgba(0,0,0,.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navigation size={12} color="white" />
      </div>
    </AdvancedMarker>
  );
}
