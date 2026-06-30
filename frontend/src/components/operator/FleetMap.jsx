// src/components/operator/FleetMap.jsx

import LiveMap from "../map/LiveMap";
import WaitingMarker from "./WaitingMarker";

export default function FleetMap({ vehicles = [], waitingCommuters = [] }) {
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
      <LiveMap vehicles={vehicles} mapId="operator-map">
        {waitingCommuters.map((person) => (
          <WaitingMarker key={person.id} person={person} />
        ))}
      </LiveMap>
    </div>
  );
}
