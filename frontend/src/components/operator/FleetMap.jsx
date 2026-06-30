// src/components/operator/FleetMap.jsx

import LiveMap from "../map/LiveMap";
import WaitingMarker from "./WaitingMarker";

import { Bus, Users, Activity, LocateFixed } from "lucide-react";

export default function FleetMap({
  vehicles = [],
  waitingCommuters = [],
  onVehicleSelect,
}) {
  return (
    <div
      style={{
        position: "relative",
        height: 500,
        borderRadius: 22,
        overflow: "hidden",
        marginBottom: 30,
        boxShadow: "0 14px 40px rgba(15,23,42,.15)",
        border: "1px solid #E2E8F0",
      }}
    >
      {/* Live Badge */}

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
          background: "white",
          borderRadius: 14,
          padding: "12px 16px",
          boxShadow: "0 10px 24px rgba(0,0,0,.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          <Activity size={18} color="#22C55E" />
          LIVE TRACKING
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#64748B",
            marginTop: 4,
          }}
        >
          {vehicles.length} Vehicles Online
        </div>
      </div>

      {/* Legend */}

      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 18,
          zIndex: 100,
          background: "white",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,.15)",
          minWidth: 190,
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: 12,
          }}
        >
          Map Legend
        </strong>

        <Legend color="#2563EB" icon={<Bus size={15} />} text="Fleet Vehicle" />

        <Legend
          color="#EF4444"
          icon={<Users size={15} />}
          text="Waiting Hotspot"
        />

        <Legend color="#22C55E" icon={<Activity size={15} />} text="Online" />
      </div>

      {/* Demo Badge */}

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 100,
          background: "#2563EB",
          color: "white",
          padding: "10px 18px",
          borderRadius: 999,
          fontWeight: 600,
          boxShadow: "0 8px 20px rgba(0,0,0,.18)",
        }}
      >
        DEMO MODE
      </div>

      {/* Center Button */}

      <button
        style={{
          position: "absolute",
          right: 18,
          bottom: 18,
          zIndex: 100,
          border: "none",
          borderRadius: "50%",
          width: 54,
          height: 54,
          background: "#fff",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,.18)",
        }}
      >
        <LocateFixed />
      </button>

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

function Legend({ color, icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: color,
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </div>

      <span>{text}</span>
    </div>
  );
}
