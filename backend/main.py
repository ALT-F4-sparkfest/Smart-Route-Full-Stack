from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import math
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db as firebase_db
from dotenv import load_dotenv
import os

load_dotenv()

# ── Firebase Admin init ─────────────────────────────────
service_account_info = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
cred = credentials.Certificate(service_account_info)
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
    allow_origins=["*"],
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