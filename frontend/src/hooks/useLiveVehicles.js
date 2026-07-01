// src/hooks/useLiveVehicles.js
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const API = "http://localhost:3000";

function normaliseVehicle(v) {
  const speed = typeof v.speed === "number" ? v.speed : 0;

  let status = "On Route";
  if (v.stationary_since) {
    const stoppedMs = Date.now() - new Date(v.stationary_since).getTime();
    status = stoppedMs > 3 * 60 * 1000 ? "Delayed" : "Stopped";
  } else if (!v.on_route) {
    status = "Off Route";
  }

  // Occupancy – generate stable demo data
  const seed = (v.id || "").charCodeAt(v.id?.length - 1) || 5;
  const occupancyCount = ((seed * 3) % 28) + 4;
  const capacity = 32;
  const passengersDisplay = `${occupancyCount} / ${capacity}`;
  const occupancyPercent = (occupancyCount / capacity) * 100;

  // ETA from speed
  const eta =
    v.eta ?? (speed > 2 ? Math.round((30 / Math.max(speed, 5)) * 10) : "--");

  return {
    ...v,
    id: v.id ?? v.vehicle_id,
    vehicle_id: v.vehicle_id ?? v.id,
    route: v.route ?? v.route_id,
    route_id: v.route_id ?? v.route,
    speed,
    status,
    passengers: passengersDisplay,
    occupancyPercent, // ← new numeric field for progress bars
    eta,
    driver: v.driver ?? "Driver",
    plate: v.plate ?? (v.id ?? "").toUpperCase(),
    destination: v.destination ?? v.route_id ?? "Terminal",
  };
}

export default function useLiveVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/vehicles`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVehicles(data.map(normaliseVehicle));
      })
      .catch(console.error);

    fetch(`${API}/alerts`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setAlerts)
      .catch(() => setAlerts([]));

    socketRef.current = io(API, {
      transports: ["websocket"],
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Connected", socketRef.current.id);
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Disconnected");
      setConnected(false);
    });

    socketRef.current.on("vehicle_snapshot", (snapshot) => {
      if (Array.isArray(snapshot)) {
        setVehicles(snapshot.map(normaliseVehicle));
      }
    });

    socketRef.current.on("vehicle_update", (vehicle) => {
      const norm = normaliseVehicle(vehicle);
      setVehicles((prev) => {
        const idx = prev.findIndex((v) => v.id === norm.id);
        if (idx === -1) return [...prev, norm];
        const next = [...prev];
        next[idx] = norm;
        return next;
      });
    });

    socketRef.current.on("alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    return () => socketRef.current?.disconnect();
  }, []);

  return {
    vehicles,
    alerts,
    connected,
    socket: socketRef.current,
  };
}
