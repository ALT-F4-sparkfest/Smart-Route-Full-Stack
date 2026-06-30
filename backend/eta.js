// eta.js
const db = require('./firebase');
const stops = require('./routes/stops.json');

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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

function getEffectiveSpeed(currentSpeed, last2MinSpeeds) {
  if (currentSpeed > 1) return currentSpeed;
  if (last2MinSpeeds && last2MinSpeeds.length) {
    const avg = last2MinSpeeds.reduce((a, b) => a + b, 0) / last2MinSpeeds.length;
    return Math.max(1, avg);
  }
  return 10;
}

function shouldShowWaiting(secondsStationary, speedKmh) {
  return speedKmh < 1 && secondsStationary > 180;
}

async function calculateEtaToStop(vehicleId, stopId) {
  const vehicleDoc = await db.collection('vehicles').doc(vehicleId).get();
  if (!vehicleDoc.exists) return { error: 'Vehicle not found' };

  const vehicle = vehicleDoc.data();
  const stop = stops.find(s => s.id === stopId);
  if (!stop) return { error: 'Stop not found' };

  const distanceKm = haversineDistance(vehicle.lat, vehicle.lng, stop.lat, stop.lng);
  const effectiveSpeed = getEffectiveSpeed(vehicle.speed, vehicle.recentSpeeds);

  const secondsStationary = vehicle.stationarySince
    ? (Date.now() - vehicle.stationarySince) / 1000
    : 0;

  let status = 'approaching';
  let displayText;

  if (distanceKm < 0.1) {
    status = 'arriving';
    displayText = `Arriving now at ${stop.name}`;
  } else if (shouldShowWaiting(secondsStationary, vehicle.speed)) {
    status = 'waiting';
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
    confidence: vehicle.recentSpeeds?.length >= 4 ? 'high' : 'moderate',
    distance_km: Number(distanceKm.toFixed(2)),
    timestamp: new Date().toISOString(),
  };

  await db.collection('etas').doc(vehicleId).collection('stops').doc(stopId).set({
    ...result,
    last_updated: Date.now(),
  });

  return result;
}

async function calculateEtasForAllStops(vehicleId) {
  const results = {};
  for (const stop of stops) {
    results[stop.id] = await calculateEtaToStop(vehicleId, stop.id);
  }
  return results;
}

module.exports = { calculateEtaToStop, calculateEtasForAllStops };