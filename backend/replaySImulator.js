require("dotenv").config();

const mqtt = require("mqtt");
const data = require("./routes/multiroute_data.json");

const client = mqtt.connect(
  `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    username: process.env.MQTT_PUB_USER,
    password: process.env.MQTT_PUB_PASS,
  },
);

// Group records by timestamp
const byTimestamp = {};

for (const record of data) {
  if (!byTimestamp[record.timestamp]) {
    byTimestamp[record.timestamp] = [];
  }

  byTimestamp[record.timestamp].push(record);
}

const timestamps = Object.keys(byTimestamp)
  .map(Number)
  .sort((a, b) => a - b);

const TICK_MS = 1000;

let index = 0;

client.on("connect", () => {
  console.log("Replay Simulator connected to MQTT");
  console.log(`Loaded ${timestamps.length} snapshots`);

  setInterval(() => {
    const ts = timestamps[index % timestamps.length];
    const snapshot = byTimestamp[ts];

    snapshot.forEach((record) => {
      const payload = {
        vehicleId: record.vehicleId,
        lat: record.lat,
        lng: record.lng,
        speed: record.speed,
        heading: record.heading || 90,
        timestamp: Date.now(),
      };

      client.publish(
        `jeepney/${record.vehicleId}/location`,
        JSON.stringify(payload),
      );
    });

    console.log(
      `Published snapshot ${index + 1}/${timestamps.length} (${snapshot.length} vehicles)`,
    );

    index++;
  }, TICK_MS);
});
