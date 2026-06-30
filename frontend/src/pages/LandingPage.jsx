// src/pages/LandingPage.jsx

import Navbar from "../components/landing/Navbar";
import Hero from "../components/layout/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";

export default function LandingPage({ setActiveView }) {
  return (
    <div className="landing-page">
      <Navbar />

      <main className="landing-container">
        <Hero setActiveView={setActiveView} />

        <section className="landing-section">
          <Stats />
        </section>

        <section className="landing-section">
          <Features />
        </section>
      </main>
    </div>
  );
}
