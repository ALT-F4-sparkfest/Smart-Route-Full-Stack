// src/hooks/useBackendAlerts.js
import { useState, useEffect } from "react";

export default function useBackendAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: replace with actual alert fetching from backend
    setAlerts([]);
    setLoading(false);
  }, []);

  return { alerts, loading };
}
