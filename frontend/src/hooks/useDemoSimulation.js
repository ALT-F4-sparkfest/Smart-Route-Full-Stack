// src/hooks/useDemoSimulation.js

import { useEffect, useRef, useState } from "react";

import {
  demoVehicles,
  demoAlerts,
  demoWaiters,
  demoHistoryMetrics,
} from "../data/demoData";

const TICK_MS = 2500;

const STATUS_POOL = [
  "On Route",
  "On Route",
  "On Route",
  "Delayed",
  "Bunching Risk",
];

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function stepVehicle(vehicle) {
  const moving = vehicle.status !== "Delayed" && vehicle.speed > 0;

  const drift = moving ? 1 : 0.08;

  const rad = (vehicle.heading * Math.PI) / 180;

  const latDelta = Math.cos(rad) * 0.0002 * drift;

  const lngDelta = Math.sin(rad) * 0.00015 * drift;

  const speed = clamp(
    vehicle.speed + randomBetween(-3, 3),
    vehicle.status === "Delayed" ? 0 : 5,
    45,
  );

  const [current, capacity] = vehicle.passengers
    .split("/")
    .map((n) => parseInt(n));

  const nextPassengers = clamp(
    current + Math.round(randomBetween(-1, 1)),
    0,
    capacity,
  );

  const eta =
    vehicle.eta <= 1 ? Math.round(randomBetween(8, 16)) : vehicle.eta - 1;

  const status =
    Math.random() < 0.06
      ? STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)]
      : vehicle.status;

  return {
    ...vehicle,

    lat: vehicle.lat + latDelta,

    lng: vehicle.lng + lngDelta,

    speed: status === "Delayed" ? 0 : Math.round(speed),

    eta,

    status,

    passengers: `${nextPassengers} / ${capacity}`,

    heading: (vehicle.heading + randomBetween(-4, 4) + 360) % 360,
  };
}

function generateAlert(vehicles) {
  if (Math.random() > 0.12) return null;

  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

  const templates = [
    {
      type: "bunching-alert",
      severity: "warning",
      message: `${vehicle.plate} is bunching with another vehicle.`,
    },
    {
      type: "delay-alert",
      severity: "danger",
      message: `${vehicle.plate} is running behind schedule.`,
    },
    {
      type: "demand-alert",
      severity: "info",
      message: `Demand spike near ${vehicle.destination}.`,
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: `alert-${Date.now()}`,

    timestamp: Date.now(),

    route: vehicle.route,

    ...template,
  };
}

export function useDemoSimulation(options = {}) {
  const maxAlerts = options.maxAlerts ?? 6;

  const [vehicles, setVehicles] = useState(demoVehicles);

  const [alerts, setAlerts] = useState(demoAlerts);

  const [waiters, setWaiters] = useState(demoWaiters);

  const [metrics, setMetrics] = useState(demoHistoryMetrics);

  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;

      setVehicles((prevVehicles) => {
        const updated = prevVehicles.map(stepVehicle);

        const alert = generateAlert(updated);

        if (alert) {
          setAlerts((prev) => [alert, ...prev].slice(0, maxAlerts));
        }

        return updated;
      });

      setWaiters((prev) =>
        prev.map((spot) => ({
          ...spot,

          waiting: clamp(
            spot.waiting + Math.round(randomBetween(-2, 3)),
            0,
            40,
          ),
        })),
      );

      if (tickRef.current % 4 === 0) {
        setMetrics((prev) => ({
          ...prev,

          totalTripsToday:
            prev.totalTripsToday + Math.round(randomBetween(0, 2)),

          totalPassengersToday:
            prev.totalPassengersToday + Math.round(randomBetween(3, 9)),
        }));
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [maxAlerts]);

  return {
    vehicles,

    alerts,

    waiters,

    metrics,
  };
}
