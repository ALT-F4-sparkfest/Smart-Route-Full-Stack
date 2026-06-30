export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
}) {
  return (
    <div className="search-bar">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />

      <button onClick={onSearch}>Search</button>
    </div>
  );
}
