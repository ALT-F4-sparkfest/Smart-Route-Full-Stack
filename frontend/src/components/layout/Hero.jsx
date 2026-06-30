// src/components/layout/Hero.jsx

import { Bus, Building2, Sparkles, MapPinned } from "lucide-react";
import Button from "../ui/Button";

export default function Hero({ setActiveView }) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr .9fr",
        gap: 48,
        alignItems: "center",
        minHeight: "75vh",
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
            marginBottom: 28,
          }}
        >
          <Sparkles size={18} />
          Smart Public Transport Intelligence
        </div>

        <h1
          style={{
            fontSize: 68,
            lineHeight: 1.05,
            margin: 0,
            color: "#0F172A",
            fontWeight: 800,
          }}
        >
          BUSINA
        </h1>

        <h2
          style={{
            fontSize: 42,
            marginTop: 18,
            marginBottom: 24,
            color: "#2563EB",
            lineHeight: 1.15,
          }}
        >
          Real-Time Public
          <br />
          Transport Intelligence
        </h2>

        <p
          style={{
            maxWidth: 620,
            fontSize: 19,
            color: "#475569",
            lineHeight: 1.8,
            marginBottom: 36,
          }}
        >
          Track vehicles in real time, discover passenger demand hotspots,
          estimate arrival times, and optimize fleet operations—all from one
          intelligent platform.
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
            Commuter Mode
          </Button>

          <Button variant="secondary" onClick={() => setActiveView("operator")}>
            <Building2 size={18} />
            Operator Dashboard
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 42,
            color: "#64748B",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 30 }}>8+</h3>
            Demo Vehicles
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: 30 }}>4</h3>
            Active Routes
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: 30 }}>91%</h3>
            ETA Accuracy
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          background: "rgba(255,255,255,.9)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 25px 60px rgba(15,23,42,.12)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <strong>🚍 Live Fleet</strong>

          <span
            style={{
              color: "#22C55E",
              fontWeight: 700,
            }}
          >
            ● LIVE
          </span>
        </div>

        <div
          style={{
            background: "#EFF6FF",
            borderRadius: 18,
            padding: 20,
            marginBottom: 18,
          }}
        >
          <strong>🚌 BUS-01</strong>

          <div
            style={{
              color: "#64748B",
              marginTop: 8,
            }}
          >
            Cubao → Katipunan
          </div>
        </div>

        <Row title="ETA" value="6 mins" />
        <Row title="Passengers" value="24 / 32" />
        <Row title="Speed" value="31 km/h" />
        <Row title="Status" value="On Route" />

        <div
          style={{
            marginTop: 28,
            height: 12,
            background: "#E2E8F0",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "78%",
              height: "100%",
              background: "#2563EB",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#64748B",
          }}
        >
          <MapPinned size={18} />
          Live vehicle telemetry simulation
        </div>
      </div>
    </section>
  );
}

function Row({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <span style={{ color: "#64748B" }}>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}
