import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Bus } from "lucide-react";
import useAnimatedPosition from "../../hooks/useAnimatedPosition";

export default function VehicleMarker({ vehicle, selected = false, onClick }) {
  if (!vehicle) return null;
  if (vehicle.lat == null || vehicle.lng == null) return null;

  const position = useAnimatedPosition({
    lat: vehicle.lat,
    lng: vehicle.lng,
  });

  return (
    <AdvancedMarker position={position} onClick={() => onClick?.(vehicle)}>
      <div
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Live Pulse */}

        <div
          style={{
            position: "absolute",
            width: selected ? 72 : 60,
            height: selected ? 72 : 60,
            borderRadius: "50%",
            background: "rgba(37,99,235,.18)",
            animation: "pulse 2s infinite",
          }}
        />

        {/* Marker */}

        <div
          style={{
            width: selected ? 52 : 44,
            height: selected ? 52 : 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#2563EB,#60A5FA)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            border: "3px solid white",
            boxShadow: "0 12px 28px rgba(37,99,235,.35)",
            transition: ".25s",
            zIndex: 2,
          }}
        >
          <Bus size={22} />
        </div>

        {/* Vehicle Label */}

        <div
          style={{
            marginTop: 8,
            padding: "4px 10px",
            borderRadius: 999,
            background: "white",
            boxShadow: "0 8px 18px rgba(0,0,0,.12)",
            fontSize: 11,
            fontWeight: 700,
            color: "#2563EB",
            whiteSpace: "nowrap",
          }}
        >
          {vehicle.id}
        </div>

        <style>
          {`
          @keyframes pulse{
            0%{
              transform:scale(.8);
              opacity:.8;
            }
            100%{
              transform:scale(1.7);
              opacity:0;
            }
          }
          `}
        </style>
      </div>
    </AdvancedMarker>
  );
}
