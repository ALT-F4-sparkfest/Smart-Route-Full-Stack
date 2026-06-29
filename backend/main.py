from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db as firebase_db
from dotenv import load_dotenv
import os

load_dotenv()

# ── Firebase Admin init ─────────────────────────────────
# ── Firebase Admin init ─────────────────────────────────
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL")
})
# In-memory stores
connected_clients = []
vehicle_states = {}
waiting_commuters = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚌 SmartRoute PH backend started")
    yield
    print("SmartRoute PH backend stopped")

app = FastAPI(title="SmartRoute PH API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── WebSocket ───────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"Client connected. Total: {len(connected_clients)}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total: {len(connected_clients)}")

async def broadcast(data: dict):
    dead = []
    for client in connected_clients:
        try:
            await client.send_text(json.dumps(data))
        except:
            dead.append(client)
    for d in dead:
        connected_clients.remove(d)

# ── REST endpoints ──────────────────────────────────────
@app.get("/")
def root():
    return {"status": "SmartRoute PH is running 🚌"}

@app.get("/vehicles")
def get_vehicles():
    return {"vehicles": list(vehicle_states.values())}

@app.post("/vehicle/update")
async def update_vehicle(payload: dict):
    vid = payload.get("vehicle_id")
    vehicle_states[vid] = {
        **payload,
        "last_seen": datetime.utcnow().isoformat()
    }
    # Write to Firebase
    firebase_db.reference(f"vehicles/{vid}").set(vehicle_states[vid])

    await broadcast({"type": "vehicle_update", "data": vehicle_states[vid]})
    return {"status": "ok"}

# ── Commuter waiting endpoints ──────────────────────────
@app.post("/commuter/waiting")
async def commuter_waiting(payload: dict):
    entry = {
        "lat": payload.get("lat"),
        "lng": payload.get("lng"),
        "time": datetime.utcnow().strftime("%H:%M:%S")
    }
    waiting_commuters.append(entry)

    # Write to Firebase
    firebase_db.reference("waiters").set(waiting_commuters)

    await broadcast({
        "type": "waiting_update",
        "total": len(waiting_commuters),
        "waiters": waiting_commuters
    })
    return {"status": "ok"}

@app.get("/commuter/waiting/all")
def get_waiters():
    return {"waiters": waiting_commuters}