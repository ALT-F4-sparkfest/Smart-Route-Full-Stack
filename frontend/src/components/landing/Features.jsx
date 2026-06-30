import { Bus, MapPinned, Clock3, Brain, Route, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MapPinned size={34} />,
      title: "Live Vehicle Tracking",
      description:
        "Track every vehicle on an interactive map with smooth real-time updates.",
      color: "#2563EB",
    },
    {
      icon: <Clock3 size={34} />,
      title: "Accurate ETA",
      description:
        "Predict arrival times using live fleet positions and traffic-aware estimates.",
      color: "#F59E0B",
    },
    {
      icon: <Brain size={34} />,
      title: "AI Dispatch",
      description:
        "Receive intelligent dispatch recommendations based on commuter demand.",
      color: "#8B5CF6",
    },
    {
      icon: <Bus size={34} />,
      title: "Fleet Monitoring",
      description:
        "Monitor active vehicles, passenger loads, delays, and operational health.",
      color: "#22C55E",
    },
    {
      icon: <Route size={34} />,
      title: "Demand Hotspots",
      description:
        "Identify high-demand pickup areas and optimize vehicle allocation instantly.",
      color: "#06B6D4",
    },
    {
      icon: <BarChart3 size={34} />,
      title: "Operational Analytics",
      description:
        "Visualize KPIs, travel trends, and fleet performance through smart dashboards.",
      color: "#EF4444",
    },
  ];

  return (
    <section
      style={{
        padding: "80px 8% 100px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: 16,
          }}
        >
          Everything You Need
        </h2>

        <p
          style={{
            maxWidth: 760,
            margin: "0 auto",
            fontSize: 18,
            lineHeight: 1.8,
            color: "#64748B",
          }}
        >
          BUSINA combines intelligent fleet management with a commuter-friendly
          experience to create a smarter, faster, and more reliable public
          transport system.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 28,
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            style={{
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: 26,
              padding: 34,
              border: "1px solid rgba(255,255,255,.45)",
              boxShadow: "0 20px 45px rgba(15,23,42,.08)",
              transition: ".25s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 30px 60px rgba(37,99,235,.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 20px 45px rgba(15,23,42,.08)";
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 22,
                background: `${feature.color}20`,
                color: feature.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {feature.icon}
            </div>

            <h3
              style={{
                fontSize: 24,
                marginBottom: 14,
                color: "#0F172A",
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                color: "#64748B",
                lineHeight: 1.8,
                fontSize: 16,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
