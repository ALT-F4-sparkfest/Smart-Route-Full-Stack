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
        }}
      >
        {/* Pulse */}
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background: "rgba(37,99,235,.18)",
            animation: "busPulse 2s infinite",
          }}
        />

        {/* Vehicle */}
        <div
          style={{
            width: selected ? 56 : 46,
            height: selected ? 56 : 46,
            borderRadius: "50%",
            background: selected
              ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
              : "linear-gradient(135deg,#3B82F6,#60A5FA)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid white",
            boxShadow: "0 10px 24px rgba(37,99,235,.35)",
            transition: ".25s",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Bus size={22} />
        </div>

        {/* Route Label */}
        <div
          style={{
            marginTop: 6,
            background: "rgba(15,23,42,.88)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            textAlign: "center",
            boxShadow: "0 6px 14px rgba(0,0,0,.18)",
          }}
        >
          {vehicle.route || vehicle.id}
        </div>

        <style>
          {`
            @keyframes busPulse{
              0%{transform:scale(.9);opacity:.8;}
              70%{transform:scale(1.5);opacity:0;}
              100%{transform:scale(1.5);opacity:0;}
            }
          `}
        </style>
      </div>
    </AdvancedMarker>
  );
}
