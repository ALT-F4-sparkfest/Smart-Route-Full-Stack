import { useEffect, useState } from "react";

import { fetchVehicles } from "../api/vehicleApi";
import { useDemoSimulation } from "./useDemoSimulation";

export default function useBackendVehicles() {
  const demo = useDemoSimulation();

  const [vehicles, setVehicles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      try {
        const backendVehicles = await fetchVehicles();

        if (cancelled) return;

        setVehicles(backendVehicles);
        setConnected(true);
      } catch (error) {
        console.warn("Backend unavailable. Falling back to Demo Mode.");

        if (cancelled) return;

        setVehicles(demo.vehicles);
        setConnected(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    const interval = setInterval(loadVehicles, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [demo.vehicles]);

  return {
    vehicles,
    connected,
    loading,
    usingDemo: !connected,
  };
}
