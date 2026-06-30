// src/components/operator/WaitingMarker.jsx

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Users } from "lucide-react";

export default function WaitingMarker({ person }) {
  const count =
    person.waiting || person.waiters || person.count || person.passengers || 1;

  let color = "#22C55E";

  if (count >= 5) color = "#F59E0B";
  if (count >= 10) color = "#EF4444";

  return (
    <AdvancedMarker
      position={{
        lat: person.lat,
        lng: person.lng,
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        {/* Pulse Ring */}
        <div
          style={{
            position: "absolute",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: color,
            opacity: 0.25,
            top: -7,
            left: -7,
            animation: "businaPulse 2s infinite",
          }}
        />

        {/* Marker */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: color,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid white",
            boxShadow: "0 10px 25px rgba(0,0,0,.25)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Users size={18} />
        </div>

        {/* Passenger Count */}
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            minWidth: 22,
            height: 22,
            borderRadius: 999,
            background: "#fff",
            color: "#111827",
            fontWeight: 700,
            fontSize: 11,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,.18)",
            zIndex: 3,
          }}
        >
          {count}
        </div>

        <style>
          {`
            @keyframes businaPulse{
              0%{
                transform:scale(.8);
                opacity:.5;
              }

              70%{
                transform:scale(1.5);
                opacity:0;
              }

              100%{
                transform:scale(1.5);
                opacity:0;
              }
            }
          `}
        </style>
      </div>
    </AdvancedMarker>
  );
}
