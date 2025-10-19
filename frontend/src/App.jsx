import React, { useState, useEffect, useCallback } from 'react';
import { Download, Gauge, Wind, RotateCw, Thermometer, Zap, Bolt, TrendingUp, Settings } from 'lucide-react';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import MaintenanceLog from './components/MaintenanceLog';
import RealTimeChart from './components/RealTimeChart';
import "./App.css"
import Video from './assets/conver belt.mp4'
import conver from './assets/conver belt.png'

const API_READ_URL = 'https://conveyorbelt.ionode.cloud/data';
const API_PUSH_URL = 'https://conveyorbelt.ionode.cloud/data';

const App = () => {
  const [data, setData] = useState({
    Wind: 0,
    width: 0,
    speed: 0,
    temp: 0,
    motorTemp: 0,
    torque: 0,
    voltage: 0,
    current: 0,
    vibration: 0,
    lubrication: 'Optimal',
    tension: 'Good',
    lastMaintenance: '',
    maintenanceCause: '',
    performanceHistory: []
  });

  // --- Push data to backend ---
  const pushData = async (updatedData) => {
    try {
      const params = new URLSearchParams({
        wind: updatedData.Wind,
        beltWidth: updatedData.width,
        speed: updatedData.speed,
        torque: updatedData.torque,
        beltTemp: updatedData.temp,
        motorTemp: updatedData.motorTemp,
        voltage: updatedData.voltage,
        current: updatedData.current,
        lastService: updatedData.lastMaintenance,
        cause: updatedData.maintenanceCause,
        vibration: updatedData.vibration,
        lubricant: updatedData.lubrication,
        tension: updatedData.tension
      });

      await fetch(`${API_PUSH_URL}?${params.toString()}`, { method: 'GET' });
      console.log('Data pushed successfully');
    } catch (err) {
      console.error('Error pushing data:', err);
    }
  };

  // --- Fetch & Update Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_READ_URL);
        const result = await response.json();
        console.log('Objectdata:', result);

        const metrics = result?.data?.operationalMetrics || {};
        const maintenance = result?.data?.maintenanceLog || {};
        const condition = result?.data?.conditionMonitoring || {};

        setData(prev => {
          const updatedData = {
            ...prev,
            Wind: metrics.wind ?? prev.Wind,
            width: metrics.beltWidth ?? prev.width,
            speed: metrics.speed ?? prev.speed,
            temp: metrics.beltTemp ?? prev.temp,
            motorTemp: metrics.motorTemp ?? prev.motorTemp,
            torque: metrics.torque ?? prev.torque,
            voltage: metrics.voltage ?? prev.voltage,
            current: metrics.current ?? prev.current,
            vibration: condition.vibration ?? prev.vibration,
            lubrication: condition.lubricant ?? prev.lubrication,
            tension: condition.tension ?? prev.tension,
            lastMaintenance: maintenance.lastService ?? prev.lastMaintenance,
            maintenanceCause: maintenance.cause ?? prev.maintenanceCause,
            performanceHistory: [
              ...prev.performanceHistory,
              {
                time: new Date().toLocaleTimeString('en-US', { second: '2-digit', minute: '2-digit' }),
                speed: metrics.speed ?? prev.speed,
                vibration: condition.vibration ?? prev.vibration
              }
            ].slice(-30)
          };

          // Push updated data to backend
          pushData(updatedData);

          return updatedData;
        });

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    const dataToDownload = { timestamp: new Date().toISOString(), ...data };
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
            <button onClick={handleDownload} className="download-button" title="Download All Current Data">
              <Download size={18} className="download-icon" /> Download Data
            </button>
          </div>
        </header>

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
            <div className='video-streaming'>
              <video className='live-video' src={Video} controls loop muted />
            </div>
            <h2 className="condition-section-title">Condition Monitoring</h2>
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              <StatusCard
                title="Vibration Sensor"
                status={data.vibration > 1.2 ? (data.vibration > 1.5 ? 'Critical' : 'Moderate') : 'Optimal'}
                isVibration value={data.vibration} unit="mm/s" icon={TrendingUp}
              />
              <StatusCard title="Lubrication" status={data.lubrication} icon={Settings} />
              <StatusCard title="Tension" status={data.tension} icon={Gauge} />
            </div>
            <div className="conveyor-container">
              <img src={conver} alt="Conveyor Belt" className="conveyor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
