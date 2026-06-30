// src/components/map/UserMarker.jsx

import { AdvancedMarker } from "@vis.gl/react-google-maps";

export default function UserMarker({ location }) {
  if (!location) return null;

  return (
    <AdvancedMarker position={location}>
      <div
        style={{
          position: "relative",
          width: 20,
          height: 20,
        }}
      >
        {/* Outer Pulse */}
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background: "rgba(37,99,235,.25)",
            animation: "pulse 2s infinite",
          }}
        />

        {/* Blue Dot */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#2563EB",
            border: "4px solid white",
            boxShadow: "0 4px 10px rgba(0,0,0,.25)",
          }}
        />
      </div>
    </AdvancedMarker>
  );
}
