// src/hooks/useConnectionStatus.js
import { useEffect, useState, useRef, useCallback } from "react";

const STALE_AFTER_MS = 15000;

export function useConnectionStatus(socketConnected) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isStale, setIsStale] = useState(false);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const age = Date.now() - lastUpdateRef.current;
      setIsStale(age > STALE_AFTER_MS);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socketConnected) setIsStale(true);
  }, [socketConnected]);

  // ✅ Stable function reference
  const markUpdated = useCallback(() => {
    lastUpdateRef.current = Date.now();
    setIsStale(false);
  }, []);

  const status = !isOnline ? "offline" : isStale ? "stale" : "live";

  return { status, isOnline, isStale, markUpdated };
}
