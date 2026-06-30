// src/components/map/LiveMap.jsx

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import VehicleMarker from "./VehicleMarker";
import UserMarker from "./UserMarker";
import MapControls from "./MapControls";

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
            <VehicleMarker key={vehicle.id} vehicle={vehicle} />
          ))}

          {userLocation && <UserMarker position={userLocation} />}

          {children}
        </Map>

        <MapControls onRefresh={onRefresh} />
      </div>
    </APIProvider>
  );
}
