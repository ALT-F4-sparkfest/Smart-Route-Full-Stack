# 🚌 BUSINA Frontend

> Smart Public Transport Monitoring and Commuter Information System

BUSINA is a modern React application that provides real-time visualization of public transportation for both commuters and transport operators.

The frontend consumes live vehicle data from the BUSINA backend through REST APIs and Socket.IO, rendering buses on Google Maps while providing analytics, ETA estimation, and operational dashboards.

---

# Preview

```
Landing Page
        │
        ├───────────────┐
        │               │
        ▼               ▼
 Commuter View     Operator Dashboard
        │               │
        │               │
        ▼               ▼
  Live Google Map   Live Fleet Monitoring
```

---

# Technology Stack

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| React 18            | Frontend Framework      |
| Vite                | Build Tool              |
| Socket.IO Client    | Real-time communication |
| Google Maps API     | Live Map Rendering      |
| Lucide React        | Icons                   |
| CSS / Inline Styles | UI                      |
| Fetch API           | Backend Communication   |

---

# Folder Structure

```
src/
│
├── assets/
│
├── components/
│   │
│   ├── commuter/
│   │     BottomSheet.jsx
│   │     SearchOverlay.jsx
│   │
│   ├── landing/
│   │     Navbar.jsx
│   │     Stats.jsx
│   │     Features.jsx
│   │
│   ├── layout/
│   │     Hero.jsx
│   │
│   ├── map/
│   │     LiveMap.jsx
│   │     VehicleMarker.jsx
│   │
│   ├── operator/
│   │     AIRecommendationPanel.jsx
│   │     VehicleDetailsPanel.jsx
│   │
│   ├── KPICards.jsx
│   ├── TravelTimeChart.jsx
│   └── ConnectionStatusPill.jsx
│
├── data/
│     demandHotspots.json
│
├── hooks/
│     useLiveVehicles.js
│     useRouteGeometry.js
│
├── pages/
│     LandingPage.jsx
│     CommuterView.jsx
│     OperatorView.jsx
│
├── App.jsx
└── main.jsx
```

---

# Application Pages

---

## 1. Landing Page

The landing page serves as the application's entry point.

### Features

- Modern glassmorphism UI
- Hero banner
- Animated gradient background
- Live statistics
- Feature cards
- GitHub repository shortcut
- Navigation to:
  - Commuter View
  - Operator Dashboard

### Components Used

```
Navbar
Hero
Stats
Features
```

---

## 2. Commuter View

The commuter dashboard allows passengers to monitor buses in real time.

### Features

✓ Live Google Map

✓ Real-time vehicle tracking

✓ Bus selection

✓ Auto-centering map

✓ Route filtering

✓ ETA lookup

✓ Destination search

✓ Live connection status

✓ Nearest bus detection

✓ Waiting notification

✓ Vehicle status

```
Moving

Slow

Stopped
```

### Components

```
LiveMap

BottomSheet

SearchOverlay

ConnectionStatusPill
```

---

## 3. Operator Dashboard

Provides fleet-wide monitoring.

### Features

✓ Live fleet map

✓ Vehicle sidebar

✓ Vehicle details

✓ Route filtering

✓ KPI cards

✓ Travel time analytics

✓ AI recommendations

✓ Operations panel

✓ Alerts feed

✓ Hotspot ranking

✓ Fleet health summary

---

# Shared Components

## LiveMap

Responsible for

- Google Maps
- Vehicle markers
- Route polyline
- User location
- Auto centering
- Selected vehicle highlighting

---

## VehicleMarker

Displays

- Bus icon
- Click interaction
- Selection state

---

## ConnectionStatusPill

Displays current backend state.

Possible states

```
LIVE

OFFLINE
```

---

## KPICards

Displays

- Fleet Size
- Active Vehicles
- Average Speed
- Vehicles On Route
- Stopped Vehicles

Values update automatically from Socket.IO.

---

## TravelTimeChart

Visualizes average travel times.

Used only inside Operator Dashboard.

---

## VehicleDetailsPanel

Shows selected vehicle

- ID
- Speed
- Route
- Heading
- Coordinates
- Last update

---

## AIRecommendationPanel

Displays recommendations generated from

- Fleet load
- Waiting commuters
- Current operations

---

# Hooks

---

## useLiveVehicles()

Main realtime hook.

Responsibilities

- REST fetch
- Socket.IO connection
- Vehicle synchronization
- Automatic updates
- Connection state

Returns

```javascript
{
  (vehicles, connected, socket);
}
```

---

## useRouteGeometry()

Fetches

- route coordinates
- geofence

Used by

```
LiveMap
```

---

# Data Flow

```
Backend

      │

 REST + Socket.IO

      │

useLiveVehicles()

      │

      ▼

React State

      │

      ▼

LiveMap

      │

      ▼

Vehicle Markers
```

---

# Live Features

Real-time updates include

✓ Vehicle position

✓ Vehicle speed

✓ Route assignment

✓ ETA updates

✓ Connection status

✓ Fleet statistics

✓ Operator dashboard

---

# API Endpoints Used

```
GET /vehicles

GET /alerts

GET /vehicles/:id/eta/:stop

GET /routes

Socket.IO

vehicle-update

fleet-update
```

---

# Google Maps

The frontend uses

Google Maps JavaScript API

Features

- Custom Bus Icons

- Auto Center

- Route Polylines

- User Marker

- Clickable Vehicles

---

# Responsive Design

Optimized for

✓ Desktop

✓ Laptop

✓ Large Tablet

Current MVP is desktop-first.

---

# Design Language

Primary Color

```
#2563EB
```

Background

```
#F8FAFC
```

Accent

```
#3B82F6
```

Border Radius

```
18px

22px

24px
```

Effects

- Glassmorphism
- Soft shadows
- Rounded cards
- Floating gradients

---

# Running the Project

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Default

```
http://localhost:5173
```

---

# Backend Requirement

The frontend expects the backend to run at

```
http://localhost:3000
```

Socket.IO

```
ws://localhost:3000
```

---

# Environment

Example

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

---

# Current MVP Features

| Feature              | Status    |
| -------------------- | --------- |
| Landing Page         | ✅        |
| Live Map             | ✅        |
| Bus Tracking         | ✅        |
| ETA                  | ✅        |
| Operator Dashboard   | ✅        |
| KPI Cards            | ✅        |
| AI Recommendations   | ✅        |
| Alerts               | ✅ (Mock) |
| Route Filter         | ✅        |
| Connection Indicator | ✅        |
| Google Maps          | ✅        |
| Socket.IO            | ✅        |

---

# Future Improvements

- Authentication
- Dark Mode
- Mobile Optimization
- Historical Playback
- Push Notifications
- Route Replay
- Heatmaps
- Passenger Analytics
- AdvancedMarkerElement Migration
- PWA Support

---

# Authors

BUSINA Development Team

Capstone Project

BS Computer Science

2026

---

# License

Educational Use Only
