# SmartRoute Backend

Backend service for real-time jeepney tracking. It simulates GPS pings from a vehicle, streams them over MQTT, stores them in Firestore, and exposes a REST API (including ETA calculations and geofencing) for the frontend to consume.

## Architecture / Data Flow

```
simulator.js  --publish-->  HiveMQ Cloud (MQTT)  --subscribe-->  subscriber.js  -->  Firestore
                                                                                          |
                                                                                          v
                                                                                     server.js (REST API)
                                                                                          |
                                                                                          v
                                                                                    Frontend team
```

1. **`simulator.js`** acts as a fake ESP32 device. It publishes GPS pings (lat, lng, speed, heading, timestamp) for a vehicle to the topic `jeepney/{vehicleId}/location` every 3 seconds.
2. **`subscriber.js`** listens to `jeepney/+/location` (all vehicles), and on each message:
   - Updates the vehicle's latest position in Firestore
   - Appends the ping to that vehicle's `history` subcollection
   - Maintains a rolling window of the last 4 speed readings (`recentSpeeds`) for smoothing
   - Tracks how long a vehicle has been stationary (`stationarySince`)
   - Checks whether the vehicle is within the route's geofence (`onRoute`)
3. **`server.js`** exposes REST endpoints that read from Firestore, including computed ETAs.
4. **`seedHistory.js`** is a one-off script to backfill Firestore with sample/demo historical data for testing without waiting on the live simulator.

## Files

| File | Purpose |
|---|---|
| `simulator.js` | Fakes an ESP32 device, publishes GPS pings to MQTT |
| `subscriber.js` | Subscribes to MQTT, writes pings to Firestore, computes onRoute/speed history/stationary status |
| `firebase.js` | Initializes the Firebase Admin SDK and exports the Firestore `db` instance |
| `eta.js` | ETA heuristic: haversine distance, traffic multiplier, effective speed, waiting/arrival detection |
| `geofence.js` | Point-in-polygon check (via `@turf/turf`) to determine if a vehicle is on its route |
| `server.js` | Express REST API exposing vehicles, history, and ETA endpoints |
| `seedHistory.js` | Seeds Firestore with sample historical ping data from `demo_history.json` |
| `demo_history.json` | Sample historical data used by `seedHistory.js` |
| `routes/stops.json` | List of stop coordinates for the route (placeholder until Hardware/AI Lead provides real data) |
| `routes/geofence.json` | Route boundary polygon coordinates (placeholder until real route geometry is provided) |
| `.env` | MQTT and connection credentials (not committed) |
| `serviceAccountKey.json` | Firebase Admin service account key (not committed) |

## Firestore Data Model

```
vehicles (collection)
  {vehicleId} (doc)
    lat, lng, speed, heading        -- latest known position
    lastUpdated                     -- timestamp of last ping
    recentSpeeds                    -- array of last 4 speed readings
    stationarySince                 -- timestamp when vehicle first stopped moving, or null
    onRoute                         -- boolean, whether vehicle is inside the route geofence
    history (subcollection)
      {auto-id} (doc) -> { lat, lng, speed, heading, timestamp, onRoute }

etas (collection)
  {vehicleId} (doc)
    stops (subcollection)
      {stopId} (doc) -> { eta_minutes, status, display_text, confidence, distance_km, timestamp, last_updated }
```

## MQTT Topic Structure

```
jeepney/{vehicleId}/location
```

Example payload:
```json
{
  "vehicleId": "jeep01",
  "lat": 14.5764,
  "lng": 121.0851,
  "speed": 18.5,
  "heading": 92,
  "timestamp": 1719600000000
}
```

Broker: HiveMQ Cloud (Serverless, free tier). Two separate credentials are used, following least-privilege:
- A **publish-only** credential, used by `simulator.js` (and eventually real ESP32 hardware)
- A **subscribe-only** credential, used by `subscriber.js`

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/vehicles` | List all vehicles with their latest known position and status |
| GET | `/vehicles/:id/history?from=&to=` | Historical pings for a vehicle, optionally filtered by timestamp range |
| GET | `/vehicles/:id/eta/:stopId` | ETA from a vehicle to a specific stop |
| GET | `/vehicles/:id/etas` | ETA from a vehicle to all stops on its route |

### Example ETA response

```json
{
  "eta_minutes": 12,
  "status": "approaching",
  "display_text": "~12 min to Ayala Avenue",
  "confidence": "moderate",
  "distance_km": 2.5,
  "timestamp": "2026-06-29T08:15:30Z"
}
```

`status` can be `"approaching"`, `"arriving"` (within 100m), or `"waiting"` (stationary for more than 3 minutes). `confidence` is `"high"` once at least 4 recent speed readings are available, otherwise `"moderate"`.

## ETA Logic Summary (`eta.js`)

- **Distance**: haversine formula between vehicle and stop coordinates
- **Effective speed**: uses current speed if moving (>1 km/h), otherwise averages the last 4 readings, with a 10 km/h fallback if no data exists
- **Traffic multiplier**: 7 time-of-day bands (e.g. 1.8x during 7–9 AM rush hour, 0.9x for 12 AM–5 AM)
- **Waiting detection**: flagged if speed < 1 km/h for more than 3 minutes
- **Arrival detection**: flagged if distance to stop is under 100m
- Each calculated ETA is cached to Firestore under `etas/{vehicleId}/stops/{stopId}`

## Setup

```bash
npm install
```

Create a `.env` file (not committed) with:
```
MQTT_HOST=your-cluster.hivemq.cloud
MQTT_PORT=8883
MQTT_PUB_USER=your_publish_username
MQTT_PUB_PASS=your_publish_password
MQTT_SUB_USER=your_subscribe_username
MQTT_SUB_PASS=your_subscribe_password
```

Place your Firebase service account key as `serviceAccountKey.json` in the project root (download from Firebase Console → Project Settings → Service Accounts → Generate new private key). Not committed.

## Running the system

Run each in its own terminal, in this order:

```bash
node simulator.js     # fakes GPS pings from a device
node subscriber.js    # MQTT -> Firestore
node server.js        # REST API on port 3000
```

Optional, one-off:
```bash
node seedHistory.js   # backfill Firestore with sample historical data
```

## Verifying it works

```bash
curl http://localhost:3000/vehicles
curl http://localhost:3000/vehicles/jeep01/history
curl http://localhost:3000/vehicles/jeep01/eta/stop1
curl http://localhost:3000/vehicles/jeep01/etas
```

## Security notes

- `.env`, `serviceAccountKey.json`, and `node_modules/` are git-ignored and must never be committed.
- MQTT credentials are split into publish-only and subscribe-only accounts so no single credential has more access than it needs.
