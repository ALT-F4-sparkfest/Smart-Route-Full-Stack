// src/components/landing/Hero.jsx

import { Bus, MapPinned, Building2 } from "lucide-react";
import Button from "../ui/Button";
import FadeIn from "../ui/FadeIn";

export default function Hero() {
  return (
    <section className="hero">
      <FadeIn>
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
            <Button>
              <Bus size={18} />
              Find My Ride
            </Button>

            <Button variant="secondary">
              <Building2 size={18} />
              Operator Dashboard
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="hero-preview">
          <div className="hero-map-card">
            <div className="map-header">
              <MapPinned size={18} />
              <span>Live Vehicle Map</span>
            </div>

            <div className="map-placeholder">
              <div className="bus bus-1">
                <Bus size={30} />
              </div>

              <div className="bus bus-2">
                <Bus size={30} />
              </div>

              <div className="bus bus-3">
                <Bus size={30} />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
