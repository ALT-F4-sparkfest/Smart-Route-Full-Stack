// src/components/map/MapControls.jsx

import { LocateFixed, RotateCw } from "lucide-react";
import { useMap } from "@vis.gl/react-google-maps";

export default function MapControls({ onRefresh }) {
  const map = useMap();

  const centerOnUser = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      map?.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      map?.setZoom(16);
    });
  };

  const refreshMap = () => {
    map?.panTo({
      lat: 14.5995,
      lng: 120.9842,
    });

    map?.setZoom(13);

    onRefresh?.();
  };

  return (
    <div className="map-floating-controls">
      <button
        className="floating-btn"
        onClick={refreshMap}
        aria-label="Refresh map"
      >
        <RotateCw size={20} />
      </button>

      <button
        className="floating-btn"
        onClick={centerOnUser}
        aria-label="Center on me"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
}
