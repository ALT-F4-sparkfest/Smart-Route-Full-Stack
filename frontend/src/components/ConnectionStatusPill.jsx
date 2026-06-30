// src/components/ConnectionStatusPill.jsx
const STATUS_CONFIG = {
  live: { icon: "🔵", label: "Live", className: "status-live" },
  stale: { icon: "🟡", label: "Reconnecting…", className: "status-stale" },
  offline: { icon: "🔴", label: "Offline", className: "status-offline" },
};

export default function ConnectionStatusPill({ status, inline = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;

  return (
    <span
      className={`connection-pill ${inline ? "inline" : ""} ${config.className}`}
    >
      {config.icon} {config.label}
    </span>
  );
}
