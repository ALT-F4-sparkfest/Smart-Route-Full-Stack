import requests
import time
import random

BASE_LAT = 14.5547
BASE_LNG = 121.0244
VEHICLE_ID = "PUV-001"
BACKEND_URL = "http://localhost:8000/vehicle/update"

def simulate():
    step = 0
    print(f"🚌 Simulating {VEHICLE_ID}...")
    while True:
        lat = BASE_LAT + (step * 0.0005) + random.uniform(-0.0001, 0.0001)
        lng = BASE_LNG + (step * 0.0002) + random.uniform(-0.0001, 0.0001)
        speed = random.uniform(20, 45)

        payload = {
            "vehicle_id": VEHICLE_ID,
            "lat": round(lat, 6),
            "lng": round(lng, 6),
            "speed": round(speed, 1),
            "route": "Cubao - Quiapo",
            "status": "on_route"
        }

        try:
            r = requests.post(BACKEND_URL, json=payload)
            print(f"Sent: lat={payload['lat']} lng={payload['lng']} speed={payload['speed']}")
        except Exception as e:
            print(f"Error: {e}")

        step += 1
        if step > 50:
            step = 0
        time.sleep(2)

if __name__ == "__main__":
    simulate()