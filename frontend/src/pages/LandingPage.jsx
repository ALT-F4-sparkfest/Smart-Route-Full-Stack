// src/pages/LandingPage.jsx
import { useState } from "react";
import Modal from "../components/Modal";

export default function LandingPage({ setActiveView }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-badge">🚌 LIVE TRACKING</div>
        <h1 className="hero-title">BUSINA</h1>
        <p className="hero-tagline">"Smarter Commutes. Better Journeys."</p>
        <p className="hero-description">
          Real-time jeepney and bus tracking for Metro Manila. Know when your
          ride arrives. Never wait in uncertainty again.
        </p>
        <button className="learn-more-btn" onClick={() => setShowAbout(true)}>
          Learn More About BUSINA
        </button>
      </div>

      {/* CTA Buttons */}
      <div className="cta-grid">
        <button
          className="cta-button primary"
          onClick={() => setActiveView("commuter")}
        >
          <span className="cta-icon">📍</span>
          <div>
            <div className="cta-label">I'm a Commuter</div>
            <div className="cta-sub">Track my ride</div>
          </div>
        </button>
        <button
          className="cta-button secondary"
          onClick={() => setActiveView("operator")}
        >
          <span className="cta-icon">📊</span>
          <div>
            <div className="cta-label">I'm an Operator</div>
            <div className="cta-sub">Manage my fleet</div>
          </div>
        </button>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📍</div>
            <h3>Find Your Stop</h3>
            <p>Locate your nearest jeepney or bus stop on the map.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🚌</div>
            <h3>Track Your Ride</h3>
            <p>See real-time vehicle locations and estimated arrival times.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>Arrive on Time</h3>
            <p>Get notifications when your ride is approaching.</p>
          </div>
        </div>
      </div>

      {/* Available Routes */}
      <div className="routes-section">
        <h2 className="section-title">Available Routes</h2>
        <div className="routes-grid">
          <div className="route-card">🚌 Cubao ↔ Makati</div>
          <div className="route-card">🚌 Cubao ↔ Divisoria</div>
          <div className="route-card">🚌 Cubao ↔ Marikina</div>
          <div className="route-card">🚌 Cubao ↔ Pasig</div>
          <div className="route-card">🚌 Cubao ↔ San Juan</div>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>© 2026 BUSINA. Built for a smarter commute.</p>
      </div>

      {/* ABOUT MODAL */}
      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="About BUSINA"
      >
        <p>
          <strong>BUSINA</strong> is a real-time public transport tracking
          platform designed for Metro Manila commuters and operators. We combine
          IoT devices, GPS, and AI to provide accurate ETAs, demand insights,
          and fleet management tools.
        </p>
        <p>
          <strong>Why "BUSINA"?</strong> It means "honk" in Filipino – a call to
          attention for smarter commuting.
        </p>
        <p>
          <strong>Our Mission:</strong> To make every biyahe predictable, safe,
          and efficient.
        </p>
        <p>
          <strong>How we do it:</strong> Each participating vehicle is equipped
          with a GPS tracker. Data is processed by AI to predict arrival times
          and identify demand hotspots. Commuters get live updates, operators
          get actionable insights.
        </p>
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#888" }}>
          Built with ❤️ for the 2026 Hackathon.
        </p>
      </Modal>
    </div>
  );
}
