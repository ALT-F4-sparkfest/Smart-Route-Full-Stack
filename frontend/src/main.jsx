import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/layout.css";
import "./styles/forms.css";
import "./styles/utilities.css";
import "./styles/landing.css";
import "./styles/commuter.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
