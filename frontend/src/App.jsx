import { useState, useEffect } from "react";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import PwaUpdateToast from "./components/PwaUpdateToast";

import LandingPage from "./pages/LandingPage";
import CommuterView from "./pages/CommuterView";
import OperatorView from "./pages/OperatorView";

function App() {
  const [activeView, setActiveView] = useState("landing");

  const { updateAvailable, applyUpdate, offlineReady, dismissOfflineReady } =
    usePwaUpdate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (mode === "commuter") setActiveView("commuter");
    else if (mode === "operator") setActiveView("operator");
  }, []);

  const goLanding = () => setActiveView("landing");

  const renderView = () => {
    switch (activeView) {
      case "commuter":
        return <CommuterView onBack={goLanding} />;

      case "operator":
        return <OperatorView onBack={goLanding} />;

      default:
        return <LandingPage setActiveView={setActiveView} />;
    }
  };

  return (
    <>
      {renderView()}

      <PwaUpdateToast
        offlineReady={offlineReady}
        needRefresh={updateAvailable}
        onUpdate={applyUpdate}
        onDismissOffline={dismissOfflineReady}
      />
    </>
  );
}

export default App;
