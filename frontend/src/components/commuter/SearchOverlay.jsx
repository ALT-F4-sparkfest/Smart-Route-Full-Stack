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
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 560px)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(255,255,255,.90)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 22,
          padding: "14px 18px",
          border: "1px solid rgba(255,255,255,.4)",
          boxShadow: "0 18px 40px rgba(15,23,42,.15)",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: "#DBEAFE",
            color: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Search size={20} />
        </div>

        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#64748B",
              marginBottom: 2,
            }}
          >
            Destination
          </div>

          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              fontWeight: 600,
              color: "#0F172A",
            }}
          />
        </div>

        <button
          onClick={onSearch}
          disabled={loading}
          style={{
            width: 52,
            height: 52,
            border: "none",
            borderRadius: 18,
            cursor: "pointer",
            background: "linear-gradient(135deg,#2563EB,#3B82F6)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 25px rgba(37,99,235,.35)",
            transition: ".2s",
          }}
        >
          {loading ? "..." : <MapPin size={20} />}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {["Cubao", "Katipunan", "SM North", "UP Diliman"].map((route) => (
          <button
            key={route}
            onClick={() => setDestination(route)}
            style={{
              border: "none",
              borderRadius: 999,
              background: "rgba(255,255,255,.88)",
              backdropFilter: "blur(12px)",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              color: "#334155",
              boxShadow: "0 8px 18px rgba(0,0,0,.10)",
            }}
          >
            {route}
          </button>
        ))}
      </div>
    </div>
  );
}
