// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const supabase = require("./supabase");
const { calculateEtaToStop, calculateEtasForAllStops } = require("./eta");
const { startBunchingMonitor, activeAlerts } = require("./bunching");

const app = express();
const server = http.createServer(app);

// -------------------------------
// Socket.IO
// -------------------------------

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Export io so subscriber.js can use it later
module.exports.io = io;

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// -------------------------------

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| GET /alerts
|--------------------------------------------------------------------------
*/

app.get("/alerts", (req, res) => {
  res.json(Object.values(activeAlerts));
});

/*
|--------------------------------------------------------------------------
| GET /vehicles
|--------------------------------------------------------------------------
*/

app.get("/vehicles", async (req, res) => {
  try {
    const { data, error } = await supabase.from("vehicles").select("*");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /vehicles/:id
|--------------------------------------------------------------------------
*/

app.get("/vehicles/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: "Vehicle not found",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /vehicles/:id/history
|--------------------------------------------------------------------------
*/

app.get("/vehicles/:id/history", async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    let query = supabase
      .from("history")
      .select("*")
      .eq("vehicle_id", id)
      .order("timestamp", {
        ascending: true,
      });

    if (from) query = query.gte("timestamp", Number(from));
    if (to) query = query.lte("timestamp", Number(to));

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /vehicles/:id/eta/:stopId
|--------------------------------------------------------------------------
*/

app.get("/vehicles/:id/eta/:stopId", async (req, res) => {
  try {
    const result = await calculateEtaToStop(req.params.id, req.params.stopId);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /vehicles/:id/etas
|--------------------------------------------------------------------------
*/

app.get("/vehicles/:id/etas", async (req, res) => {
  try {
    const result = await calculateEtasForAllStops(req.params.id);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Start Background Services
|--------------------------------------------------------------------------
*/

startBunchingMonitor(30000);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 API + Socket.IO running on port ${PORT}`);
});
