// frontend/src/components/map/LiveMap.jsx

import { useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import VehicleMarker from "./VehicleMarker";
import useRouteGeometry from "../../hooks/useRouteGeometry";

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 14.625, lng: 121.048 };

export default function LiveMap({
  vehicles = [],
  userLocation,
  mapId,
  center,
  routeId,
  selectedVehicleId,
  onVehicleSelect,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { coordinates: routeCoords, loading: routeLoading } =
    useRouteGeometry(routeId);

  // Determine map center: if selected vehicle exists, use its coordinates
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const mapCenter = selectedVehicle
    ? { lat: selectedVehicle.lat, lng: selectedVehicle.lng }
    : center || userLocation || defaultCenter;

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    [],
  );

  // Auto-center when selected vehicle moves
  useEffect(() => {
    if (window.mapRef && selectedVehicle) {
      window.mapRef.panTo({
        lat: selectedVehicle.lat,
        lng: selectedVehicle.lng,
      });
    }
  }, [selectedVehicle]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  const vehicleArray = Array.isArray(vehicles) ? vehicles : [];

  return (
    <GoogleMap
      id={mapId}
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={mapCenter}
      options={options}
      onLoad={(map) => {
        window.mapRef = map;
      }}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#2563EB",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 3,
            scale: 10,
          }}
        />
      )}

      {!routeLoading && routeCoords && routeCoords.length > 1 && (
        <Polyline
          path={routeCoords}
          options={{
            strokeColor: "#2563EB",
            strokeOpacity: 0.5,
            strokeWeight: 5,
            geodesic: true,
          }}
        />
      )}

      {vehicleArray.map((vehicle) => (
        <VehicleMarker
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={vehicle.id === selectedVehicleId}
          onClick={onVehicleSelect}
        />
      ))}
    </GoogleMap>
  );
}
