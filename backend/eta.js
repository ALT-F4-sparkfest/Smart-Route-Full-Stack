// eta.js
const supabase = require("./supabase");
const stopsByRoute = require("./routes/stops.json");
const vehicleRoutes = require("./routes/vehicleRoutes.json");

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTrafficMultiplier(hour) {
  if (hour >= 5 && hour < 7) return 1.2;
  if (hour >= 7 && hour < 9) return 1.8;
  if (hour >= 9 && hour < 16) return 1.0;
  if (hour >= 16 && hour < 19) return 1.7;
  if (hour >= 19 && hour < 22) return 1.1;
  if (hour >= 22 && hour < 24) return 0.95;
  return 0.9;
}

function getEffectiveSpeed(currentSpeed, recentSpeeds) {
  if (currentSpeed > 1) return currentSpeed;
  if (recentSpeeds && recentSpeeds.length) {
    const avg = recentSpeeds.reduce((a, b) => a + b, 0) / recentSpeeds.length;
    return Math.max(1, avg);
  }
  return 10;
}

function shouldShowWaiting(secondsStationary, speedKmh) {
  return speedKmh < 1 && secondsStationary > 180;
}

function getStopsForVehicle(vehicleId) {
  const routeId = vehicleRoutes[vehicleId];
  return { routeId, stops: stopsByRoute[routeId] || [] };
}

async function calculateEtaToStop(vehicleId, stopId) {
  // Fetch vehicle from Supabase
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", vehicleId)
    .single();

  if (error || !vehicle) return { error: "Vehicle not found" };

  const { routeId, stops } = getStopsForVehicle(vehicleId);
  const stop = stops.find((s) => s.id === stopId);
  if (!stop) return { error: `Stop not found for route ${routeId}` };

  const distanceKm = haversineDistance(
    vehicle.lat,
    vehicle.lng,
    stop.lat,
    stop.lng,
  );

  // Supabase uses snake_case column names
  const effectiveSpeed = getEffectiveSpeed(
    vehicle.speed,
    vehicle.recent_speeds,
  );

  const secondsStationary = vehicle.stationary_since
    ? (Date.now() - vehicle.stationary_since) / 1000
    : 0;

  let status = "approaching";
  let displayText;

  if (distanceKm < 0.1) {
    status = "arriving";
    displayText = `Arriving now at ${stop.name}`;
  } else if (shouldShowWaiting(secondsStationary, vehicle.speed)) {
    status = "waiting";
    displayText = `Vehicle waiting near ${stop.name}`;
  }

  const hour = new Date().getHours();
  const multiplier = getTrafficMultiplier(hour);
  const baseMinutes = (distanceKm / effectiveSpeed) * 60;
  const etaMinutes = Math.round(baseMinutes * multiplier);

  if (!displayText) displayText = `~${etaMinutes} min to ${stop.name}`;

  const result = {
    eta_minutes: etaMinutes,
    status,
    display_text: displayText,
    confidence: vehicle.recent_speeds?.length >= 4 ? "high" : "moderate",
    distance_km: Number(distanceKm.toFixed(2)),
    timestamp: new Date().toISOString(),
  };

  // Cache ETA to Supabase
  const { error: upsertError } = await supabase.from("etas").upsert({
    vehicle_id: vehicleId,
    stop_id: stopId,
    ...result,
    last_updated: Date.now(),
  });

  if (upsertError) console.error("ETA cache write error:", upsertError.message);

  return result;
}

async function calculateEtasForAllStops(vehicleId) {
  const { stops } = getStopsForVehicle(vehicleId);
  const results = {};
  for (const stop of stops) {
    results[stop.id] = await calculateEtaToStop(vehicleId, stop.id);
  }
  return results;
}

module.exports = { calculateEtaToStop, calculateEtasForAllStops };
