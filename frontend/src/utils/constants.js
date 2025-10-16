import { Wind } from "lucide-react";

export const MAX_HISTORY_LENGTH = 30;
export const SIMULATION_INTERVAL_MS = 1000;

export const initialData = {
  Wind:40,
  width: 1.2,
  speed: 1.8,
  temp: 35.2,
  motorTemp: 58.0,
  torque: 45.1,
  voltage: 380.0,
  current: 15.5,
  vibration: 0.8,
  lubrication: 'Optimal',
  tension: 'Good',
  lastMaintenance: '2025-05-10 09:30:00',
  maintenanceCause: 'Roller bearing replacement',
  performanceHistory: []
};

// Utility function
export const fluctuate = (value, range) => parseFloat((value + (Math.random() - 0.5) * range).toFixed(1));
