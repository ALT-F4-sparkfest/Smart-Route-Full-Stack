// src/pages/CommuterView.jsx

import { useState, useEffect } from "react";

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => {},
      );
    }
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
    setIsWaiting(!isWaiting);
  };

  const handleDestinationSubmit = async () => {
    if (!destination.trim()) return;

    setLoadingEta(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setEta({
      eta_minutes: nearest.length ? nearest[0].eta : 6,
      route: nearest.length ? nearest[0].route : "Katipunan - Cubao",
    });

    setLoadingEta(false);
  };

  return (
    <div className="commuter-view">
      <div className="commuter-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <span className="brand">🚌 BUSINA</span>

        <div style={{ marginLeft: "auto" }}>
          <ConnectionStatusPill status="connected" />
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
