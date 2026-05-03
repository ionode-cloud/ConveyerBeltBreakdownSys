/**
 * api.js — Central API utility for ConveyorBelt Breakdown System
 *
 * All HTTP requests to the backend are made through this file.
 * Base URL is read from the Vite environment variable VITE_API_BASE_URL.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:62887';

// ─────────────────────────────────────────────
// Helper: generic fetch wrapper
// ─────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// ─────────────────────────────────────────────
// GET  /data  → Fetch latest conveyor belt record
// ─────────────────────────────────────────────
export async function getData() {
  return request('/data', { method: 'GET' });
}

// ─────────────────────────────────────────────
// POST /data  → Create a new sensor record
// body: { operationalMetrics, maintenanceLog, conditionMonitoring }
// ─────────────────────────────────────────────
export async function postData(body) {
  return request('/data', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────
// PUT  /data/:id → Update an existing record
// id  : MongoDB document _id string
// body: partial { operationalMetrics, maintenanceLog, conditionMonitoring }
// ─────────────────────────────────────────────
export async function putData(id, body) {
  return request(`/data/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────
// PUT  /data  → Update the latest conveyor belt record
// ─────────────────────────────────────────────
export async function putLatestData(body) {
  return request('/data', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────
// DELETE /data/:id → Delete a record by id
// id: MongoDB document _id string
// ─────────────────────────────────────────────
export async function deleteData(id) {
  return request(`/data/${id}`, { method: 'DELETE' });
}
