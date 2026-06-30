// src/hooks/usePwaUpdate.js
import { useEffect, useState, useRef } from "react";
import { registerSW } from "virtual:pwa-register";

/**
 * Wraps vite-plugin-pwa's registerSW so the UI can show an
 * "update available" toast instead of silently swapping in
 * the background (which can disconnect Socket.IO mid-session).
 *
 * Usage:
 *   const { updateAvailable, applyUpdate, offlineReady } = usePwaUpdate();
 */
export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateSWRef = useRef(null);

  useEffect(() => {
    // registerSW returns a function you call to trigger skipWaiting + reload
    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
      onRegisteredSW(swUrl, registration) {
        // Poll for updates every 60s while the tab is open, since
        // commuters may keep BUSINA open for a long ride without
        // a hard refresh.
        if (registration) {
          setInterval(() => {
            registration.update().catch(() => {});
          }, 60 * 1000);
        }
      },
      onRegisterError(error) {
        console.error("SW registration failed:", error);
      },
    });
  }, []);

  const applyUpdate = () => {
    if (updateSWRef.current) {
      // true = reload the page once the new SW takes control
      updateSWRef.current(true);
    }
  };

  const dismissOfflineReady = () => setOfflineReady(false);

  return { updateAvailable, applyUpdate, offlineReady, dismissOfflineReady };
}
