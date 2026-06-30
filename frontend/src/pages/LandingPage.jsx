// src/pages/LandingPage.jsx

import Navbar from "../components/landing/Navbar";
import Hero from "../components/layout/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";

export default function LandingPage({ setActiveView }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#EFF6FF 0%,#FFFFFF 45%,#DBEAFE 100%)",
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* HERO */}

        <Hero setActiveView={setActiveView} />

        {/* QUICK ACCESS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 24,
            marginTop: 50,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(18px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 20px 50px rgba(15,23,42,.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              🚌
            </div>

            <h2
              style={{
                marginTop: 0,
                fontSize: 28,
              }}
            >
              I'm a Commuter
            </h2>

            <p
              style={{
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Track nearby jeepneys, estimate arrival time and register your
              waiting location instantly.
            </p>

            <button
              onClick={() => setActiveView("commuter")}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 16,
                border: "none",
                borderRadius: 16,
                background: "#2563EB",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open Commuter Mode
            </button>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(18px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 20px 50px rgba(15,23,42,.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              📊
            </div>

            <h2
              style={{
                marginTop: 0,
                fontSize: 28,
              }}
            >
              I'm an Operator
            </h2>

            <p
              style={{
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Monitor fleet movement, passenger demand hotspots and receive AI
              dispatch recommendations.
            </p>

            <button
              onClick={() => setActiveView("operator")}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 16,
                border: "none",
                borderRadius: 16,
                background: "#0F172A",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open Operator Dashboard
            </button>
          </div>
        </div>

        {/* EXISTING SECTIONS */}

        <section style={{ marginBottom: 60 }}>
          <Stats />
        </section>

        <section>
          <Features />
        </section>
      </main>
    </div>
  );
}
