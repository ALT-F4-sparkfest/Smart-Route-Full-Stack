// replaySimulator.js
require('dotenv').config();
const mqtt = require('mqtt');
const data = require('./routes/multiroute_data.json');

const client = mqtt.connect(`mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
  username: process.env.MQTT_PUB_USER,
  password: process.env.MQTT_PUB_PASS,
});

// Group records by timestamp so each "tick" publishes one snapshot of all vehicles at once
const byTimestamp = {};
for (const r of data) {
  byTimestamp[r.timestamp] = byTimestamp[r.timestamp] || [];
  byTimestamp[r.timestamp].push(r);
}
const timestamps = Object.keys(byTimestamp).map(Number).sort((a, b) => a - b);

let index = 0;
const TICK_MS = 1000; 

client.on('connect', () => {
  console.log(`Replay simulator connected to MQTT. ${timestamps.length} snapshots loaded.`);

  setInterval(() => {
    const ts = timestamps[index % timestamps.length];
    const snapshot = byTimestamp[ts];

    for (const record of snapshot) {
      const payload = {
        vehicleId: record.vehicleId,
        lat: record.lat,
        lng: record.lng,
        speed: record.speed,
        heading: 90,
        timestamp: Date.now(), // use current time so freshness checks (bunching, etc.) pass
      };
      client.publish(`jeepney/${record.vehicleId}/location`, JSON.stringify(payload));
    }

    console.log(`Published snapshot ${index + 1}/${timestamps.length} (${snapshot.length} vehicles, original ts: ${new Date(ts).toISOString()})`);
    index++;
  }, TICK_MS);
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});