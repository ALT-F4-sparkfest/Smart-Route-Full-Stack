import { Search, MapPin, Sparkles } from "lucide-react";

export default function SearchOverlay({
  destination,
  setDestination,
  onSearch,
  loading,
  connected, // <-- new prop
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%,680px)",
        zIndex: 50,
      }}
    >
      {/* Status Badge - now dynamic */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          padding: "8px 16px",
          borderRadius: 999,
          background: connected ? "#2563EB" : "#EF4444", // blue if live, red if offline
          color: "white",
          fontWeight: 700,
          fontSize: 13,
          boxShadow: connected
            ? "0 10px 24px rgba(37,99,235,.28)"
            : "0 10px 24px rgba(239,68,68,.28)",
        }}
      >
        <Sparkles size={14} />
        {connected ? "LIVE" : "OFFLINE"}
      </div>
      {/* Search - unchanged */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 18px",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 22,
          boxShadow: "0 22px 50px rgba(15,23,42,.18)",
          border: "1px solid rgba(255,255,255,.45)",
        }}
      >
        <Search color="#64748B" />

        <input
          type="text"
          placeholder="Where are you going today?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 16,
            color: "#0F172A",
          }}
        />

        <button
          onClick={onSearch}
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            border: "none",
            background: "#2563EB",
            color: "white",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 24px rgba(37,99,235,.28)",
          }}
        >
          {loading ? "..." : <MapPin size={20} />}
        </button>
      </div>
     {/* Route Chips - unchanged */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 14,
          overflowX: "auto",
        }}
      >
        {["Cubao", "Makati", "Marikina", "Pasig", "San Juan", "Divisoria"].map(
          (route) => (
            <button
              key={route}
              onClick={() => setDestination(route)}
              style={{
                border: "none",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,.92)",
                backdropFilter: "blur(18px)",
                color: "#2563EB",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 8px 18px rgba(15,23,42,.10)",
              }}
            >
              {route}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
