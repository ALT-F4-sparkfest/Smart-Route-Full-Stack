// src/pages/CommuterView.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Bus,
  Clock3,
  Navigation,
  MapPin,
  RefreshCw,
  LocateFixed,
} from "lucide-react";
import LiveMap from "../components/map/LiveMap";
import BottomSheet from "../components/commuter/BottomSheet";
import SearchOverlay from "../components/commuter/SearchOverlay";
import ConnectionStatusPill from "../components/ConnectionStatusPill";
import useLiveVehicles from "../hooks/useLiveVehicles";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

const DEFAULT_LOCATION = { lat: 14.625, lng: 121.048 };

export default function CommuterView({ onBack }) {
  const live = useLiveVehicles();

  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState(null);
  const [loadingEta, setLoadingEta] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingToast, setWaitingToast] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [routeFilter, setRouteFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapKey, setMapKey] = useState(0); // force map remount on refresh

  // Get real GPS if available
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
    );
  }, []);

  const vehicleList = Array.isArray(live.vehicles)
    ? live.vehicles.filter(
        (v) =>
          typeof v.lat === "number" &&
          typeof v.lng === "number" &&
          isFinite(v.lat) &&
          isFinite(v.lng),
      )
    : [];

  const routes = [
    ...new Set(vehicleList.map((v) => v.route_id).filter(Boolean)),
  ];

  const filteredVehicles =
    routeFilter === "all"
      ? vehicleList
      : vehicleList.filter((v) => v.route_id === routeFilter);

  const nearest = filteredVehicles
    .map((v) => ({
      ...v,
      dist: distance(userLocation.lat, userLocation.lng, v.lat, v.lng),
    }))
    .sort((a, b) => a.dist - b.dist);

  const selectedVehicle = nearest.find((v) => v.id === selectedVehicleId);

  // ETA fetch with demo fallback
  const handleDestinationSubmit = async (dest) => {
    const target = dest || destination;
    if (!target.trim() || !selectedVehicle) return;
    setLoadingEta(true);
    try {
      const res = await fetch(
        `${API}/vehicles/${selectedVehicle.id}/eta/stop1`,
      );
      const data = await res.json();
      setEta({
        eta_minutes: data.eta_minutes,
        destination: target,
        route: selectedVehicle.route_id,
        status: data.status,
        display_text: data.display_text,
      });
    } catch {
      const mockEta = selectedVehicle?.eta ?? Math.round(Math.random() * 8 + 3);
      setEta({
        eta_minutes: mockEta,
        destination: target,
        route: selectedVehicle.route_id,
        status: "on_route",
        display_text: `~${mockEta} min estimated`,
      });
    } finally {
      setLoadingEta(false);
    }
  };

  // I'm Waiting with toast feedback
  const toggleWaiting = () => {
    setIsWaiting((prev) => {
      const next = !prev;
      if (next) {
        live.socket?.emit?.("commuter-waiting", {
          lat: userLocation.lat,
          lng: userLocation.lng,
          route: selectedVehicle?.route_id,
        });
        setWaitingToast(true);
        setTimeout(() => setWaitingToast(false), 3000);
      }
      return next;
    });
  };

  // Recenter: reset userLocation to force map re-center
  const recenter = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation(DEFAULT_LOCATION),
    );
  }, []);

  // Refresh: bump mapKey to force full remount
  const refresh = () => setMapKey((k) => k + 1);

  return (
    <div
      style={{
        height: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 64,
          background: "white",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#F1F5F9",
            width: 38,
            height: 38,
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ←
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>
            🚌 BUSINA
          </div>
          <div style={{ fontSize: 11, color: "#64748B" }}>Commuter View</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ConnectionStatusPill status={live.connected ? "live" : "offline"} />
        </div>
      </header>

      {/* Map area */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <LiveMap
          key={mapKey}
          vehicles={nearest}
          userLocation={userLocation}
          mapId="commuter-map"
          selectedVehicleId={selectedVehicleId}
          onVehicleSelect={setSelectedVehicleId}
          routeId={routeFilter === "all" ? null : routeFilter}
        />

        {/* Search overlay */}
        <SearchOverlay
          destination={destination}
          setDestination={setDestination}
          onSearch={() => handleDestinationSubmit()}
          loading={loadingEta}
          connected={live.connected}
        />

        {/* Route filter — top left */}
        <div style={{ position: "absolute", top: 130, left: 16, zIndex: 100 }}>
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              padding: "10px 14px",
              borderRadius: 14,
              background: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,.10)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <option value="all">All Routes</option>
            {routes.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh + Recenter buttons — bottom right above sheet */}
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 195,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            onClick={recenter}
            title="Recenter map"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <LocateFixed size={18} color="#2563EB" />
          </button>
          <button
            onClick={refresh}
            title="Refresh vehicles"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={18} color="#64748B" />
          </button>
        </div>

        {/* Selected vehicle card */}
        {selectedVehicle && (
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 195,
              zIndex: 100,
              maxWidth: 300,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,.95)",
                backdropFilter: "blur(18px)",
                borderRadius: 20,
                padding: 16,
                boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                border: "1px solid rgba(255,255,255,.4)",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#DBEAFE",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 22,
                  }}
                >
                  🚌
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {selectedVehicle.id}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 12 }}>
                    {selectedVehicle.route_id}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVehicleId(null)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <MiniInfo
                  label="Speed"
                  value={`${Math.round(selectedVehicle.speed ?? 0)} km/h`}
                />
                <MiniInfo
                  label="ETA"
                  value={`${selectedVehicle.eta ?? "--"} min`}
                />
                <MiniInfo
                  label="Occupancy"
                  value={selectedVehicle.passengers ?? "--"}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      selectedVehicle.status === "On Route"
                        ? "#22C55E"
                        : selectedVehicle.status === "Delayed"
                          ? "#F59E0B"
                          : "#EF4444",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748B" }}>
                  {selectedVehicle.status ?? "Unknown"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ETA result card */}
        {eta && (
          <div
            style={{ position: "absolute", right: 16, top: 130, zIndex: 100 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,.95)",
                backdropFilter: "blur(18px)",
                borderRadius: 20,
                padding: 16,
                boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                border: "1px solid rgba(255,255,255,.4)",
                minWidth: 160,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#64748B",
                  fontSize: 12,
                }}
              >
                <Clock3 size={14} /> ETA to {eta.destination}
              </div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.1,
                  marginTop: 4,
                }}
              >
                {eta.eta_minutes}
              </div>
              <div style={{ color: "#64748B", fontSize: 12 }}>minutes</div>
              {eta.display_text && (
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                  {eta.display_text}
                </div>
              )}
              <button
                onClick={() => setEta(null)}
                style={{
                  marginTop: 8,
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                ✕ dismiss
              </button>
            </div>
          </div>
        )}

        {/* Waiting toast */}
        {waitingToast && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 200,
              background: "#16A34A",
              color: "white",
              padding: "10px 20px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 13,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            📍 Waiting registered!
          </div>
        )}

        <BottomSheet
          nearest={nearest}
          eta={eta}
          waiting={isWaiting}
          onWait={toggleWaiting}
          onSelectVehicle={setSelectedVehicleId}
          selectedVehicleId={selectedVehicleId}
        />
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 10,
        padding: "8px 10px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
