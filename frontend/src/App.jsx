import React, { useState, useEffect, useCallback } from 'react';
import { Server, Download, Gauge, Wind, RotateCw, Thermometer, Zap, Bolt, TrendingUp, Settings } from 'lucide-react';
import { initialData, fluctuate, SIMULATION_INTERVAL_MS, MAX_HISTORY_LENGTH } from './utils/constants';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import MaintenanceLog from './components/MaintenanceLog';
import RealTimeChart from './components/RealTimeChart';
import "./App.css"
import Video from './assets/conver belt.mp4'
import conver from './assets/conver belt.png'


const App = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newVibration = fluctuate(prev.vibration, 0.05);
        const newSpeed = fluctuate(prev.speed, 0.1);
        const newMotorTemp = fluctuate(prev.motorTemp, 0.2);
        const newCurrent = fluctuate(prev.current, 0.5);

        let vibrationStatus = 'Optimal';
        if (newVibration > 1.2) vibrationStatus = 'Moderate';
        if (newVibration > 1.5) vibrationStatus = 'Critical';

        let lubricationStatus = prev.lubrication;
        if (newMotorTemp > 65 && lubricationStatus === 'Optimal') lubricationStatus = 'Suboptimal';

        let tensionStatus = prev.tension;
        if (Math.random() < 0.01) tensionStatus = 'Poor';

        const newHistoryPoint = {
          time: new Date().toLocaleTimeString('en-US', { second: '2-digit', minute: '2-digit' }),
          speed: newSpeed,
          vibration: newVibration
        };
        const newHistory = [...prev.performanceHistory, newHistoryPoint];
        if (newHistory.length > MAX_HISTORY_LENGTH) newHistory.shift();

        return { ...prev, speed: newSpeed, temp: fluctuate(prev.temp, 0.1), motorTemp: newMotorTemp, torque: newSpeed * newCurrent * 2.5, voltage: fluctuate(prev.voltage, 0.1), current: newCurrent, vibration: newVibration, lubrication: lubricationStatus, tension: tensionStatus, performanceHistory: newHistory };
      });
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    const dataToDownload = { timestamp: new Date().toISOString(), current_metrics: { width: `${data.width} m`, speed: `${data.speed.toFixed(1)} m/s`, temp: `${data.temp.toFixed(1)} °C`, motorTemp: `${data.motorTemp.toFixed(1)} °C`, torque: `${data.torque.toFixed(1)} Nm`, voltage: `${data.voltage.toFixed(1)} V`, current: `${data.current.toFixed(1)} A` }, condition_monitoring: { vibration: `${data.vibration.toFixed(2)} mm/s`, lubrication_status: data.lubrication, tension_status: data.tension }, maintenance_log: { lastMaintenance: data.lastMaintenance, maintenanceCause: data.maintenanceCause }, performance_history: data.performanceHistory };
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conveyor_belt_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="header">
          <div>
            <h1 className="header-title">CONVEYOR BELT</h1>
            <p className="header-subtitle">Real-time Predictive Maintenance Dashboard</p>
          </div>
          <div className="header-actions">

            <button onClick={handleDownload} className="download-button" title="Download All Current Data"><Download size={18} className="download-icon" /> Download Data</button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="main-grid">
          <div className="metrics-section">
            <h2 className="condition-section-title">Operational Metrics</h2>
            <div className="card-grid">
              <MetricCard title="Wind" value={data.Wind} unit="km/h" icon={Wind} color="#3b82f6" />
              <MetricCard title="Belt Width" value={data.width} unit="m" icon={Gauge} color="#3b82f6" />
              <MetricCard title="Speed" value={data.speed} unit="m/s" icon={Wind} color="#10b981" />
              <MetricCard title="Torque" value={data.torque} unit="Nm" icon={RotateCw} color="#ef4444" />
              <MetricCard title="Belt Temp" value={data.temp} unit="°C" icon={Thermometer} color="#f59e0b" />
              <MetricCard title="Motor Temp" value={data.motorTemp} unit="°C" icon={Thermometer} color="#8b5cf6" />
              <MetricCard title="Voltage" value={data.voltage} unit="V" icon={Zap} color="#14b8a6" />
              <MetricCard title="Current" value={data.current} unit="A" icon={Bolt} color="#f97316" />
            </div>
            <MaintenanceLog lastMaintenance={data.lastMaintenance} maintenanceCause={data.maintenanceCause} />
            <RealTimeChart data={data.performanceHistory} />
          </div>

          <div className="right-panel">
            <h2 className="video-streaming-title"> Live video Streaming</h2>
            {/* video streaming */}
            <div className='video-streaming'>
              <video className='live-video'
                src={Video}
                controls
                loop
                muted> Live video Streaming
              </video>
            </div>
            <h2 className="condition-section-title">Condition Monitoring</h2>
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              <StatusCard title="Vibration Sensor" status={data.vibration > 1.2 ? (data.vibration > 1.5 ? 'Critical' : 'Moderate') : 'Optimal'} isVibration value={data.vibration} unit="mm/s" icon={TrendingUp} />
              <StatusCard title="Lubrication" status={data.lubrication} icon={Settings} />
              <StatusCard title="Tension" status={data.tension} icon={Gauge} />
            </div>
            <div class="conveyor-container">
              <img src={conver} alt="Conveyor Belt" class="conveyor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
