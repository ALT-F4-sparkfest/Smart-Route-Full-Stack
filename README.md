# 🚌 BUSINA – Smart Public Transportation Management System

> A real-time full-stack transportation management platform that enables commuters to track buses live while providing operators with fleet monitoring, analytics, ETA prediction, and operational insights.

---

# 📖 Overview

BUSINA is a full-stack web application developed as a Computer Science Capstone Project.

The system provides:

- 🚌 Live vehicle tracking
- 📍 Google Maps visualization
- 📡 Real-time GPS streaming
- ⚡ Socket.IO live synchronization
- 🧠 ETA prediction
- 🚦 Geofencing
- 📊 Fleet analytics dashboard
- 👥 Commuter information system
- 🤖 AI-assisted operational recommendations

The application consists of two major systems:

```
Frontend (React + Google Maps)

↓

Backend (Express + Socket.IO)

↓

MQTT

↓

Replay Simulator / GPS Devices

↓

Supabase Database
```

---

# 🏗 System Architecture

```
                          ┌──────────────────────┐
                          │ Replay Simulator     │
                          │ (Mock GPS Device)    │
                          └──────────┬───────────┘
                                     │
                                     │ MQTT
                                     ▼
                          ┌──────────────────────┐
                          │ MQTT Broker          │
                          │ HiveMQ Cloud         │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ subscriber.js        │
                          │ MQTT Consumer        │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ Supabase             │
                          │ vehicles             │
                          │ history              │
                          │ alerts               │
                          └──────────┬───────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │ Express + Socket.IO    │
                         │ server.js              │
                         └──────────┬─────────────┘
                                    │
                ┌───────────────────┴────────────────────┐
                ▼                                        ▼
      Commuter Web App                         Operator Dashboard
```

---

# 🚀 Features

## Commuter Portal

- Live bus tracking
- Google Maps integration
- Route filtering
- ETA prediction
- Destination search
- Bus status
- Nearest bus detection
- Waiting request
- Real-time updates
- Connection indicator

---

## Operator Dashboard

- Fleet monitoring
- Live map
- Vehicle list
- Vehicle details
- KPI Dashboard
- Alerts feed
- AI recommendations
- Demand hotspot monitoring
- Travel time analytics
- Fleet health

---

## Backend Services

- MQTT Subscriber
- Replay Simulator
- Socket.IO broadcasting
- REST API
- ETA Engine
- Geofence detection
- Vehicle history
- Speed smoothing
- Alert generation
- Supabase integration

---

# 🛠 Technology Stack

## Frontend

| Technology                 | Purpose                 |
| -------------------------- | ----------------------- |
| React 18                   | UI Framework            |
| Vite                       | Build Tool              |
| Socket.IO Client           | Real-time communication |
| Google Maps JavaScript API | Live Maps               |
| Lucide React               | Icons                   |
| CSS / Inline Styling       | UI                      |

---

## Backend

| Technology | Purpose      |
| ---------- | ------------ |
| Node.js    | Runtime      |
| Express    | REST API     |
| Socket.IO  | Live updates |
| MQTT.js    | MQTT Client  |
| Supabase   | Database     |
| dotenv     | Environment  |
| Turf.js    | Geofencing   |

---

# 🌐 Frontend Pages

## Landing Page

Features

- Hero section
- Live statistics
- Features overview
- Navigation
- Modern glassmorphism UI

---

## Commuter View

Features

- Live Google Map
- Vehicle selection
- ETA lookup
- Route filter
- Destination search
- Bottom information sheet
- Bus status
- Waiting request

---

## Operator Dashboard

Features

- Fleet map
- KPI cards
- Alerts feed
- Vehicle monitoring
- AI recommendations
- Demand hotspots
- Operations panel
- Fleet statistics

---

# 📡 Backend Components

## replaySimulator.js

Simulates GPS devices.

Publishes MQTT messages every few seconds.

---

## subscriber.js

Receives MQTT messages.

Updates

- vehicle position
- speed
- heading
- history
- geofence
- recent speeds

---

## server.js

Express server.

Provides

- REST APIs
- Socket.IO
- ETA engine
- alerts
- history
- vehicles

---

## eta.js

Calculates

- travel distance
- traffic multiplier
- waiting detection
- arrival detection
- estimated arrival

---

## geofence.js

Determines whether vehicles remain inside assigned routes.

---

# 📊 Database

Supabase

Tables

```
vehicles

alerts

vehicle_history

routes

stops

etas
```

---

# 🔄 Data Flow

```
Replay Simulator

↓

MQTT Broker

↓

MQTT Subscriber

↓

Supabase

↓

Express API

↓

Socket.IO

↓

React

↓

Google Maps
```

---

# 🔌 REST API

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | /vehicles               |
| GET    | /vehicles/:id           |
| GET    | /vehicles/:id/history   |
| GET    | /vehicles/:id/eta/:stop |
| GET    | /vehicles/:id/etas      |
| GET    | /alerts                 |
| GET    | /routes                 |

---

# ⚡ Socket.IO Events

Server → Client

```
vehicle-update

fleet-update

connection
```

Client → Server

```
commuter-waiting
```

---

# 📍 Google Maps

The frontend renders

- Vehicle markers
- User location
- Route polyline
- Selected vehicle
- Auto centering

---

# 📈 Current MVP Status

| Module              | Status          |
| ------------------- | --------------- |
| Landing Page        | ✅              |
| Commuter Portal     | ✅              |
| Operator Dashboard  | ✅              |
| Live Tracking       | ✅              |
| ETA Engine          | ✅              |
| Route Filter        | ✅              |
| KPI Dashboard       | ✅              |
| Socket.IO           | ✅              |
| MQTT                | ✅              |
| Google Maps         | ✅              |
| Replay Simulator    | ✅              |
| Supabase            | ✅              |
| AI Recommendations  | ✅              |
| Alerts              | ✅ (Mock Ready) |
| Historical Playback | 🚧              |

---

# ▶ Running BUSINA

## Backend

```bash
cd backend

npm install

node server.js
```

---

## Replay Simulator

```bash
node replaySimulator.js
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🌍 Environment Variables

## Backend

```
SUPABASE_URL=

SUPABASE_KEY=

MQTT_HOST=

MQTT_PORT=

MQTT_SUB_USER=

MQTT_SUB_PASS=

MQTT_PUB_USER=

MQTT_PUB_PASS=
```

---

## Frontend

```
VITE_GOOGLE_MAPS_API_KEY=
```

---

# 📊 Project Progress

| Component   | Completion |
| ----------- | ---------- |
| Backend     | 98%        |
| Frontend    | 95%        |
| Integration | 95%        |
| Deployment  | Pending    |

Overall

```
██████████████████████████████░ 95%
```

---

# 🎯 Future Improvements

- Historical playback
- Authentication
- Mobile responsiveness
- Push notifications
- Passenger analytics
- Route optimization
- Predictive demand analytics
- Dark mode
- Progressive Web App
- Advanced Google Maps Marker migration

---

# 🔒 Security

- Environment variables are excluded from Git.
- MQTT credentials use least-privilege accounts.
- Supabase credentials remain server-side.
- Socket.IO only exposes operational data.
---

# 🏆 Project Highlights

✅ Full-stack architecture

✅ MQTT-based IoT communication

✅ Real-time Socket.IO synchronization

✅ Google Maps integration

✅ Live ETA prediction

✅ Fleet monitoring dashboard

✅ AI-assisted operational insights

✅ Responsive modern interface

✅ Production-ready MVP

---

> **BUSINA** bridges commuters and transport operators through real-time vehicle tracking, intelligent analytics, and modern web technologies, providing a scalable foundation for smarter public transportation systems.
