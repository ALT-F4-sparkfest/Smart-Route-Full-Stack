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
          <div className="map-header">📍 Live Vehicle Map</div>

          <div className="map-placeholder">
            <div className="bus bus-1">🚌</div>
            <div className="bus bus-2">🚌</div>
            <div className="bus bus-3">🚌</div>
          </div>
        </div>
      </div>
    </section>
  );
}
