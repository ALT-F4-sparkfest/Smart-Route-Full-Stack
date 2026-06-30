import { Search, Navigation } from "lucide-react";

export default function SearchOverlay({
  destination,
  setDestination,
  onSearch,
  loading,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 22,
        left: "50%",
        transform: "translateX(-50%)",
        width: "92%",
        maxWidth: 640,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(18px)",
          borderRadius: 20,
          padding: "14px 18px",
          boxShadow: "0 18px 45px rgba(0,0,0,.18)",
        }}
      >
        <Search color="#2563EB" />

        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where are you going?"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 16,
          }}
        />

        <button
          onClick={onSearch}
          style={{
            border: "none",
            background: "#2563EB",
            color: "#fff",
            width: 44,
            height: 44,
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : <Navigation size={18} />}
        </button>
      </div>
    </div>
  );
}
