import React from 'react';
import { Settings, Clock, Cpu } from 'lucide-react';
import "../App.css"
const MaintenanceLog = ({ lastMaintenance, maintenanceCause }) => (
  <div className="log-card">
    <h3 className="log-title"><Settings size={20} style={{ marginRight: '0.5rem', color: '#06b6d4' }} /> Maintenance Log</h3>
    <div className="log-entry">
      <div className="log-label"><Clock size={16} /> Last Service:</div>
      <div className="log-detail">{lastMaintenance}</div>
    </div>
    <div className="log-entry">
      <div className="log-label"><Cpu size={16} /> Cause:</div>
      <div className="log-detail">{maintenanceCause}</div>
    </div>
  </div>
);

export default MaintenanceLog;
