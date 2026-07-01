// src/pages/LandingPage.jsx

import { useEffect, useState } from "react";

import Navbar from "../components/landing/Navbar";
import Hero from "../components/layout/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";

export default function LandingPage({ setActiveView }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background:
          "linear-gradient(180deg,#F8FBFF 0%,#F1F5F9 40%,#FFFFFF 100%)",
        position: "relative",
      }}
    >
      {/* ---------------- BACKGROUND ---------------- */}

      {/* Top Glow */}
      <div
        style={{
          position: "fixed",
          top: -220,
          right: -180,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(37,99,235,.18),transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Bottom Glow */}
      <div
        style={{
          position: "fixed",
          bottom: -260,
          left: -220,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(59,130,246,.10),transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Floating Circle */}
      <FloatingCircle size={120} top="18%" left="6%" delay={0} opacity={0.1} />

      <FloatingCircle
        size={70}
        top="58%"
        right="12%"
        delay={2}
        opacity={0.14}
      />

      <FloatingCircle
        size={48}
        bottom="18%"
        left="28%"
        delay={4}
        opacity={0.12}
      />

      {/* ---------------- NAVBAR ---------------- */}

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background: "rgba(255,255,255,.72)",
          borderBottom: "1px solid rgba(226,232,240,.55)",
        }}
      >
        <Navbar />
      </div>

      {/* ---------------- PAGE ---------------- */}

      <main
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        {/* Hero */}

        <section
          style={{
            maxWidth: 1550,
            margin: "0 auto",
            padding: "40px 6% 30px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "1s",
          }}
        >
          <Hero setActiveView={setActiveView} />
        </section>

        {/* LIVE STATUS */}

        <section
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            padding: "0 8%",
          }}
        >
          <GlassBanner />
        </section>

        {/* STATS */}

        <section
          style={{
            maxWidth: 1500,
            margin: "50px auto",
            padding: "0 8%",
          }}
        >
          <Stats />
        </section>

        {/* FEATURES */}

        <section
          style={{
            maxWidth: 1500,
            margin: "70px auto 100px",
            padding: "0 8%",
          }}
        >
          <Features />
        </section>

        {/* FOOTER */}

        <footer
          style={{
            marginTop: 60,
            padding: "60px 8%",
            borderTop: "1px solid #E2E8F0",
            background: "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
          }}
        >
          <div
            style={{
              maxWidth: 1450,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 30,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 28,
                  color: "#0F172A",
                }}
              >
                🚌 BUSINA
              </div>

              <div
                style={{
                  marginTop: 12,
                  color: "#64748B",
                  lineHeight: 1.7,
                  maxWidth: 420,
                }}
              >
                Intelligent Public Transportation Monitoring & Passenger
                Assistance System powered by real-time GPS, AI analytics and
                live fleet management.
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
                color: "#64748B",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 10,
                }}
              >
                BUSINA Platform
              </div>

              <div>Real-time Fleet Monitoring</div>
              <div>AI Decision Support</div>
              <div>Passenger ETA Prediction</div>

              <div
                style={{
                  marginTop: 22,
                  fontSize: 13,
                  opacity: 0.7,
                }}
              >
                © 2026 BUSINA
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function GlassBanner() {
  return (
    <div
      style={{
        borderRadius: 32,
        padding: "26px 36px",
        background: "rgba(255,255,255,.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,.5)",
        boxShadow: "0 24px 70px rgba(15,23,42,.08)",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 30,
      }}
    >
      <Metric title="Fleet Status" value="LIVE" color="#22C55E" />

      <Metric title="GPS Updates" value="Real-Time" color="#2563EB" />

      <Metric title="Analytics" value="AI Enabled" color="#8B5CF6" />

      <Metric title="Platform" value="Online" color="#F59E0B" />
    </div>
  );
}

function Metric({ title, value, color }) {
  return (
    <div>
      <div
        style={{
          color: "#64748B",
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 18px ${color}`,
            animation: "pulse 2s infinite",
          }}
        />

        <div
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: "#0F172A",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function FloatingCircle({ size, top, left, right, bottom, delay, opacity }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#2563EB",
          opacity,
          top,
          left,
          right,
          bottom,
          filter: "blur(2px)",
          animation: `float 8s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes float{

          0%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(-20px);
          }

          100%{
            transform:translateY(0px);
          }

        }

        @keyframes pulse{

          0%{
            transform:scale(1);
            opacity:.7;
          }

          50%{
            transform:scale(1.35);
            opacity:1;
          }

          100%{
            transform:scale(1);
            opacity:.7;
          }

        }
      `}</style>
    </>
  );
}
