// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./firebase');
const { calculateEtaToStop, calculateEtasForAllStops } = require('./eta');
const { startBunchingMonitor, activeAlerts } = require('./bunching');

const app = express();
app.use(cors());
app.use(express.json());

// GET /alerts — currently active bunching alerts
app.get('/alerts', (req, res) => {
  res.json(Object.values(activeAlerts));
});

// GET /vehicles — list active vehicles with latest position
app.get('/vehicles', async (req, res) => {
  const snapshot = await db.collection('vehicles').get();
  const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(vehicles);
});

// GET /vehicles/:id/history?from=&to= — historical pings
app.get('/vehicles/:id/history', async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  let query = db.collection('vehicles').doc(id).collection('history');

  if (from) query = query.where('timestamp', '>=', Number(from));
  if (to) query = query.where('timestamp', '<=', Number(to));

  const snapshot = await query.orderBy('timestamp').get();
  const history = snapshot.docs.map(doc => doc.data());
  res.json(history);
});

// GET /vehicles/:id/eta/:stopId — ETA to a specific stop
app.get('/vehicles/:id/eta/:stopId', async (req, res) => {
  const result = await calculateEtaToStop(req.params.id, req.params.stopId);
  res.json(result);
});

// GET /vehicles/:id/etas — ETA to all stops on the route
app.get('/vehicles/:id/etas', async (req, res) => {
  const result = await calculateEtasForAllStops(req.params.id);
  res.json(result);
});

const PORT = 3000;
startBunchingMonitor(30000); // checks every 30 seconds
app.listen(PORT, () => console.log(`API running on port ${PORT}`));