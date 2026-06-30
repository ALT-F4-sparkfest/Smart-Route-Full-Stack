// geofence.js
const turf = require('@turf/turf');

function isOnRoute(lat, lng, routePolygonCoords) {
  const point = turf.point([lng, lat]); // turf uses [lng, lat] order!
  const polygon = turf.polygon([routePolygonCoords]);
  return turf.booleanPointInPolygon(point, polygon);
}

module.exports = { isOnRoute };