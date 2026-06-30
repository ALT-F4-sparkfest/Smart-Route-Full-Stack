// src/components/commuter/BottomSheet.jsx

import Card from "../ui/Card";
import Button from "../ui/Button";
import { Clock3, Bus, Users, Navigation, Route } from "lucide-react";

export default function BottomSheet({ nearest = [], eta, waiting, onWait }) {
  const vehicle = nearest[0];

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 30,
      }}
    >
      <Card
        style={{
          borderRadius: 28,
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 20px 45px rgba(0,0,0,.18)",
          padding: 24,
        }}
      >
        <div
          style={{
            width: 52,
            height: 5,
            borderRadius: 999,
            background: "#CBD5E1",
            margin: "0 auto 18px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
              }}
            >
              Nearest Vehicle
            </div>

            <h2
              style={{
                margin: "4px 0",
                fontSize: 24,
              }}
            >
              {vehicle?.plate || vehicle?.id || "No Vehicle"}
            </h2>
          </div>

          <div
            style={{
              background: "#DBEAFE",
              color: "#2563EB",
              padding: "10px 14px",
              borderRadius: 14,
              fontWeight: 700,
            }}
          >
            🚐
          </div>
        </div>

        {vehicle ? (
          <>
            <Info
              icon={<Route size={18} />}
              label="Route"
              value={vehicle.route}
            />

            <Info
              icon={<Clock3 size={18} />}
              label="ETA"
              value={`${eta?.eta_minutes ?? vehicle.eta ?? "--"} mins`}
            />

            <Info
              icon={<Navigation size={18} />}
              label="Destination"
              value={vehicle.destination}
            />

            <Info
              icon={<Users size={18} />}
              label="Passengers"
              value={vehicle.passengers}
            />

            <div
              style={{
                marginTop: 20,
                background: "#F1F5F9",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "75%",
                  height: 10,
                  background: "linear-gradient(90deg,#2563EB,#60A5FA)",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Estimated Occupancy
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "20px 0",
              textAlign: "center",
              color: "#64748B",
            }}
          >
            No nearby vehicle found.
          </div>
        )}

        <Button
          onClick={onWait}
          style={{
            width: "100%",
            marginTop: 22,
            borderRadius: 18,
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            background: waiting
              ? "#22C55E"
              : "linear-gradient(135deg,#2563EB,#3B82F6)",
            color: "white",
            border: "none",
          }}
        >
          {waiting ? "✓ Waiting Registered" : "I'm Waiting"}
        </Button>
      </Card>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#334155",
        }}
      >
        {icon}
        <strong>{label}</strong>
      </div>

      <span>{value}</span>
    </div>
  );
}
