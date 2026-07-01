import React, { useState, useEffect } from "react";
import { Bus, Clock3, Navigation, MapPin, Wifi, WifiOff } from "lucide-react";

import LiveMap from "../components/map/LiveMap";
import BottomSheet from "../components/commuter/BottomSheet";
import SearchOverlay from "../components/commuter/SearchOverlay";
import ConnectionStatusPill from "../components/ConnectionStatusPill";
import useLiveVehicles from "../hooks/useLiveVehicles";

const DEMO_MODE = false;

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
  const live = useLiveVehicles();

  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState(null);
  const [loadingEta, setLoadingEta] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [routeFilter, setRouteFilter] = useState("all");

  const [userLocation, setUserLocation] = useState({
    lat: 14.625,
    lng: 121.048,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
    );
  }, []);

  const vehicleList = DEMO_MODE
    ? []
    : Array.isArray(live.vehicles)
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

  const nearest = userLocation
    ? filteredVehicles
        .map((vehicle) => ({
          ...vehicle,
          dist: distance(
            userLocation.lat,
            userLocation.lng,
            vehicle.lat,
            vehicle.lng,
          ),
        }))
        .sort((a, b) => a.dist - b.dist)
    : filteredVehicles;

  const handleDestinationSubmit = async () => {
    if (!destination.trim()) return;

    setLoadingEta(true);

    setTimeout(() => {
      setEta({
        eta_minutes: Math.floor(Math.random() * 6) + 3,
        destination,
      });

      setLoadingEta(false);
    }, 800);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          height: 76,
          background: "white",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          gap: 18,
          zIndex: 100,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#F1F5F9",
            width: 42,
            height: 42,
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ←
        </button>

        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 22,
              color: "#0F172A",
            }}
          >
            🚌 BUSINA
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Real-Time Passenger View
          </div>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <ConnectionStatusPill status={live.connected ? "live" : "offline"} />
        </div>
      </header>

      {/* BODY */}

      <div
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        <LiveMap
          vehicles={nearest}
          userLocation={userLocation}
          mapId="commuter-map"
        />

        <SearchOverlay
          destination={destination}
          setDestination={setDestination}
          onSearch={handleDestinationSubmit}
          loading={loadingEta}
        />

        {/* LIVE STATUS */}

        <div
          style={{
            position: "absolute",
            top: 120,
            right: 24,
            zIndex: 100,
            display: "flex",
            gap: 14,
          }}
        >
          <GlassCard>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {live.connected ? (
                <Wifi size={16} color="#22C55E" />
              ) : (
                <WifiOff size={16} color="#EF4444" />
              )}

              <span
                style={{
                  fontWeight: 700,
                }}
              >
                {live.connected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
          </GlassCard>

          <GlassCard>
            <strong>{nearest.length}</strong> Vehicles
          </GlassCard>
        </div>

        {/* ROUTE FILTER */}

        <div
          style={{
            position: "absolute",
            top: 120,
            left: 24,
            zIndex: 100,
          }}
        >
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              padding: "14px 18px",
              borderRadius: 16,
              background: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              fontWeight: 600,
            }}
          >
            <option value="all">All Routes</option>

            {routes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        {/* NEAREST BUS */}

        {nearest[0] && (
          <div
            style={{
              position: "absolute",
              left: 24,
              bottom: 250,
              zIndex: 100,
            }}
          >
            <GlassCard width={320}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "#DBEAFE",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Bus color="#2563EB" />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {nearest[0].id}
                  </div>

                  <div
                    style={{
                      color: "#64748B",
                      fontSize: 13,
                    }}
                  >
                    {nearest[0].route_id}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                    }}
                  >
                    {nearest[0].speed?.toFixed(0) ?? 0} km/h
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ETA */}

        {eta && (
          <div
            style={{
              position: "absolute",
              right: 24,
              bottom: 250,
              zIndex: 100,
            }}
          >
            <GlassCard width={220}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Clock3 size={18} />
                ETA
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  marginTop: 8,
                }}
              >
                {eta.eta_minutes}
              </div>

              <div>minutes</div>
            </GlassCard>
          </div>
        )}

        <BottomSheet
          nearest={nearest}
          eta={eta}
          waiting={isWaiting}
          onWait={() => setIsWaiting(!isWaiting)}
        />
      </div>
    </div>
  );
}

function GlassCard({ children, width }) {
  return (
    <div
      style={{
        width,
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 20px 45px rgba(0,0,0,.10)",
        border: "1px solid rgba(255,255,255,.4)",
      }}
    >
      {children}
    </div>
  );
}
