// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const db = require("./firebase");
const { calculateEtaToStop, calculateEtasForAllStops } = require("./eta");
const { isOnRoute } = require("./geofence");
const geofenceData = require("./routes/geofence.json");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://smart-route-full-stack.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("subscribe-vehicle", (vehicleId) => {
    socket.join(`vehicle-${vehicleId}`);
    console.log(`📡 Client subscribed to vehicle ${vehicleId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

function broadcastVehicleUpdate(vehicleData) {
  io.emit("vehicle-update", vehicleData);
  console.log(`📤 Broadcasted update for ${vehicleData.id}`);
}

// ── MQTT Subscriber (now lives in the SAME process as Socket.IO) ──
const mqttHost = process.env.MQTT_HOST || "broker.hivemq.com";
const mqttPort = process.env.MQTT_PORT || 1883;
const mqttClient = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`, {
  username: process.env.MQTT_SUB_USER || "",
  password: process.env.MQTT_SUB_PASS || "",
});

mqttClient.on("connect", () => {
  console.log("✅ MQTT subscriber connected");
  mqttClient.subscribe("jeepney/+/location");
});

mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { vehicleId, lat, lng, speed, heading, timestamp } = data;

    const onRoute = isOnRoute(lat, lng, geofenceData.coordinates);

    const vehicleRef = db.collection("vehicles").doc(vehicleId);
    const vehicleDoc = await vehicleRef.get();
    const existing = vehicleDoc.exists ? vehicleDoc.data() : {};

    const recentSpeeds = [...(existing.recentSpeeds || []), speed].slice(-4);

    let stationarySince = existing.stationarySince || null;
    if (speed < 1) {
      if (!stationarySince) stationarySince = timestamp;
    } else {
      stationarySince = null;
    }

    await vehicleRef.set(
      {
        lat,
        lng,
        speed,
        heading,
        lastUpdated: timestamp,
        recentSpeeds,
        stationarySince,
        onRoute,
      },
      { merge: true },
    );

    await vehicleRef
      .collection("history")
      .add({ lat, lng, speed, heading, timestamp, onRoute });

    console.log(`Saved ping for ${vehicleId} (onRoute: ${onRoute})`);

    broadcastVehicleUpdate({
      id: vehicleId,
      lat,
      lng,
      speed: speed || 0,
      onRoute,
      heading: heading || 0,
      lastUpdate: new Date(timestamp).toISOString(),
    });
  } catch (err) {
    console.error("Error processing MQTT message:", err);
  }
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

// ── REST routes ──
app.get("/vehicles", async (req, res) => {
  const snapshot = await db.collection("vehicles").get();
  const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(vehicles);
});

app.get("/vehicles/:id/history", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;
  let query = db.collection("vehicles").doc(id).collection("history");
  if (from) query = query.where("timestamp", ">=", Number(from));
  if (to) query = query.where("timestamp", "<=", Number(to));
  const snapshot = await query.orderBy("timestamp").get();
  res.json(snapshot.docs.map((doc) => doc.data()));
});

app.get("/vehicles/:id/eta/:stopId", async (req, res) => {
  res.json(await calculateEtaToStop(req.params.id, req.params.stopId));
});

app.get("/vehicles/:id/etas", async (req, res) => {
  res.json(await calculateEtasForAllStops(req.params.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`🔌 Socket.IO enabled`);
});
