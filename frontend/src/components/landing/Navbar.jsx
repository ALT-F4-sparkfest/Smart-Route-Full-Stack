import { Bus, GitBranch, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      className="navbar-shell"
      style={{
        position: "sticky",
        top: 20,
        zIndex: 1000,
        width: "92%",
        maxWidth: 1450,
        margin: "20px auto",
        padding: "18px 30px",
        borderRadius: 24,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.45)",
        boxShadow: "0 20px 45px rgba(15,23,42,.12)",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: "linear-gradient(135deg,#2563EB,#60A5FA)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 30px rgba(37,99,235,.35)",
          }}
        >
          <Bus size={28} />
        </div>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            BUSINA
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#64748B",
            }}
          >
            Smarter commutes. Better journeys.
          </div>
        </div>
      </div>

      {/* CENTER — hidden under 768px via .navbar-badges media query */}
      <div className="navbar-badges">
        <Badge text="Real-Time Tracking" color="#2563EB" />
        <Badge text="AI Dispatch" color="#7C3AED" />
        <Badge text="Real-Time ETA" color="#22C55E" />
      </div>

      {/* RIGHT – now links to GitHub */}
      <a
        href="https://github.com/ALT-F4-sparkfest"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "none",
          background: "#2563EB",
          color: "white",
          padding: "13px 22px",
          borderRadius: 14,
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 15,
          boxShadow: "0 10px 24px rgba(37,99,235,.25)",
          textDecoration: "none",
        }}
      >
        <GitBranch size={18} />
        Source Code
      </a>
    </nav>
  );
}

function Badge({ text, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: `${color}15`,
        color,
        padding: "10px 16px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      <Sparkles size={15} />
      {text}
    </div>
  );
}
