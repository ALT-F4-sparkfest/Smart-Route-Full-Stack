const STATUS_CONFIG = {
  connected: {
    color: "#22C55E",
    label: "Demo",
  },
  live: {
    color: "#22C55E",
    label: "Live",
  },
  stale: {
    color: "#F59E0B",
    label: "Syncing",
  },
  offline: {
    color: "#EF4444",
    label: "Offline",
  },
};

export default function ConnectionStatusPill({
  status = "connected",
  inline = false,
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.connected;

  return (
    <div
      style={{
        display: inline ? "inline-flex" : "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 20px rgba(0,0,0,.12)",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: config.color,
          boxShadow: `0 0 10px ${config.color}`,
        }}
      />

      {config.label}
    </div>
  );
}
