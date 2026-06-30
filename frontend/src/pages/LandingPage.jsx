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
          "radial-gradient(circle at top left,#DBEAFE 0%,#F8FAFC 35%,#FFFFFF 100%)",
        overflow: "hidden",
      }}
    >
      <Navbar />

      <div
        style={{
          position: "fixed",
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(37,99,235,.12)",
          filter: "blur(70px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: -160,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(59,130,246,.10)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        <Hero setActiveView={setActiveView} />

        <section
          style={{
            padding: "40px 8%",
          }}
        >
          <Stats />
        </section>

        <section
          style={{
            padding: "20px 8% 90px",
          }}
        >
          <Features />
        </section>
      </main>
    </div>
  );
}
