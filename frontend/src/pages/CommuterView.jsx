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

// Map Controls Component (same as before)
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
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Connect to Socket.IO
  useEffect(() => {
    // Create socket connection
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
      console.log("🔌 Socket.IO connected");
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
      console.log("🔌 Socket.IO disconnected");
    });

    socketRef.current.on("vehicle-update", (vehicleData) => {
      setVehicles((prev) => ({
        ...prev,
        [vehicleData.id]: vehicleData,
      }));
    });

    // Fetch initial vehicles
    fetch(`${BACKEND_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => {
        const vehicleMap = {};
        data.forEach((v) => {
          vehicleMap[v.id || v.vehicle_id] = v;
        });
        setVehicles(vehicleMap);
      })
      .catch((err) => console.error("Error fetching vehicles:", err));

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [BACKEND_URL]);

  const vehicleList = Object.values(vehicles);
  const filteredVehicles = vehicleList.filter((v) =>
    v.route?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleWaiting = () => {
    setIsWaiting(!isWaiting);
    // Optionally send waiting event via socket
    if (!isWaiting && socketRef.current) {
      socketRef.current.emit("commuter-waiting", {
        lat: 14.5995,
        lng: 120.9842,
        route: "Cubao-Makati",
      });
    }
  };

  const handleRefresh = () => {
    fetch(`${BACKEND_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => {
        const vehicleMap = {};
        data.forEach((v) => {
          vehicleMap[v.id || v.vehicle_id] = v;
        });
        setVehicles(vehicleMap);
      })
      .catch((err) => console.error("Error refreshing vehicles:", err));
  };

  return (
    <div className="commuter-view">
      <div className="commuter-map-container">
        <APIProvider apiKey={API_KEY}>
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <Map
              defaultCenter={{ lat: 14.5995, lng: 120.9842 }}
              defaultZoom={13}
              mapId="commuter-map"
              style={{ height: "100%", width: "100%" }}
              disableDefaultUI={true}
            >
              {filteredVehicles.map((v) => (
                <AdvancedMarker
                  key={v.id || v.vehicle_id}
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

      <div className="commuter-status">
        <span className="vehicle-count">
          {filteredVehicles.length} vehicle(s) active
          {connected ? " 🔵" : " 🔴"}
        </span>
        <button
          className={`waiting-btn ${isWaiting ? "active" : ""}`}
          onClick={handleWaiting}
        >
          {isWaiting ? "🟢 Waiting..." : "🟡 I'm Waiting for a Jeep"}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search route..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="commuter-list">
        {filteredVehicles.length === 0 ? (
          <p className="empty-state">No vehicles found for this route</p>
        ) : (
          filteredVehicles.map((v) => (
            <div key={v.id || v.vehicle_id} className="vehicle-item">
              <span className="vehicle-icon">🚌</span>
              <div className="vehicle-info">
                <div className="vehicle-id">{v.id || v.vehicle_id}</div>
                <div className="vehicle-route">
                  {v.route || "Unknown route"}
                </div>
              </div>
              <div className="vehicle-speed">{v.speed || 0} km/h</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
