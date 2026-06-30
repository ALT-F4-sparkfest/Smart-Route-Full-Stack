// src/components/operator/FleetMap.jsx

import LiveMap from "../map/LiveMap";
import WaitingMarker from "./WaitingMarker";

export default function FleetMap({
  vehicles = [],
  waitingCommuters = [],
  onVehicleSelect,
}) {
  return (
    <div
      style={{
        height: 420,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 24,
        boxShadow: "0 12px 40px rgba(0,0,0,.12)",
      }}
    >
      <LiveMap
        vehicles={vehicles}
        mapId="operator-map"
        showPopup={false}
        onVehicleSelect={onVehicleSelect}
      >
        {waitingCommuters.map((person, index) => (
          <WaitingMarker key={person.id || index} person={person} />
        ))}
      </LiveMap>
    </div>
  );
}
