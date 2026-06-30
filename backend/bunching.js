// bunching.js
const db = require('./firebase');
const stopsByRoute = require('./routes/stops.json');
const vehicleRoutes = require('./routes/vehicleRoutes.json');

const BUNCHING_THRESHOLD_METERS = 200;
const RESOLUTION_THRESHOLD_METERS = 500;
const MIN_SPEED_KMH = 5;
const GPS_STALE_SECONDS = 60;

// In-memory active alerts, keyed by "vehicleA_vehicleB" (alphabetical), for hysteresis
const activeAlerts = {};

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Nearest stop on the vehicle's route, used as "current stop" for terminal checks + alert messages
function getNearestStop(lat, lng, routeId) {
  const stops = stopsByRoute[routeId] || [];
  let nearest = null;
  let minDist = Infinity;
  for (const stop of stops) {
    const d = haversineMeters(lat, lng, stop.lat, stop.lng);
    if (d < minDist) {
      minDist = d;
      nearest = stop;
    }
  }
  return nearest;
}

// Treat the first and last stop in each route's stop list as terminals
// (the stop list is built in route-progression order from the GPS data)
function isAtTerminal(stopName, routeId) {
  if (!stopName) return false;
  const stops = stopsByRoute[routeId] || [];
  if (stops.length === 0) return false;
  const first = stops[0].name;
  const last = stops[stops.length - 1].name;
  return stopName === first || stopName === last;
}

function isGpsFresh(lastUpdated, nowMs, maxAgeSeconds = GPS_STALE_SECONDS) {
  if (!lastUpdated) return false;
  const ageSeconds = (nowMs - lastUpdated) / 1000;
  return ageSeconds >= 0 && ageSeconds <= maxAgeSeconds;
}

// Combinations helper (pairs of an array)
function* pairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];
    }
  }
}

async function detectBunching() {
  const nowMs = Date.now();
  const snapshot = await db.collection('vehicles').get();

  const vehicles = snapshot.docs.map(doc => {
    const data = doc.data();
    const vehicleId = doc.id;
    const routeId = vehicleRoutes[vehicleId];
    const nearestStop = getNearestStop(data.lat, data.lng, routeId);
    return {
      vehicleId,
      routeId,
      lat: data.lat,
      lng: data.lng,
      speed: data.speed || 0,
      lastUpdated: data.lastUpdated,
      stopName: nearestStop ? nearestStop.name : null,
    };
  });


  // Group by route
  const byRoute = {};
  for (const v of vehicles) {
    if (!v.routeId) continue;
    byRoute[v.routeId] = byRoute[v.routeId] || [];
    byRoute[v.routeId].push(v);
  }

  const newAlerts = [];
  const resolvedAlerts = [];

  for (const [routeId, routeVehicles] of Object.entries(byRoute)) {
  console.log(routeId, routeVehicles.map(v => ({
    id: v.vehicleId, stop: v.stopName, speed: v.speed.toFixed(1),
    atTerminal: isAtTerminal(v.stopName, v.routeId)
  })));

    const eligible = routeVehicles.filter(v =>
      isGpsFresh(v.lastUpdated, nowMs) &&
      !isAtTerminal(v.stopName, v.routeId) &&
      v.speed >= MIN_SPEED_KMH
    );

    if (eligible.length < 2) continue;

    for (const [a, b] of pairs(eligible)) {
      const distanceM = haversineMeters(a.lat, a.lng, b.lat, b.lng);
      const pairKey = [a.vehicleId, b.vehicleId].sort().join('_');

      if (distanceM < BUNCHING_THRESHOLD_METERS) {
        const nearestStop = a.stopName || b.stopName;
        const message = `${a.vehicleId} and ${b.vehicleId} are bunched near ${nearestStop}. ` +
          `Distance: ${distanceM.toFixed(0)}m. Consider holding ${b.vehicleId} at the next stop to restore spacing.`;

        const alert = {
          alert_id: `ALERT-${routeId}-${nowMs}`,
          route_id: routeId,
          vehicle_a: a.vehicleId,
          vehicle_b: b.vehicleId,
          distance_meters: Math.round(distanceM * 10) / 10,
          vehicle_a_lat: a.lat,
          vehicle_a_lon: a.lng,
          vehicle_b_lat: b.lat,
          vehicle_b_lon: b.lng,
          nearest_stop: nearestStop,
          speed_a_kmh: a.speed,
          speed_b_kmh: b.speed,
          status: 'ACTIVE',
          detected_at: new Date(nowMs).toISOString(),
          resolved_at: null,
          message,
        };

        if (!activeAlerts[pairKey]) {
          newAlerts.push(alert);
        }
        activeAlerts[pairKey] = alert;

        await db.collection('bunching_alerts').doc(alert.alert_id).set(alert);
      } else if (activeAlerts[pairKey] && distanceM > RESOLUTION_THRESHOLD_METERS) {
        const resolved = { ...activeAlerts[pairKey], status: 'RESOLVED', resolved_at: new Date(nowMs).toISOString() };
        resolvedAlerts.push(resolved);
        await db.collection('bunching_alerts').doc(resolved.alert_id).set(resolved);
        delete activeAlerts[pairKey];
      }
    }
  }

  if (newAlerts.length) {
    newAlerts.forEach(a => console.log(`BUNCHING ALERT: ${a.message}`));
  }
  if (resolvedAlerts.length) {
    resolvedAlerts.forEach(a => console.log(`ALERT RESOLVED: ${a.vehicle_a} + ${a.vehicle_b} separated`));
  }

  return { newAlerts, resolvedAlerts, active: Object.values(activeAlerts) };
}

function startBunchingMonitor(intervalMs = 30000) {
  console.log('Bunching monitor started (checking every', intervalMs / 1000, 'seconds)');
  detectBunching().catch(err => console.error('Bunching detection error:', err));
  setInterval(() => {
    detectBunching().catch(err => console.error('Bunching detection error:', err));
  }, intervalMs);
}

module.exports = { detectBunching, startBunchingMonitor, activeAlerts };