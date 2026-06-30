// seedHistory.js
const db = require('./firebase');
const historicalData = require('./demo_history.json');

async function seed() {
  for (const point of historicalData) {
    await db.collection('vehicles').doc(point.vehicleId)
      .collection('history').add(point);
  }
  console.log('Seeded', historicalData.length, 'historical points');
}

seed();