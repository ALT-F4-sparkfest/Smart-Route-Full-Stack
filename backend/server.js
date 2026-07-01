require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Import Supabase and ETA
const supabase = require("./supabase");
const { calculateEtaToStop, calculateEtasForAllStops } = require("./eta");

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

global.io = io;

// --- Socket.IO ---
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial snapshot from Supabase (with error handling)
  (async () => {
    try {
      const { data, error } = await supabase.from("vehicles").select("*");
      if (error) throw error;
      if (data?.length) socket.emit("vehicle_snapshot", data);
    } catch (err) {
      console.warn("⚠️ Snapshot skipped (Supabase unavailable):", err.message);
    }
  })();

  socket.on("subscribe-vehicle", (vehicleId) => {
    socket.join(`vehicle-${vehicleId}`);
    console.log(`📡 Client subscribed to vehicle ${vehicleId}`);
  });

  socket.on("commuter-waiting", (payload) => {
    console.log("🚏 Commuter waiting:", payload);
    io.emit("waiting-update", payload);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Broadcast update function (called by subscriber)
global.broadcastVehicleUpdate = (vehicleData) => {
  if (global.io) {
    global.io.emit("vehicle_update", vehicleData);
    console.log(`📤 Broadcasted update for ${vehicleData.id}`);
  }
};

// --- REST endpoints ---

app.get("/", (req, res) => {
  res.json({ status: "BUSINA API running" });
});

// Get all vehicles (live from Supabase)
app.get("/vehicles", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("last_updated", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// Get vehicle history (placeholder)
app.get("/vehicles/:id/history", (req, res) => {
  res.json([]);
});

// ✅ REAL ETA endpoint
app.get("/vehicles/:id/eta/:stopId", async (req, res) => {
  const { id, stopId } = req.params;

  try {
    const result = await calculateEtaToStop(id, stopId);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    console.error("ETA error:", err);
    res.status(500).json({ error: "Failed to calculate ETA" });
  }
});

// Get ETAs for all stops of a vehicle
app.get("/vehicles/:id/etas", async (req, res) => {
  const { id } = req.params;

  try {
    const results = await calculateEtasForAllStops(id);
    res.json(results);
  } catch (err) {
    console.error("ETAs error:", err);
    res.status(500).json({ error: "Failed to calculate ETAs" });
  }
});

// Endpoint for commuter waiting (already exists)
app.post("/commuter/waiting", (req, res) => {
  console.log("POST /commuter/waiting", req.body);
  io.emit("waiting-update", req.body);
  res.json({ status: "ok" });
});

// Serve route geofence data for frontend
app.get("/routes/:routeId/geofence", (req, res) => {
  const { routeId } = req.params;
  try {
    const geofence = require("./routes/geofence.json");
    const coordinates = geofence[routeId]?.coordinates;
    if (!coordinates) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json({ routeId, coordinates });
  } catch (err) {
    res.status(500).json({ error: "Failed to load geofence" });
  }
});

// ─── PATCH 2: Alerts endpoint ───────────────────────────────────────────
// In-memory alert log — subscriber.js pushes here when anomalies detected
const alertLog = [];
global.pushAlert = (alert) => {
  alertLog.unshift({ ...alert, timestamp: new Date().toISOString() });
  if (alertLog.length > 50) alertLog.pop();
  if (global.io) global.io.emit("alert", alert);
};

app.get("/alerts", (req, res) => {
  res.json(alertLog);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`🔌 Socket.IO enabled`);
  // Start MQTT subscriber
  require("./subscriber");
});
