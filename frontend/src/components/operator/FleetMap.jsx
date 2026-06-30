// src/components/operator/FleetMap.jsx

import LiveMap from "../map/LiveMap";
import WaitingMarker from "./WaitingMarker";

export default function FleetMap({
  vehicles = [],
  waitingCommuters = [],
  onVehicleSelect,
}) {
  return (
    <section
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Live Fleet Map
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            {vehicles.length} active vehicles tracked
          </p>
        </div>

        <div
          style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "6px 14px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          ● Live
        </div>
      </div>

      <div
        style={{
          height: 550,
          overflow: "hidden",
          borderRadius: 18,
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
    </section>
  );
}
