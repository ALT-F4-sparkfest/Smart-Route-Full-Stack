import Navbar from "../components/landing/Navbar";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import Hero from "../components/layout/Hero";

export default function LandingPage({ setActiveView }) {
  return (
    <>
      <Navbar />
      <Hero setActiveView={setActiveView} />
      <Stats />
      <Features />
    </>
  );
}
