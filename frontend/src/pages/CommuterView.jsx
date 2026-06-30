// src/pages/CommuterView.jsx
import { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { getCurrentPosition } from "../utils/geolocation"; // we'll create this utility

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Small component to handle map controls using useMap
function MapControls({ onRefresh, onCenter }) {
  const map = useMap();

  const handleCenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map?.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          map?.setZoom(16);
        },
        () => alert("Unable to get your location. Please enable GPS."),
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const handleRefresh = () => {
    // Reset to default view (e.g., center of Metro Manila)
    map?.panTo({ lat: 14.5995, lng: 120.9842 });
    map?.setZoom(13);
    onRefresh?.();
  };

  return (
    <div className="map-controls">
      <button onClick={handleRefresh} className="ctrl-btn" title="Refresh view">
        🔄
      </button>
      <button
        onClick={handleCenter}
        className="ctrl-btn"
        title="Center my location"
      >
        📍
      </button>
    </div>
  );
}

export default function CommuterView() {
  const [vehicles, setVehicles] = useState({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 14.5995, lng: 120.9842 });

  // Simulate vehicle data (replace with WebSocket later)
  useEffect(() => {
    const mockVehicles = {
      "PUV-001": {
        vehicle_id: "PUV-001",
        lat: 14.567214,
        lng: 121.029426,
        speed: 21.8,
        route: "Cubao - Quiapo",
        status: "on_route",
      },
      "PUV-002": {
        vehicle_id: "PUV-002",
        lat: 14.58,
        lng: 121.09,
        speed: 15.2,
        route: "Cubao - Makati",
        status: "on_route",
      },
    };
    setVehicles(mockVehicles);
  }, []);

  const vehicleList = Object.values(vehicles);

  // Filter by search query (route)
  const filteredVehicles = vehicleList.filter((v) =>
    v.route.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleWaiting = () => {
    setIsWaiting(!isWaiting);
    // In real app, send to backend
  };

  const handleRefresh = () => {
    // Could re-fetch data from API here
    console.log("Refreshing data...");
  };

  return (
    <div className="commuter-view">
      {/* Map with Controls */}
      <div className="commuter-map-container">
        <APIProvider apiKey={API_KEY}>
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <Map
              defaultCenter={mapCenter}
              defaultZoom={13}
              center={mapCenter}
              zoom={13}
              mapId="commuter-map"
              style={{ height: "100%", width: "100%" }}
              disableDefaultUI={true} // we'll use our own controls
            >
              {filteredVehicles.map((v) => (
                <AdvancedMarker
                  key={v.vehicle_id}
                  position={{ lat: v.lat, lng: v.lng }}
                >
                  <div style={{ fontSize: "28px", cursor: "pointer" }}>🚌</div>
                </AdvancedMarker>
              ))}
            </Map>
            <MapControls onRefresh={handleRefresh} onCenter={() => {}} />
          </div>
        </APIProvider>
      </div>

      {/* Status Bar */}
      <div className="commuter-status">
        <span className="vehicle-count">
          {filteredVehicles.length} vehicle(s) active
        </span>
        <button
          className={`waiting-btn ${isWaiting ? "active" : ""}`}
          onClick={handleWaiting}
        >
          {isWaiting ? "🟢 Waiting..." : "🟡 I'm Waiting for a Jeep"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search route..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Vehicle List */}
      <div className="commuter-list">
        {filteredVehicles.length === 0 ? (
          <p className="empty-state">No vehicles found for this route</p>
        ) : (
          filteredVehicles.map((v) => (
            <div key={v.vehicle_id} className="vehicle-item">
              <span className="vehicle-icon">🚌</span>
              <div className="vehicle-info">
                <div className="vehicle-id">{v.vehicle_id}</div>
                <div className="vehicle-route">{v.route}</div>
              </div>
              <div className="vehicle-speed">{v.speed} km/h</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
