// frontend/src/components/map/VehicleMarker.jsx

import { Marker } from "@react-google-maps/api";

export default function VehicleMarker({ vehicle, isSelected, onClick }) {
  if (
    !vehicle ||
    typeof vehicle.lat !== "number" ||
    typeof vehicle.lng !== "number"
  ) {
    return null;
  }

  const handleClick = () => {
    if (onClick) onClick(vehicle.id);
  };

  // Custom circle marker – selected gets a different color and size
  const icon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: isSelected ? "#EF4444" : "#2563EB",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: isSelected ? 4 : 2,
    scale: isSelected ? 14 : 10,
  };

  return (
    <Marker
      position={{ lat: vehicle.lat, lng: vehicle.lng }}
      icon={icon}
      onClick={handleClick}
    />
  );
}
