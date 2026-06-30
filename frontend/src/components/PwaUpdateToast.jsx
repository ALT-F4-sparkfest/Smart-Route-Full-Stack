// src/components/PwaUpdateToast.jsx
export default function PwaUpdateToast({
  updateAvailable,
  applyUpdate,
  offlineReady,
  dismissOfflineReady,
}) {
  if (!updateAvailable && !offlineReady) return null;

  if (updateAvailable) {
    return (
      <div className="pwa-toast">
        <div className="pwa-toast-text">
          <strong>New version available</strong>
          <span>Reload to get the latest BUSINA.</span>
        </div>
        <button className="pwa-toast-btn" onClick={applyUpdate}>
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="pwa-toast pwa-toast-muted">
      <div className="pwa-toast-text">
        <strong>BUSINA is ready offline</strong>
        <span>Core features will work without a connection.</span>
      </div>
      <button
        className="pwa-toast-dismiss"
        onClick={dismissOfflineReady}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
