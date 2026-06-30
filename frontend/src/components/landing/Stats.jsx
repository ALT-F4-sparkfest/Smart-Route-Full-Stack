import {
  Bus,
  Users,
  Clock3,
  Brain,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: <Bus size={28} />,
      value: "18",
      label: "Active Vehicles",
      color: "#2563EB",
    },
    {
      icon: <Users size={28} />,
      value: "245",
      label: "Passengers Tracked",
      color: "#22C55E",
    },
    {
      icon: <Clock3 size={28} />,
      value: "5 min",
      label: "Average ETA",
      color: "#F59E0B",
    },
    {
      icon: <Brain size={28} />,
      value: "97%",
      label: "AI Confidence",
      color: "#8B5CF6",
    },
    {
      icon: <TrendingUp size={28} />,
      value: "99.4%",
      label: "Fleet Uptime",
      color: "#06B6D4",
    },
    {
      icon: <ShieldCheck size={28} />,
      value: "Live",
      label: "System Status",
      color: "#10B981",
    },
  ];

  return (
    <section
      style={{
        padding: "20px 8% 80px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 24,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,.82)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: 24,
              padding: 28,
              border: "1px solid rgba(255,255,255,.45)",
              boxShadow: "0 18px 40px rgba(15,23,42,.08)",
              transition: "all .25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 28px 55px rgba(37,99,235,.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(15,23,42,.08)";
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: `${stat.color}20`,
                color: stat.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              {stat.icon}
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              {stat.value}
            </div>

            <div
              style={{
                marginTop: 8,
                color: "#64748B",
                fontWeight: 500,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
