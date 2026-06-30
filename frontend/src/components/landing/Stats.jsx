import StatCard from "../ui/StatCard";

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        <StatCard
          icon="🚌"
          title="Active Vehicles"
          value="27"
          footer="Currently on the road"
        />

        <StatCard
          icon="📍"
          title="Routes Covered"
          value="16"
          footer="Metro Manila"
        />

        <StatCard
          icon="👥"
          title="Passengers Today"
          value="482"
          footer="Live demand"
        />

        <StatCard
          icon="⚡"
          title="System Uptime"
          value="99.9%"
          footer="Reliable service"
        />
      </div>
    </section>
  );
}
