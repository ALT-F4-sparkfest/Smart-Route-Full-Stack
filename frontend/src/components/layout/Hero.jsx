// src/components/layout/Hero.jsx

import { Bus, MapPinned, Building2 } from "lucide-react";
import Button from "../ui/Button";

export default function Hero({ setActiveView }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">
          <MapPinned size={18} />
          Real-Time Public Transport Tracking
        </span>

        <h1 className="hero-title">
          Know exactly
          <br />
          when your ride arrives.
        </h1>

        <p className="hero-description">
          BUSINA gives commuters live vehicle tracking, accurate ETAs, and
          operators powerful fleet management—all in one platform.
        </p>

        <div className="hero-actions">
          <Button onClick={() => setActiveView("commuter")}>
            <Bus size={18} />
            Find My Ride
          </Button>

          <Button variant="secondary" onClick={() => setActiveView("operator")}>
            <Building2 size={18} />
            Operator Dashboard
          </Button>
        </div>
      </div>

      <div className="hero-preview">
        <div className="hero-map-card">
          <div className="map-header">📍 Live Fleet Status</div>

          <div
            className="map-placeholder"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 18,
              padding: 24,
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#EFF6FF",
                padding: "14px 18px",
                borderRadius: 14,
              }}
            >
              <strong>🚌 Bus 01</strong>

              <span
                style={{
                  color: "#16A34A",
                  fontWeight: 700,
                }}
              >
                ● LIVE
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#F8FAFC",
                padding: "14px 18px",
                borderRadius: 14,
              }}
            >
              <span>Passengers</span>

              <strong>24 / 32</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#F8FAFC",
                padding: "14px 18px",
                borderRadius: 14,
              }}
            >
              <span>ETA</span>

              <strong>6 mins</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#F8FAFC",
                padding: "14px 18px",
                borderRadius: 14,
              }}
            >
              <span>Average Speed</span>

              <strong>32 km/h</strong>
            </div>

            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: "#E2E8F0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "74%",
                  height: "100%",
                  background: "#2563EB",
                }}
              />
            </div>

            <small
              style={{
                color: "#64748B",
                textAlign: "center",
              }}
            >
              Live fleet telemetry updates every few seconds.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
