// src/components/map/LiveMap.jsx

import { useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

import VehicleMarker from "./VehicleMarker";
import UserMarker from "./UserMarker";
import MapControls from "./MapControls";
import VehiclePopup from "./VehiclePopup";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function LiveMap({
  vehicles = [],
  userLocation = null,
  mapId = "busina-map",
  defaultCenter = { lat: 14.5995, lng: 120.9842 },
  defaultZoom = 13,
  onRefresh,
  children,
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId={mapId}
          disableDefaultUI
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {vehicles.map((vehicle) => (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              selected={selectedVehicle?.id === vehicle.id}
              onClick={setSelectedVehicle}
            />
          ))}

          {userLocation && <UserMarker position={userLocation} />}

          {children}
        </Map>

        <MapControls onRefresh={onRefresh} />

        {selectedVehicle && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              zIndex: 999,
              width: "320px",
            }}
          >
            <VehiclePopup
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          </div>
        )}
      </div>
    </APIProvider>
  );
}
