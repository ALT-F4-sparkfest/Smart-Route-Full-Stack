// src/pages/CommuterView.jsx

import { useState, useEffect } from "react";
import { Bus, Clock3, Navigation } from "lucide-react";

import LiveMap from "../components/map/LiveMap";
import BottomSheet from "../components/commuter/BottomSheet";
import SearchOverlay from "../components/commuter/SearchOverlay";

import ConnectionStatusPill from "../components/ConnectionStatusPill";
import { useDemoSimulation } from "../hooks/useDemoSimulation";

const DEMO_MODE = true;

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
  const demo = useDemoSimulation();

  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loadingEta, setLoadingEta] = useState(false);

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

  const vehicleList = DEMO_MODE ? demo.vehicles : [];

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
        .sort((a, b) => a.dist - b.dist)
    : vehicleList;

  const handleWaiting = () => {
    setIsWaiting((prev) => !prev);
  };

  const handleDestinationSubmit = async () => {
    if (!destination.trim()) return;

    setLoadingEta(true);

    setTimeout(() => {
      setEta({
        eta_minutes: Math.floor(Math.random() * 8) + 3,
        destination,
        route: nearest[0]?.route || "Demo Route",
      });

      setLoadingEta(false);
    }, 700);
  };

  return (
    <div className="commuter-view">
      <div className="commuter-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <span className="brand">🚌 BUSINA</span>

        <div style={{ marginLeft: "auto" }}>
          <ConnectionStatusPill status="live" />
        </div>
      </div>

      <div
        className="commuter-body"
        style={{
          position: "relative",
          height: "calc(100vh - 70px)",
          width: "100%",
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

        {nearest[0] && (
          <div
            style={{
              position: "absolute",
              top: 165,
              left: 24,
              zIndex: 20,
              background: "rgba(255,255,255,.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 22,
              padding: 18,
              minWidth: 260,
              boxShadow: "0 18px 40px rgba(0,0,0,.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
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
                  {nearest[0].route}
                </div>
              </div>
            </div>
          </div>
        )}

        {eta && (
          <div
            style={{
              position: "absolute",
              top: 165,
              right: 24,
              zIndex: 20,
              background: "#2563EB",
              color: "white",
              borderRadius: 22,
              padding: 22,
              width: 180,
              boxShadow: "0 20px 45px rgba(37,99,235,.30)",
            }}
          >
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

            <div
              style={{
                opacity: 0.9,
              }}
            >
              minutes
            </div>
          </div>
        )}

        {nearest[0] && (
          <div
            style={{
              position: "absolute",
              right: 24,
              bottom: 240,
              zIndex: 20,
              background: "white",
              borderRadius: 18,
              padding: 18,
              boxShadow: "0 18px 40px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Navigation size={18} />

              <strong>{nearest[0].destination || "Destination"}</strong>
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#64748B",
              }}
            >
              Current Route
            </div>
          </div>
        )}

        <BottomSheet
          nearest={nearest}
          eta={eta}
          waiting={isWaiting}
          onWait={handleWaiting}
        />
      </div>
    </div>
  );
}
