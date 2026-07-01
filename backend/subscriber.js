require("dotenv").config();

const mqtt = require("mqtt");
const supabase = require("./supabase");

const { isOnRoute } = require("./geofence");
const geofenceByRoute = require("./routes/geofence.json");
const vehicleRoutes = require("./routes/vehicleRoutes.json");

const localState = {};

const client = mqtt.connect(
  `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    username: process.env.MQTT_SUB_USER,
    password: process.env.MQTT_SUB_PASS,
  },
);

client.on("connect", () => {
  console.log("✅ Subscriber connected to MQTT");

  client.subscribe("jeepney/+/location", (err) => {
    if (err) {
      console.error("❌ Failed to subscribe:", err.message);
    } else {
      console.log("✅ Subscribed to jeepney/+/location");
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const { vehicleId, lat, lng, speed, heading, timestamp } = data;

    console.log(`📩 ${topic} -> ${vehicleId}`);

    const routeId = vehicleRoutes[vehicleId];

    if (!routeId) {
      console.warn(`⚠ Unknown vehicle: ${vehicleId}`);
      return;
    }

    const geofence = geofenceByRoute[routeId];

    const onRoute = geofence ? isOnRoute(lat, lng, geofence.coordinates) : null;

    if (!localState[vehicleId]) {
      localState[vehicleId] = {
        recentSpeeds: [],
        stationarySince: null,
      };
    }

    const state = localState[vehicleId];

    state.recentSpeeds.push(speed);

    if (state.recentSpeeds.length > 4) {
      state.recentSpeeds.shift();
    }

    if (speed < 1) {
      if (!state.stationarySince) {
        state.stationarySince = timestamp;
      }
    } else {
      state.stationarySince = null;
    }

    const vehicle = {
      id: vehicleId,

      route_id: routeId,

      lat,
      lng,

      speed,
      heading,

      last_updated: timestamp,

      recent_speeds: [...state.recentSpeeds],

      stationary_since: state.stationarySince,

      on_route: onRoute,
    };

    const { error } = await supabase.from("vehicles").upsert(vehicle);

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return;
    }

    console.log(
      `✅ Updated ${vehicleId} (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
    );
  } catch (err) {
    console.error("❌ Subscriber error:", err.message);
  }
});

client.on("error", (err) => {
  console.error("❌ MQTT Error:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
