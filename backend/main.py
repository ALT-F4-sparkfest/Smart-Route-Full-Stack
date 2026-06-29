from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
from datetime import datetime

# In-memory stores
connected_clients = []
vehicle_states = {}

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

# ── WebSocket ───────────────────────────────────────────────
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

# ── REST endpoints ──────────────────────────────────────────
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
    await broadcast({"type": "vehicle_update", "data": vehicle_states[vid]})
    return {"status": "ok"}