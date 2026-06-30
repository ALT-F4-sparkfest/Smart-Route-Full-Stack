import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import hotspots from "../data/demandHotspots.json"; // <-- Import the data

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function LiveMap({ vehicles }) {
  const vehicleList = Object.values(vehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Determine center: use first vehicle if exists, otherwise first hotspot, otherwise fallback
  let center = { lat: 14.5547, lng: 121.0244 };
  if (vehicleList.length > 0) {
    center = { lat: vehicleList[0].lat, lng: vehicleList[0].lng };
  } else if (hotspots.length > 0) {
    center = { lat: hotspots[0].latitude, lng: hotspots[0].longitude };
  }

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
          {/* Vehicle Markers */}
          {vehicleList.map((v) => (
            <AdvancedMarker
              key={v.vehicle_id}
              position={{ lat: v.lat, lng: v.lng }}
              onClick={() => setSelectedVehicle(v)}
            >
              <div style={{ fontSize: "32px", cursor: "pointer" }}>🚌</div>
            </AdvancedMarker>
          ))}

          {/* Demand Hotspot Markers */}
          {hotspots.map((spot, idx) => {
            // Scale marker size by demand_score (bigger score => bigger circle)
            const radius = Math.max(spot.demand_score * 1.5, 8);
            return (
              <AdvancedMarker
                key={`hotspot-${idx}`}
                position={{ lat: spot.latitude, lng: spot.longitude }}
                onClick={() => setSelectedHotspot(spot)}
              >
                <div
                  style={{
                    width: `${radius}px`,
                    height: `${radius}px`,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 107, 0, 0.7)",
                    border: "2px solid #1A237E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {spot.demand_score.toFixed(0)}
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Vehicle Info Window */}
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

          {/* Hotspot Info Window */}
          {selectedHotspot && (
            <InfoWindow
              position={{
                lat: selectedHotspot.latitude,
                lng: selectedHotspot.longitude,
              }}
              onCloseClick={() => setSelectedHotspot(null)}
            >
              <div style={{ padding: "4px 0" }}>
                <strong>{selectedHotspot.stop_name}</strong>
                <br />
                Route: {selectedHotspot.route_id}
                <br />
                Demand Score: {selectedHotspot.demand_score}
                <br />
                Avg Wait: {selectedHotspot.avg_wait_minutes} min
                <br />
                Daily Waiting: {selectedHotspot.avg_daily_waiting} people
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
