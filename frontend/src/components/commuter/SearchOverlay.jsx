import { Search, MapPin } from "lucide-react";

export default function SearchOverlay({
  destination,
  setDestination,
  onSearch,
  loading,
}) {
  return (
    <div className="search-overlay">
      <Search size={18} />

      <input
        type="text"
        placeholder="Where are you going?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <button onClick={onSearch}>
        {loading ? "..." : <MapPin size={18} />}
      </button>
    </div>
  );
}
