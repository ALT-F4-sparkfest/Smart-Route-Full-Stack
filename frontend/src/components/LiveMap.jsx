import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function LiveMap({ vehicles }) {
  const vehicleList = Object.values(vehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const center =
    vehicleList.length > 0
      ? { lat: vehicleList[0].lat, lng: vehicleList[0].lng }
      : { lat: 14.5547, lng: 121.0244 };

  return (
    <div className="map-wrapper">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat: 14.5547, lng: 121.0244 }}
          defaultZoom={14}
          center={center}
          zoom={15}
          mapId="smartroute-map"
          style={{ height: "100%", width: "100%" }}
          disableDefaultUI={false}
        >
          {vehicleList.map((v) => (
            <AdvancedMarker
              key={v.vehicle_id}
              position={{ lat: v.lat, lng: v.lng }}
              onClick={() => setSelectedVehicle(v)}
            >
              <div style={{ fontSize: "32px", cursor: "pointer" }}>🚌</div>
            </AdvancedMarker>
          ))}

          {selectedVehicle && (
            <InfoWindow
              position={{ lat: selectedVehicle.lat, lng: selectedVehicle.lng }}
              onCloseClick={() => setSelectedVehicle(null)}
            >
              <div className="popup-content">
                <strong>{selectedVehicle.vehicle_id}</strong>
                <p>Route: {selectedVehicle.route}</p>
                <p>Speed: {selectedVehicle.speed} km/h</p>
                <p>Status: {selectedVehicle.status}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
