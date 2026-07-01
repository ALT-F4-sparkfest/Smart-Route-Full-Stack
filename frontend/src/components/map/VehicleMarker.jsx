// src/components/map/VehicleMarker.jsx

import { Marker } from "@react-google-maps/api";
import useAnimatedPosition from "../../hooks/useAnimatedPosition";

// Bus icon (same as before)
const busIcon = (isSelected) => ({
  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  fillColor: isSelected ? "#EF4444" : "#2563EB",
  fillOpacity: 1,
  strokeColor: "#FFFFFF",
  strokeWeight: 2,
  scale: isSelected ? 7 : 6,
  rotation: 0, // actual heading is set by Marker
});
export default function VehicleMarker({ vehicle, isSelected, onClick }) {
  // Validate vehicle
  if (
    !vehicle ||
    typeof vehicle.lat !== "number" ||
    typeof vehicle.lng !== "number"
  ) {
    return null;
  }

  // Get interpolated position
  const animatedPos = useAnimatedPosition({
    lat: vehicle.lat,
    lng: vehicle.lng,
  });

  // If no animated position yet, fallback to vehicle's raw position
  const position = animatedPos || { lat: vehicle.lat, lng: vehicle.lng };

  const handleClick = () => {
    if (onClick) onClick(vehicle.id);
  };

  return (
    <Marker
      position={position}
      icon={busIcon(isSelected)}
      onClick={handleClick}
      rotation={vehicle.heading || 0}
    />
  );
}
