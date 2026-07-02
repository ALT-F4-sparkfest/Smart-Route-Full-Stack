import { Bus, Building2, MapPinned, ArrowRight, Sparkles } from "lucide-react";
import Button from "../ui/Button";

export default function Hero({ setActiveView }) {
  return (
    <section
      className="hero-grid"
      style={{
        minHeight: "90vh",
        padding: "70px 8%",
        background:
          "linear-gradient(135deg,#EEF6FF 0%,#FFFFFF 45%,#DCEBFF 100%)",
      }}
    >
      {/* LEFT */}

      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 999,
            background: "#DBEAFE",
            color: "#2563EB",
            fontWeight: 700,
            marginBottom: 26,
          }}
        >
          <Sparkles size={18} />
          Smart Public Transport Intelligence
        </div>

        <h1 className="hero-h1">BUSINA</h1>

        <h2 className="hero-h2">Smarter commutes. Better journeys.</h2>

        <p
          style={{
            fontSize: 20,
            color: "#475569",
            lineHeight: 1.8,
            maxWidth: 640,
            marginBottom: 40,
          }}
        >
          A smart mobility platform that helps commuters find rides faster while
          giving operators live fleet visibility, intelligent dispatch
          recommendations, and demand-driven decision support.
        </p>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <Button onClick={() => setActiveView("commuter")}>
            <Bus size={18} />
            I'm a Commuter
          </Button>

          <Button variant="secondary" onClick={() => setActiveView("operator")}>
            <Building2 size={18} />
            I'm an Operator
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 42,
            color: "#64748B",
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          <span>🚍 Live Fleet Tracking</span>
          <span>🧠 AI Dispatch</span>
          <span>📍 Real-Time ETA</span>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(18px)",
          borderRadius: 28,
          padding: 34,
          boxShadow: "0 25px 70px rgba(37,99,235,.18)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#0F172A",
            }}
          >
            🚍 Live Fleet Status
          </h2>

          <div
            style={{
              background: "#DCFCE7",
              color: "#15803D",
              padding: "6px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ● DEMO LIVE
          </div>
        </div>

        {[
          ["Vehicles Online", "18"],
          ["Passengers Today", "1,248"],
          ["Average ETA", "5 mins"],
          ["Average Speed", "31 km/h"],
          ["AI Confidence", "97%"],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "18px 0",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <span style={{ color: "#475569" }}>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}

        <div
          style={{
            marginTop: 26,
            background: "#F8FAFC",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Fleet Health
          </div>
          <div
            style={{
              height: 10,
              background: "#E2E8F0",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "94%",
                height: "100%",
                background: "linear-gradient(90deg,#2563EB,#60A5FA)",
              }}
            />
          </div>
          <small
            style={{
              display: "block",
              marginTop: 10,
              color: "#64748B",
            }}
          >
            Fleet operating normally.
          </small>
        </div>

        {/* ✅ Only change: added onClick to this button */}
        <button
          onClick={() => alert("Feature coming in a future update")}
          style={{
            width: "100%",
            marginTop: 28,
            padding: 16,
            borderRadius: 16,
            border: "none",
            background: "#2563EB",
            color: "#fff",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          Explore Live Demo
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
