# API Documentation
## ConveyorBelt Breakdown System — REST API Reference

> **Base URL (Local):** `http://localhost:62887`  
> **Base URL (Production):** `https://conveyorbelt.ionode.cloud`  
> **Content-Type:** `application/json`

---

## Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check — verify server is running |
| GET | `/data` | Fetch the latest conveyor belt sensor record |
| POST | `/data` | Create a new sensor data record |
| PUT | `/data/:id` | Update an existing record by MongoDB `_id` |
| DELETE | `/data/:id` | Delete a record by MongoDB `_id` |

---

## 1. GET `/` — Health Check

### Postman Setup
- **Method:** `GET`
- **URL:** `http://localhost:62887/`
- **Headers:** _(none required)_
- **Body:** _(none)_

### Response — 200 OK
```json
{
  "message": "ConveyorBelt Breakdown System API is running."
}
```

---

## 2. GET `/data` — Fetch Latest Record

Retrieves the most recently updated conveyor belt sensor record from MongoDB.

### Postman Setup
- **Method:** `GET`
- **URL:** `http://localhost:62887/data`
- **Headers:** _(none required)_
- **Body:** _(none)_

### Response — 200 OK
```json
{
  "message": "Data fetched successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "operationalMetrics": {
      "wind": 12.5,
      "beltWidth": 1.2,
      "speed": 3.8,
      "torque": 450,
      "beltTemp": 72,
      "motorTemp": 88,
      "voltage": 415,
      "current": 28.4
    },
    "maintenanceLog": {
      "lastService": "2025-12-10T00:00:00.000Z",
      "cause": "Bearing failure"
    },
    "conditionMonitoring": {
      "vibration": 1.1,
      "lubricant": "Optimal",
      "tension": "Good"
    },
    "createdAt": "2026-03-28T10:00:00.000Z",
    "updatedAt": "2026-03-28T11:00:00.000Z",
    "__v": 0
  }
}
```

### Response — 404 Not Found
```json
{
  "message": "No data found. Use POST /data to create a record."
}
```

---

## 3. POST `/data` — Create New Record

Inserts a brand-new sensor data document into MongoDB.

### Postman Setup
- **Method:** `POST`
- **URL:** `http://localhost:62887/data`
- **Headers:**
  - `Content-Type: application/json`
- **Body → raw → JSON:**

```json
{
  "operationalMetrics": {
    "wind": 15.2,
    "beltWidth": 1.5,
    "speed": 4.2,
    "torque": 520,
    "beltTemp": 68,
    "motorTemp": 85,
    "voltage": 420,
    "current": 30.1
  },
  "maintenanceLog": {
    "lastService": "2026-01-15",
    "cause": "Scheduled maintenance"
  },
  "conditionMonitoring": {
    "vibration": 0.8,
    "lubricant": "Optimal",
    "tension": "Good"
  }
}
```

### Response — 201 Created
```json
{
  "message": "Record created successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "operationalMetrics": {
      "wind": 15.2,
      "beltWidth": 1.5,
      "speed": 4.2,
      "torque": 520,
      "beltTemp": 68,
      "motorTemp": 85,
      "voltage": 420,
      "current": 30.1
    },
    "maintenanceLog": {
      "lastService": "2026-01-15T00:00:00.000Z",
      "cause": "Scheduled maintenance"
    },
    "conditionMonitoring": {
      "vibration": 0.8,
      "lubricant": "Optimal",
      "tension": "Good"
    },
    "createdAt": "2026-03-28T12:00:00.000Z",
    "updatedAt": "2026-03-28T12:00:00.000Z",
    "__v": 0
  }
}
```

---

## 4. PUT `/data/:id` — Update Existing Record

Updates specific fields of an existing record. You can update all sections or just one.

> **Note:** Replace `:id` with the actual MongoDB `_id` from a GET response.  
> Example: `http://localhost:62887/data/64f1a2b3c4d5e6f7a8b9c0d1`

### Postman Setup
- **Method:** `PUT`
- **URL:** `http://localhost:62887/data/64f1a2b3c4d5e6f7a8b9c0d1`
- **Headers:**
  - `Content-Type: application/json`
- **Body → raw → JSON:**

```json
{
  "operationalMetrics": {
    "speed": 5.5,
    "beltTemp": 95,
    "motorTemp": 110,
    "voltage": 400
  },
  "conditionMonitoring": {
    "vibration": 1.8,
    "lubricant": "Low",
    "tension": "Critical"
  },
  "maintenanceLog": {
    "cause": "Overheating detected — emergency stop"
  }
}
```

### Response — 200 OK
```json
{
  "message": "Record updated successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "operationalMetrics": {
      "wind": 12.5,
      "beltWidth": 1.2,
      "speed": 5.5,
      "torque": 450,
      "beltTemp": 95,
      "motorTemp": 110,
      "voltage": 400,
      "current": 28.4
    },
    "maintenanceLog": {
      "lastService": "2025-12-10T00:00:00.000Z",
      "cause": "Overheating detected — emergency stop"
    },
    "conditionMonitoring": {
      "vibration": 1.8,
      "lubricant": "Low",
      "tension": "Critical"
    },
    "updatedAt": "2026-03-28T13:00:00.000Z"
  }
}
```

### Response — 404 Not Found
```json
{
  "message": "No record found with id: 64f1a2b3c4d5e6f7a8b9c0d1"
}
```

### Response — 400 Bad Request
```json
{
  "message": "No valid fields provided for update."
}
```

---

## 5. DELETE `/data/:id` — Delete a Record

Permanently removes a sensor record from MongoDB by its `_id`.

> **Note:** Replace `:id` with the actual MongoDB `_id`.  
> Example: `http://localhost:62887/data/64f1a2b3c4d5e6f7a8b9c0d2`

### Postman Setup
- **Method:** `DELETE`
- **URL:** `http://localhost:62887/data/64f1a2b3c4d5e6f7a8b9c0d2`
- **Headers:** _(none required)_
- **Body:** _(none)_

### Response — 200 OK
```json
{
  "message": "Record deleted successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "operationalMetrics": { "speed": 4.2, "beltTemp": 68 },
    "createdAt": "2026-03-28T12:00:00.000Z"
  }
}
```

### Response — 404 Not Found
```json
{
  "message": "No record found with id: 64f1a2b3c4d5e6f7a8b9c0d2"
}
```

---

## Data Schema Reference

```json
{
  "operationalMetrics": {
    "wind":      "Number  — Wind speed (km/h)",
    "beltWidth": "Number  — Belt width (meters)",
    "speed":     "Number  — Belt speed (m/s)",
    "torque":    "Number  — Motor torque (Nm)",
    "beltTemp":  "Number  — Belt temperature (°C)",
    "motorTemp": "Number  — Motor temperature (°C)",
    "voltage":   "Number  — Supply voltage (V)",
    "current":   "Number  — Motor current (A)"
  },
  "maintenanceLog": {
    "lastService": "Date    — ISO 8601 date string, e.g. '2026-01-15'",
    "cause":       "String  — Reason for last maintenance"
  },
  "conditionMonitoring": {
    "vibration": "Number  — Vibration level (mm/s)",
    "lubricant": "String  — 'Optimal' | 'Low' | 'Critical'",
    "tension":   "String  — 'Good' | 'Moderate' | 'Critical'"
  }
}
```

---

## Quick Postman Testing Guide

1. Open **Postman** → Create a new **Collection** called `ConveyorBelt API`
2. Add requests for each endpoint above
3. **Start with POST** to create the first record — copy the `_id` from the response
4. Use the copied `_id` for PUT and DELETE requests
5. Use GET to verify changes after each operation

---

*API Version: 1.0.0 | Backend: Express 5 + MongoDB Atlas*
