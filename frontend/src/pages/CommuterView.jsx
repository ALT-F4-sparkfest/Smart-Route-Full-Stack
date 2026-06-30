// src/pages/CommuterView.jsx

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import LiveMap from "../components/map/LiveMap";

import { useConnectionStatus } from "../hooks/useConnectionStatus";
import ConnectionStatusPill from "../components/ConnectionStatusPill";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

export default function CommuterView({ onBack }) {
  const [vehicles, setVehicles] = useState({});
  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState(null);

  const [isWaiting, setIsWaiting] = useState(false);

  const [connected, setConnected] = useState(false);

  const [userLocation, setUserLocation] = useState(null);

  const [loadingEta, setLoadingEta] = useState(false);

  const socketRef = useRef(null);

  const { status, markUpdated } = useConnectionStatus(connected);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
    });

    socketRef.current.on("vehicle-update", (vehicle) => {
      setVehicles((prev) => ({
        ...prev,
        [vehicle.id]: vehicle,
      }));

      markUpdated();
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
      );
    }

    fetch(`${BACKEND_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};

        data.forEach((vehicle) => {
          map[vehicle.id || vehicle.vehicle_id] = vehicle;
        });

        setVehicles(map);

        markUpdated();
      })
      .catch(() => {});

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const vehicleList = Object.values(vehicles);

  const nearest = userLocation
    ? vehicleList
        .map((vehicle) => ({
          ...vehicle,
          dist: distance(
            userLocation.lat,
            userLocation.lng,
            vehicle.lat,
            vehicle.lng,
          ),
        }))
        .filter((vehicle) => vehicle.dist <= 3)
        .sort((a, b) => a.dist - b.dist)
    : vehicleList;

  const handleWaiting = () => {
    const next = !isWaiting;

    setIsWaiting(next);

    if (next && socketRef.current?.connected) {
      socketRef.current.emit("commuter-waiting", {
        lat: userLocation?.lat || 14.5995,
        lng: userLocation?.lng || 120.9842,
        route: nearest[0]?.route || "unknown",
      });
    }
  };

  const handleDestinationSubmit = async () => {
    if (!destination.trim()) return;

    if (nearest.length === 0) return;

    setLoadingEta(true);

    try {
      const vehicle = nearest[0];

      const response = await fetch(
        `${BACKEND_URL}/vehicles/${vehicle.id}/etas`,
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      setEta(data);
    } catch {
      setEta({
        eta_minutes: "—",
        error: "Could not retrieve ETA",
      });
    } finally {
      setLoadingEta(false);
    }
  };

  return (
    <div className="commuter-view">
      <div className="commuter-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <span className="brand">🚌 BUSINA</span>

        <div style={{ marginLeft: "auto" }}>
          <ConnectionStatusPill status={status} />
        </div>
      </div>

      <div className="commuter-body">
        <div className="commuter-map-container">
          <LiveMap
            vehicles={nearest}
            userLocation={userLocation}
            mapId="commuter-map"
            onRefresh={() => {}}
          />
        </div>

        <div className="commuter-side-panel">
          <div className="panel-section">
            <h3>Nearby Vehicles</h3>

            <div className="vehicle-list">
              {nearest.length === 0 ? (
                <p>No vehicles nearby.</p>
              ) : (
                nearest.slice(0, 5).map((vehicle) => (
                  <div key={vehicle.id} className="vehicle-item">
                    <span>{vehicle.id}</span>

                    <span>{vehicle.dist?.toFixed(1)} km</span>

                    <span>{vehicle.speed} km/h</span>
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

              <button onClick={handleDestinationSubmit} disabled={loadingEta}>
                {loadingEta ? "⏳" : "Get ETA"}
              </button>
            </div>

            {eta && (
              <div className="eta-display">
                ⏱️ ETA: {eta.eta_minutes} min
                {eta.error && (
                  <span style={{ color: "red" }}> ({eta.error})</span>
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
