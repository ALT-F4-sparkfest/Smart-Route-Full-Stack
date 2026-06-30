// simulator.js
require('dotenv').config();
const mqtt = require('mqtt');

const route = [
  { lat: 14.5786, lng: 121.0930 },
  { lat: 14.5780, lng: 121.0950 },
  { lat: 14.5770, lng: 121.0970 },
];

const client = mqtt.connect(`mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
  username: process.env.MQTT_PUB_USER,
  password: process.env.MQTT_PUB_PASS,
});

const vehicleId = 'CUBAO-MAKATI-V1';
let index = 0;

client.on('connect', () => {
  console.log('Simulator connected to MQTT');

  setInterval(() => {
    const point = route[index % route.length];``
    const payload = {
      vehicleId,
      lat: point.lat + (Math.random() - 0.5) * 0.0005, // small jitter
      lng: point.lng + (Math.random() - 0.5) * 0.0005,
      speed: 15 + Math.random() * 10, // 15-25 km/h
      heading: 90,
      timestamp: Date.now(),
    };

    client.publish(`jeepney/${vehicleId}/location`, JSON.stringify(payload));
    console.log('Published:', payload);
    index++;
  }, 3000); // every 3 seconds
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});