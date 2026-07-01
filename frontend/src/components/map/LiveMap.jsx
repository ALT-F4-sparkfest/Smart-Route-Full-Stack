// src/components/map/LiveMap.jsx
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import hotspots from "../../data/demandHotspots.json";
import RoutePolylines from "./RoutePolylines";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const STATUS_COLOR = {
  "On Route": "#22C55E",
  Delayed: "#F59E0B",
  Stopped: "#94A3B8",
  "Off Route": "#EF4444",
};

export default function LiveMap({
  vehicles,
  userLocation,
  mapId = "smartroute-map",
  selectedVehicleId,
  onVehicleSelect,
  routeId,
  center, // optional initial center (only used once for defaultCenter)
}) {
  const vehicleList = Array.isArray(vehicles)
    ? vehicles
    : Object.values(vehicles || {});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const handleVehicleClick = (v) => {
    setSelectedVehicle(v);
    onVehicleSelect?.(v.id);
  };

  // Compute initial map center: explicit center prop > userLocation > first vehicle > default
  const mapCenter =
    center ??
    userLocation ??
    (vehicleList[0]?.lat && vehicleList[0]?.lng
      ? { lat: vehicleList[0].lat, lng: vehicleList[0].lng }
      : { lat: 14.6255, lng: 121.0489 });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={mapCenter} // ← now using defaultCenter – user can pan freely
          defaultZoom={15}
          mapId={mapId}
          style={{ height: "100%", width: "100%" }}
          disableDefaultUI={false}
        >
          <RoutePolylines activeRoute={routeId ?? null} mapId={mapId} />

          {/* User location */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#2563EB",
                  border: "3px solid white",
                  boxShadow: "0 0 0 3px rgba(37,99,235,0.3)",
                }}
              />
            </AdvancedMarker>
          )}

          {/* Vehicle markers */}
          {vehicleList.map((v) => {
            if (
              typeof v.lat !== "number" ||
              typeof v.lng !== "number" ||
              !isFinite(v.lat) ||
              !isFinite(v.lng)
            )
              return null;
            const isSelected = v.id === selectedVehicleId;
            const statusColor = STATUS_COLOR[v.status] ?? "#2563EB";
            const shortId = (v.id ?? "").split("-").slice(-2).join("-");
            return (
              <AdvancedMarker
                key={v.id ?? v.vehicle_id}
                position={{ lat: v.lat, lng: v.lng }}
                onClick={() => handleVehicleClick(v)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      background: isSelected ? "#1D4ED8" : "white",
                      border: `2px solid ${isSelected ? "#1D4ED8" : statusColor}`,
                      borderRadius: 12,
                      padding: "4px 8px",
                      boxShadow: isSelected
                        ? "0 4px 16px rgba(37,99,235,0.4)"
                        : "0 2px 8px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🚌</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isSelected ? "white" : "#0F172A",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {shortId}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 2,
                      height: 6,
                      background: isSelected ? "#1D4ED8" : statusColor,
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isSelected ? "#1D4ED8" : statusColor,
                    }}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Hotspot markers - filtered and scaled */}
          {hotspots
            .filter((spot) => spot.demand_score > 3)
            .map((spot, idx) => {
              const radius = Math.max(spot.demand_score * 0.8, 4);
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
                      backgroundColor: "rgba(255,107,0,0.6)",
                      border: "2px solid #1A237E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    {spot.demand_score.toFixed(0)}
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* Enriched vehicle InfoWindow */}
          {selectedVehicle && (
            <InfoWindow
              position={{ lat: selectedVehicle.lat, lng: selectedVehicle.lng }}
              onCloseClick={() => setSelectedVehicle(null)}
            >
              <div
                style={{
                  padding: "4px 2px",
                  minWidth: 190,
                  fontFamily: "system-ui,sans-serif",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>🚌</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0F172A",
                      }}
                    >
                      {selectedVehicle.id}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>
                      {selectedVehicle.route_id}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <InfoRow
                    label="Speed"
                    value={`${Math.round(selectedVehicle.speed ?? 0)} km/h`}
                  />
                  <InfoRow
                    label="ETA"
                    value={`${selectedVehicle.eta ?? "--"} min`}
                  />
                  <InfoRow
                    label="Occupancy"
                    value={selectedVehicle.passengers ?? "--"}
                  />
                  <InfoRow
                    label="Driver"
                    value={selectedVehicle.driver ?? "--"}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 8px",
                    background: "#F8FAFC",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        STATUS_COLOR[selectedVehicle.status] ?? "#64748B",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}
                  >
                    {selectedVehicle.status ?? "Unknown"}
                  </span>
                </div>
                {selectedVehicle.destination && (
                  <div style={{ marginTop: 6, fontSize: 12, color: "#64748B" }}>
                    → {selectedVehicle.destination}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}

          {/* Hotspot InfoWindow */}
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

function InfoRow({ label, value }) {
  return (
    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "6px 8px" }}>
      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
        {value}
      </div>
    </div>
  );
}
