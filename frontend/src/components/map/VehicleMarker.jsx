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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: selected ? 54 : 46,
            height: selected ? 54 : 46,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#2563EB,#60A5FA)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid white",
            boxShadow: selected
              ? "0 0 0 8px rgba(37,99,235,.18),0 12px 30px rgba(37,99,235,.45)"
              : "0 10px 25px rgba(0,0,0,.25)",
            transition: ".25s",
          }}
        >
          <Bus size={24} />
        </div>

        <div
          style={{
            marginTop: 6,
            padding: "3px 8px",
            borderRadius: 999,
            background: "white",
            fontSize: 11,
            fontWeight: 700,
            boxShadow: "0 4px 10px rgba(0,0,0,.15)",
            whiteSpace: "nowrap",
          }}
        >
          {vehicle.plate || vehicle.id}
        </div>
      </div>
    </AdvancedMarker>
  );
}
