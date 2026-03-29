# Project Abstract
## ConveyorBelt Breakdown System — Predictive Maintenance Dashboard

---

### Overview

The **ConveyorBelt Breakdown System** is an IoT-enabled, real-time predictive maintenance platform designed to monitor, analyze, and alert operators about the operational health of industrial conveyor belts. The system integrates embedded sensor data with a full-stack web application, enabling continuous remote monitoring and reducing unplanned downtime through data-driven insights.

---

### Problem Statement

Industrial conveyor belts are critical assets in manufacturing, mining, and logistics. Unexpected breakdowns cause significant production losses, equipment damage, and safety hazards. Traditional maintenance approaches (time-based scheduling) are reactive and costly. This system addresses the gap by providing a **proactive, real-time condition-monitoring solution**.

---

### Objectives

- Continuously acquire live sensor data from conveyor belt hardware.
- Store, process, and visualize operational metrics on a cloud-connected dashboard.
- Detect anomalies (vibration spikes, temperature overruns) and display alert conditions.
- Log maintenance history with cause and service date.
- Provide a RESTful API for integration with third-party systems and Postman testing.

---

### System Architecture

```
[ Conveyor Belt Sensors ]
        │  (IoT / HTTP GET with query params)
        ▼
[ Node.js + Express Backend ] ──── [ MongoDB Atlas (Cloud DB) ]
        │  (REST API: GET / POST / PUT / DELETE)
        ▼
[ React + Vite Frontend Dashboard ]
        │  (Browser — Real-time charts, metric cards, video stream)
        ▼
[ End User / Plant Operator ]
```

---

### Key Features

| Feature | Description |
|---|---|
| **Real-Time Monitoring** | Polls backend every 1 second for live sensor data |
| **Operational Metrics** | Wind, belt width, speed, torque, belt & motor temp, voltage, current |
| **Condition Monitoring** | Vibration sensor status, lubrication level, belt tension |
| **Maintenance Log** | Records last service date and root cause of breakdown |
| **Live Video Feed** | Embedded video stream panel for visual inspection |
| **Performance Chart** | Real-time Recharts graph for speed and vibration over time |
| **Data Export** | One-click JSON download of all current readings |
| **REST API** | Full CRUD endpoints (GET, POST, PUT, DELETE) |

---

### Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, Recharts, Lucide React, CSS |
| **Backend** | Node.js, Express 5, Nodemon, dotenv |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Communication** | REST API (JSON over HTTP) |
| **Environment Config** | `.env` files (dotenv + Vite env) |

---

### API Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/data` | Fetch the latest sensor record |
| POST | `/data` | Insert a new sensor data record |
| PUT | `/data/:id` | Update an existing record by ID |
| DELETE | `/data/:id` | Delete a record by ID |

---

### Expected Outcomes

- Reduction in unplanned downtime through early fault detection.
- Centralized, cloud-accessible operational data.
- Scalable architecture ready for multi-belt, multi-site deployment.
- Maintainable codebase following RESTful API standards.

---

*Project: ConveyorBelt Breakdown System | Stack: MERN | Version: 1.0.0*
