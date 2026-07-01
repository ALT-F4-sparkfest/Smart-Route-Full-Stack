import { useEffect, useState } from "react";

import { fetchVehicleETAs } from "../api/vehicleApi";

export default function useBackendETA(vehicleId) {
  const [etas, setEtas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) {
      setEtas([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadETA() {
      try {
        const data = await fetchVehicleETAs(vehicleId);

        if (!cancelled) {
          setEtas(data);
        }
      } catch (error) {
        if (!cancelled) {
          setEtas([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadETA();

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  return {
    etas,
    loading,
  };
}
