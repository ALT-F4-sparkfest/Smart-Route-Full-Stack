// src/pages/CommuterView.jsx
import { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import io from "socket.io-client";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Helper distance
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapControls({ onRefresh, onCenter }) {
  const map = useMap();
  const handleCenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map?.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          map?.setZoom(16);
        },
        () => alert("Unable to get location"),
      );
    }
  };
  const handleRefresh = () => {
    map?.panTo({ lat: 14.5995, lng: 120.9842 });
    map?.setZoom(13);
    onRefresh?.();
  };
  return (
    <div className="map-controls">
      <button onClick={handleRefresh} className="ctrl-btn">
        🔄
      </button>
      <button onClick={handleCenter} className="ctrl-btn">
        📍
      </button>
    </div>
  );
}

export default function CommuterView({ onBack }) {
  const [vehicles, setVehicles] = useState({});
  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const socketRef = useRef(null);

  // Socket.IO & fetch (same as before)
  useEffect(() => {
    socketRef.current = io(BACKEND_URL, { transports: ["websocket"] });
    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));
    socketRef.current.on("vehicle-update", (data) => {
      setVehicles((prev) => ({ ...prev, [data.id]: data }));
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {},
      );
    }

    fetch(`${BACKEND_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((v) => (map[v.id || v.vehicle_id] = v));
        setVehicles(map);
      })
      .catch(() => {});

    return () => socketRef.current?.disconnect();
  }, []);

  const vehicleList = Object.values(vehicles);
  const nearest = userLocation
    ? vehicleList
        .map((v) => ({
          ...v,
          dist: distance(userLocation.lat, userLocation.lng, v.lat, v.lng),
        }))
        .filter((v) => v.dist <= 3)
        .sort((a, b) => a.dist - b.dist)
    : vehicleList;

  const handleDestinationSubmit = async () => {
    /* ... same ... */
  };
  const handleWaiting = () => {
    /* ... same ... */
  };

  return (
    <div className="commuter-view">
      <div className="commuter-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <span className="brand">🚌 BUSINA</span>
      </div>

      <div className="commuter-body">
        <div className="commuter-map-container">
          <APIProvider apiKey={API_KEY}>
            <div
              style={{ position: "relative", height: "100%", width: "100%" }}
            >
              <Map
                defaultCenter={{ lat: 14.5995, lng: 120.9842 }}
                defaultZoom={13}
                mapId="commuter-map"
                style={{ height: "100%", width: "100%" }}
                disableDefaultUI={true}
              >
                {/* Vehicle markers */}
                {nearest.map((v) => (
                  <AdvancedMarker
                    key={v.id}
                    position={{ lat: v.lat, lng: v.lng }}
                  >
                    <div style={{ fontSize: "28px", cursor: "pointer" }}>
                      🚌
                    </div>
                  </AdvancedMarker>
                ))}

                {/* User location marker */}
                {userLocation && (
                  <AdvancedMarker
                    position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#1A73E8",
                        border: "3px solid white",
                        boxShadow: "0 0 0 2px #1A73E8",
                      }}
                    />
                  </AdvancedMarker>
                )}
              </Map>
              <MapControls onRefresh={() => {}} onCenter={() => {}} />
            </div>
          </APIProvider>
        </div>

        <div className="commuter-side-panel">
          <div className="panel-section">
            <h3>Nearby Vehicles</h3>
            <div className="vehicle-list">
              {nearest.length === 0 ? (
                <p>No vehicles nearby</p>
              ) : (
                nearest.slice(0, 5).map((v) => (
                  <div key={v.id} className="vehicle-item">
                    <span>{v.id}</span>
                    <span>{v.dist?.toFixed(1)} km</span>
                    <span>{v.speed} km/h</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel-section">
            <h3>Plan Your Trip</h3>
            <div className="destination-input">
              <input
                type="text"
                placeholder="📍 Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <button onClick={handleDestinationSubmit}>Get ETA</button>
            </div>
            {eta && (
              <div className="eta-display">
                ⏱️ ETA: {eta.eta_minutes || eta.eta} min
                {eta.occupancy && ` · 👥 ${eta.occupancy} pax`}
              </div>
            )}
          </div>

          <div className="panel-section">
            <button
              className={`waiting-btn ${isWaiting ? "active" : ""}`}
              onClick={handleWaiting}
            >
              {isWaiting ? "🟢 Waiting..." : "🟡 I'm Waiting for a Jeep"}
            </button>
            <div className="connection-status">
              {connected ? "🟢 Connected" : "🔴 Disconnected"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
