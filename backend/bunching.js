// bunching.js

const supabase = require("./supabase");
const stopsByRoute = require("./routes/stops.json");

const BUNCHING_THRESHOLD_METERS = 200;
const RESOLUTION_THRESHOLD_METERS = 500;
const MIN_SPEED_KMH = 5;
const GPS_STALE_SECONDS = 60;

const activeAlerts = {};

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

function getNearestStop(lat, lng, routeId) {
  const stops = stopsByRoute[routeId] || [];

  let nearest = null;
  let min = Infinity;

  for (const stop of stops) {
    const d = haversineMeters(lat, lng, stop.lat, stop.lng);

    if (d < min) {
      min = d;
      nearest = stop;
    }
  }

  return nearest;
}

function isAtTerminal(stopName, routeId) {
  const stops = stopsByRoute[routeId] || [];

  if (!stops.length) return false;

  return (
    stopName === stops[0].name || stopName === stops[stops.length - 1].name
  );
}

function gpsFresh(lastUpdated) {
  if (!lastUpdated) return false;

  return Date.now() - lastUpdated < GPS_STALE_SECONDS * 1000;
}

function* pairs(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      yield [list[i], list[j]];
    }
  }
}

async function detectBunching() {
  const { data, error } = await supabase.from("vehicles").select("*");

  if (error) {
    console.error(error.message);

    return {
      newAlerts: [],
      resolvedAlerts: [],
      active: [],
    };
  }

  const vehicles = data.map((v) => ({
    vehicleId: v.id,
    routeId: v.route_id,
    lat: v.lat,
    lng: v.lng,
    speed: v.speed || 0,
    lastUpdated: v.last_updated,
    stopName: getNearestStop(v.lat, v.lng, v.route_id)?.name || null,
  }));

  const routes = {};

  vehicles.forEach((v) => {
    if (!routes[v.routeId]) routes[v.routeId] = [];

    routes[v.routeId].push(v);
  });

  const newAlerts = [];
  const resolvedAlerts = [];

  for (const routeId in routes) {
    const eligible = routes[routeId].filter(
      (v) =>
        gpsFresh(v.lastUpdated) &&
        !isAtTerminal(v.stopName, routeId) &&
        v.speed >= MIN_SPEED_KMH,
    );

    for (const [a, b] of pairs(eligible)) {
      const distance = haversineMeters(a.lat, a.lng, b.lat, b.lng);

      const pairKey = [a.vehicleId, b.vehicleId].sort().join("_");

      if (distance < BUNCHING_THRESHOLD_METERS) {
        const alert = {
          alert_id: pairKey,
          route_id: routeId,

          vehicle_a: a.vehicleId,
          vehicle_b: b.vehicleId,

          distance_meters: Math.round(distance),

          nearest_stop: a.stopName || b.stopName,

          speed_a_kmh: a.speed,
          speed_b_kmh: b.speed,

          vehicle_a_lat: a.lat,
          vehicle_a_lon: a.lng,

          vehicle_b_lat: b.lat,
          vehicle_b_lon: b.lng,

          detected_at: new Date().toISOString(),

          resolved_at: null,

          status: "ACTIVE",

          message: `${a.vehicleId} and ${b.vehicleId} are bunched near ${a.stopName}.`,
        };

        activeAlerts[pairKey] = alert;

        newAlerts.push(alert);

        await supabase.from("bunching_alerts").upsert(alert, {
          onConflict: "alert_id",
        });
      } else if (
        activeAlerts[pairKey] &&
        distance > RESOLUTION_THRESHOLD_METERS
      ) {
        const resolved = {
          ...activeAlerts[pairKey],

          status: "RESOLVED",

          resolved_at: new Date().toISOString(),
        };

        resolvedAlerts.push(resolved);

        await supabase.from("bunching_alerts").upsert(resolved, {
          onConflict: "alert_id",
        });

        delete activeAlerts[pairKey];
      }
    }
  }

  return {
    newAlerts,
    resolvedAlerts,
    active: Object.values(activeAlerts),
  };
}

function startBunchingMonitor(interval = 30000) {
  console.log(`Bunching monitor running every ${interval / 1000} seconds`);

  detectBunching();

  setInterval(detectBunching, interval);
}

module.exports = {
  detectBunching,
  startBunchingMonitor,
  activeAlerts,
};
