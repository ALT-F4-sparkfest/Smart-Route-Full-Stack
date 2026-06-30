import Card from "../ui/Card";

const features = [
  {
    icon: "📍",
    title: "Real-Time Tracking",
    description:
      "Track jeepneys and buses live on the map with continuously updated GPS locations.",
  },
  {
    icon: "⏱️",
    title: "Smart ETA Prediction",
    description:
      "Receive accurate arrival estimates powered by live traffic and vehicle movement.",
  },
  {
    icon: "📊",
    title: "Fleet Analytics",
    description:
      "Operators monitor fleet performance, passenger demand, and vehicle activity.",
  },
  {
    icon: "🔔",
    title: "Demand Alerts",
    description:
      "Know where commuters are waiting and respond before congestion builds.",
  },
  {
    icon: "🧠",
    title: "AI Insights",
    description:
      "BUSINA analyzes travel patterns to recommend better dispatching decisions.",
  },
  {
    icon: "☁️",
    title: "Cloud Connected",
    description:
      "IoT devices continuously sync GPS data to the cloud for real-time updates.",
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Why Choose BUSINA?</h2>

        <p>Built for commuters, operators, and smarter cities.</p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <Card key={feature.title} title={feature.title}>
            <div className="feature-icon">{feature.icon}</div>

            <p>{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
