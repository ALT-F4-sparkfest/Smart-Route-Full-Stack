// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const { calculateEtaToStop, calculateEtasForAllStops } = require("./eta");

// ============ NEW: Socket.IO imports ============
const http = require("http");
const { Server } = require("socket.io");
// ================================================

const app = express();
app.use(cors());
app.use(express.json());

// ============ NEW: Create HTTP server with Socket.IO ============
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Vite dev
      "http://localhost:3000", // React dev
      "https://smart-route-full-stack.vercel.app", // Production
    ],
    methods: ["GET", "POST"],
  },
});

// Make io available globally for subscriber.js
global.io = io;

// ============ NEW: Socket.IO event handlers ============
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

// ============ NEW: Broadcast function ============
global.broadcastVehicleUpdate = (vehicleData) => {
  if (global.io) {
    global.io.emit("vehicle-update", vehicleData);
    console.log(`📤 Broadcasted update for ${vehicleData.id}`);
  }
};
// =========================================================

// GET /vehicles — list active vehicles with latest position
app.get("/vehicles", async (req, res) => {
  const snapshot = await db.collection("vehicles").get();
  const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(vehicles);
});

// GET /vehicles/:id/history?from=&to= — historical pings
app.get("/vehicles/:id/history", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  let query = db.collection("vehicles").doc(id).collection("history");

  if (from) query = query.where("timestamp", ">=", Number(from));
  if (to) query = query.where("timestamp", "<=", Number(to));

  const snapshot = await query.orderBy("timestamp").get();
  const history = snapshot.docs.map((doc) => doc.data());
  res.json(history);
});

// GET /vehicles/:id/eta/:stopId — ETA to a specific stop
app.get("/vehicles/:id/eta/:stopId", async (req, res) => {
  const result = await calculateEtaToStop(req.params.id, req.params.stopId);
  res.json(result);
});

// GET /vehicles/:id/etas — ETA to all stops on the route
app.get("/vehicles/:id/etas", async (req, res) => {
  const result = await calculateEtasForAllStops(req.params.id);
  res.json(result);
});

// ============ CHANGED: Use 'server' instead of 'app' ============
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`🔌 Socket.IO enabled`);
});
// ==============================================================
