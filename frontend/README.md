# BUSINA Frontend Technical Documentation

## 1. Introduction

BUSINA (Bus Intelligent Navigation Assistant) is a React-based web application that serves as the client interface for the BUSINA Smart Public Transportation Monitoring System. The frontend provides two primary user interfaces:

- **Commuter Dashboard**, designed for passengers to monitor public utility vehicles (PUVs), estimate arrival times, and plan trips.
- **Operator Dashboard**, designed for transport cooperatives to monitor fleet operations, vehicle health, and operational performance in real time.

The frontend consumes RESTful APIs and Socket.IO streams from the BUSINA backend to visualize live transportation data using the Google Maps JavaScript API.

---

# 2. System Architecture

```
                   BUSINA Backend
          (Express + Socket.IO Server)
                     │
      ┌──────────────┴──────────────┐
      │                             │
 REST API                    Socket.IO
      │                             │
      └──────────────┬──────────────┘
                     │
             useLiveVehicles Hook
                     │
            React State Management
                     │
      ┌──────────────┴──────────────┐
      │                             │
 Commuter Dashboard          Operator Dashboard
                     │
               Google Maps API
```

The frontend initially retrieves fleet data through REST API requests and subsequently synchronizes updates through Socket.IO events, eliminating the need for frequent polling.

---

# 3. Technology Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Framework        | React 18                   |
| Build Tool       | Vite                       |
| Mapping          | Google Maps JavaScript API |
| Charts           | Recharts                   |
| Icons            | Lucide React               |
| Communication    | Fetch API                  |
| Real-Time        | Socket.IO Client           |
| Styling          | CSS3 + Responsive Layout   |
| State Management | React Hooks                |

---

# 4. Application Structure

```
src
│
├── components
│
├── hooks
│
├── pages
│
├── data
│
├── App.jsx
└── main.jsx
```

The application follows a component-based architecture where reusable UI components are separated from business logic contained inside custom hooks.

---

# 5. Application Pages

## 5.1 Landing Page

The landing page serves as the application's public entry point.

### Responsibilities

- Present project overview
- Display live fleet statistics
- Introduce BUSINA features
- Navigate users to the Commuter or Operator dashboard

### Components

- Navbar
- Hero
- Stats
- Features

---

## 5.2 Commuter Dashboard

The Commuter Dashboard allows passengers to monitor nearby public utility vehicles in real time.

### Functionalities

- Interactive Google Map
- Live vehicle tracking
- Vehicle selection
- Automatic user location detection
- Automatic map centering
- Route filtering
- ETA estimation
- Destination search
- Vehicle information display
- Connection status monitoring

Each vehicle marker displays operational information including:

- Route
- Current speed
- Passenger load
- Distance from commuter
- Estimated arrival time

---

## 5.3 Operator Dashboard

The Operator Dashboard provides transport cooperatives with an operational overview of the active fleet.

### Functionalities

- Live fleet monitoring
- Fleet KPI dashboard
- Vehicle information panel
- Route filtering
- Travel time analytics
- AI recommendation panel
- Demand hotspot visualization
- Fleet health monitoring

Each monitored vehicle displays:

- Vehicle ID
- Assigned route
- Passenger occupancy
- Vehicle speed
- Estimated arrival time
- GPS coordinates
- Last update timestamp

---

# 6. Core Components

## LiveMap

The LiveMap component encapsulates all Google Maps functionality.

Responsibilities include:

- Rendering vehicle markers
- Drawing route polylines
- Displaying commuter location
- Highlighting selected vehicles
- Automatic camera movement

---

## VehicleMarker

Represents individual buses on the map.

Responsibilities:

- Display vehicle icon
- Handle selection events
- Show current vehicle position

---

## KPICards

Displays fleet-wide operational metrics.

Metrics include:

- Active fleet size
- Average speed
- On-route vehicles
- Stationary vehicles

Values update automatically through Socket.IO.

---

## TravelTimeChart

Visualizes average travel time statistics using Recharts.

This component assists operators in identifying congestion and route performance trends.

---

## VehicleDetailsPanel

Displays detailed operational information of the currently selected vehicle.

Information includes:

- Route
- Speed
- Passenger count
- ETA
- GPS coordinates
- Last synchronization time

---

## AIRecommendationPanel

Displays heuristic-based operational recommendations generated from current fleet conditions.

Recommendations consider:

- Fleet utilization
- Waiting commuters
- Active vehicles
- Operational efficiency

---

# 7. Custom Hooks

## useLiveVehicles()

This hook manages all communication between the frontend and backend.

Responsibilities include:

- Initial REST API data retrieval
- Socket.IO initialization
- Vehicle synchronization
- Connection monitoring
- Automatic React state updates

Returns:

```javascript
{
  (vehicles, connected, socket);
}
```

---

## useRouteGeometry()

Retrieves route geometry from the backend.

Used primarily for:

- Route polylines
- Map visualization
- Geofence rendering

---

# 8. Data Flow

```
Backend

       │

REST API

       │

Fetch Initial Fleet

       │

React State

       │

Socket.IO

       │

Vehicle Updates

       │

useLiveVehicles()

       │

LiveMap

       │

Google Maps
```

---

# 9. Real-Time Communication

BUSINA implements a hybrid communication model.

### Initial Data

```
GET /vehicles
```

retrieves the current fleet snapshot.

### Continuous Updates

Socket.IO broadcasts:

```
vehicle-update

fleet-update
```

allowing dashboards to remain synchronized without continuous polling.

---

# 10. Responsive Design

The frontend employs responsive layouts to support multiple device sizes.

Supported platforms include:

- Desktop
- Laptop
- Tablet
- Mobile

Media queries dynamically reorganize dashboard layouts while preserving functionality.

---

# 11. Deployment

The frontend is deployed on **Vercel**, while the backend is hosted on **Render**.

Communication between both services is configured through environment variables.

Required variables:

```
VITE_GOOGLE_MAPS_API_KEY

VITE_BACKEND_URL
```

---

# 12. Current System Status

| Module                  | Status              |
| ----------------------- | ------------------- |
| Landing Page            | Complete            |
| Commuter Dashboard      | Complete            |
| Operator Dashboard      | Complete            |
| Live Vehicle Tracking   | Complete            |
| Google Maps Integration | Complete            |
| ETA Estimation          | Complete            |
| Fleet Analytics         | Complete            |
| Responsive Design       | Complete            |
| Alerts                  | Mock Implementation |
| Historical Playback     | Planned             |

---

# 13. Current Limitations

The current MVP includes several known limitations:

- Alert notifications currently utilize mock data.
- Historical route playback is not yet connected to persistent storage.
- Passenger waiting requests have not yet been integrated into the Operator Dashboard.
- Google Maps currently relies on the legacy `Marker` API and is planned to migrate to `AdvancedMarkerElement`.
- AI recommendations are heuristic-based and do not yet utilize machine learning models.

---

# 14. Future Enhancements

Future development of the frontend includes:

- Authentication and role-based access
- Passenger waiting request integration
- Historical route playback
- Push notifications
- Progressive Web App support
- AI-powered demand forecasting
- Passenger analytics dashboard
- Offline functionality
- Migration to Google Maps Advanced Marker API

---

# 15. Conclusion

The BUSINA frontend provides a responsive, real-time visualization platform that bridges commuters and transport operators through a unified web interface. By integrating Google Maps, Socket.IO, and React, the application delivers live fleet monitoring, ETA estimation, operational analytics, and intelligent decision support. The current implementation serves as a production-ready MVP while providing a scalable architecture for future enhancements such as predictive analytics, authentication, and advanced fleet optimization.

---

This format is much closer to what you'd see in a **software engineering technical manual** or **capstone documentation**, making it suitable for GitHub, academic submissions, and hackathon judging.
