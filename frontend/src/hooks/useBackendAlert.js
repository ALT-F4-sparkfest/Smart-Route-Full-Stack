import { useEffect, useState } from "react";

import { fetchAlerts } from "../api/alertApi";

export default function useBackendAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      try {
        const backendAlerts = await fetchAlerts();

        if (!cancelled) {
          setAlerts(backendAlerts);
        }
      } catch (error) {
        if (!cancelled) {
          setAlerts([]);
        }
      }
    }

    loadAlerts();

    const interval = setInterval(loadAlerts, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return alerts;
}
