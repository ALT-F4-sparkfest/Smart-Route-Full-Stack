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
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 14px 40px rgba(15,23,42,.08)",
        border: "1px solid #E2E8F0",
        marginBottom: 28,
      }}
    >
      {/* Header */}

      <div
        style={{
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            Fleet Operations Map
          </h2>

          <div
            style={{
              fontSize: 13,
              color: "#64748B",
              marginTop: 4,
            }}
          >
            Live GPS tracking of all active jeepneys
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#ECFDF5",
            color: "#059669",
            padding: "8px 14px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22C55E",
            }}
          />
          LIVE
        </div>
      </div>

      {/* Quick Stats */}

      <div
        style={{
          display: "flex",
          gap: 18,
          padding: "14px 24px",
          borderBottom: "1px solid #F1F5F9",
          background: "#F8FAFC",
          fontSize: 14,
          color: "#475569",
        }}
      >
        <strong>{vehicles.length}</strong> Active Vehicles
        <span>|</span>
        <strong>{waitingCommuters.length}</strong> Waiting Commuters
      </div>

      {/* Map */}

      <div
        style={{
          height: 520,
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
