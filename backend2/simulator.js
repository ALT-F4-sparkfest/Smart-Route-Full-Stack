// simulator.js
require('dotenv').config();
const mqtt = require('mqtt');

const route = [
  { lat: 14.5764, lng: 121.0851 },
  { lat: 14.5780, lng: 121.0870 },
  { lat: 14.5800, lng: 121.0890 },
  { lat: 14.5820, lng: 121.0910 },
  // add more points along your demo route
];

const client = mqtt.connect(`mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
  username: process.env.MQTT_PUB_USER,
  password: process.env.MQTT_PUB_PASS,
});

const vehicleId = 'jeep01';
let index = 0;

client.on('connect', () => {
  console.log('Simulator connected to MQTT');

  setInterval(() => {
    const point = route[index % route.length];
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