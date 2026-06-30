import { Bus, Building2 } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Bus size={34} strokeWidth={2.5} />
        <span className="logo-text">BUSINA</span>
      </div>

      <div className="navbar-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#about">About</a>
      </div>

      <Button variant="secondary">
        <Building2 size={18} />
        Operator Login
      </Button>
    </nav>
  );
}
