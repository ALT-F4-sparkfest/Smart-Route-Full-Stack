import { AdvancedMarker } from "@vis.gl/react-google-maps";

export default function UserMarker({ position }) {
  if (!position) return null;

  if (position.lat == null || position.lng == null) return null;

  return (
    <AdvancedMarker position={position}>
      <div
        style={{
          position: "relative",
          width: 20,
          height: 20,
        }}
      >
        {/* Accuracy Ring */}

        <div
          style={{
            position: "absolute",
            width: 52,
            height: 52,
            left: -16,
            top: -16,
            borderRadius: "50%",
            background: "rgba(37,99,235,.18)",
            animation: "userPulse 2s infinite",
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
            boxShadow: "0 8px 18px rgba(37,99,235,.35)",
            position: "relative",
            zIndex: 2,
          }}
        />

        <style>
          {`
          @keyframes userPulse{
            0%{
              transform:scale(.7);
              opacity:.9;
            }

            100%{
              transform:scale(1.8);
              opacity:0;
            }
          }
          `}
        </style>
      </div>
    </AdvancedMarker>
  );
}
