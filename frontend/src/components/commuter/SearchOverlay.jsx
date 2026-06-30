// src/components/commuter/SearchOverlay.jsx

import { Search, MapPin } from "lucide-react";

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
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 480px)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          borderRadius: 24,
          background: "rgba(255,255,255,.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 12px 32px rgba(0,0,0,.15)",
          border: "1px solid rgba(255,255,255,.55)",
        }}
      >
        <Search size={20} color="#2563EB" />

        <input
          type="text"
          placeholder="Where are you going today?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 15,
            fontWeight: 500,
          }}
        />

        <button
          onClick={onSearch}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg,#2563EB,#3B82F6)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(37,99,235,.35)",
          }}
        >
          {loading ? "..." : <MapPin size={18} />}
        </button>
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {["Cubao", "Katipunan", "Marikina", "Antipolo"].map((place) => (
          <button
            key={place}
            onClick={() => {
              setDestination(place);
              onSearch();
            }}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "8px 14px",
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 16px rgba(0,0,0,.12)",
            }}
          >
            {place}
          </button>
        ))}
      </div>
    </div>
  );
}
