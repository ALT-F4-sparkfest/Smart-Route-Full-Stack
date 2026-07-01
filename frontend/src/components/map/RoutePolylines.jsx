// src/components/map/RoutePolylines.jsx
import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

const ROUTE_STYLES = {
  "Katipunan - Cubao": { strokeColor: "#2563eb" },
  "Marikina - Cubao": { strokeColor: "#16a34a" },
  "Antipolo - Cubao": { strokeColor: "#d97706" },
  "Project 6 - Monumento": { strokeColor: "#9333ea" },
};

const ROUTE_PATHS = {
  "Katipunan - Cubao": [
    { lat: 14.6441, lng: 121.0778 },
    { lat: 14.637, lng: 121.07 },
    { lat: 14.631, lng: 121.063 },
    { lat: 14.6255, lng: 121.058 },
    { lat: 14.621, lng: 121.054 },
    { lat: 14.618, lng: 121.052 },
  ],
  "Marikina - Cubao": [
    { lat: 14.6507, lng: 121.101 },
    { lat: 14.643, lng: 121.088 },
    { lat: 14.636, lng: 121.076 },
    { lat: 14.628, lng: 121.062 },
    { lat: 14.618, lng: 121.052 },
  ],
  "Antipolo - Cubao": [
    { lat: 14.626, lng: 121.126 },
    { lat: 14.624, lng: 121.106 },
    { lat: 14.622, lng: 121.086 },
    { lat: 14.62, lng: 121.066 },
    { lat: 14.618, lng: 121.052 },
  ],
  "Project 6 - Monumento": [
    { lat: 14.656, lng: 121.018 },
    { lat: 14.656, lng: 121.025 },
    { lat: 14.6558, lng: 121.033 },
    { lat: 14.655, lng: 121.021 },
    { lat: 14.654, lng: 121.013 },
  ],
};

export default function RoutePolylines({ activeRoute = null }) {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    // Clear any existing polylines when unmounting or when route changes
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    // Only draw if we have a valid, non‑"all" route string
    if (
      !activeRoute ||
      typeof activeRoute !== "string" ||
      activeRoute === "all"
    ) {
      return;
    }

    if (!map || !window.google?.maps?.Polyline) return;

    const path = ROUTE_PATHS[activeRoute];
    if (!path) return;

    const color = ROUTE_STYLES[activeRoute]?.strokeColor ?? "#64748b";

    // Glow layer
    const glow = new window.google.maps.Polyline({
      path,
      strokeColor: color,
      strokeOpacity: 0.15,
      strokeWeight: 14,
      geodesic: true,
      map,
    });

    // Solid line
    const line = new window.google.maps.Polyline({
      path,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 5,
      geodesic: true,
      map,
    });

    polylinesRef.current.push(glow, line);

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, activeRoute]);

  return null;
}
