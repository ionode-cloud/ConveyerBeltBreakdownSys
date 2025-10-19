import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../App.css"

const RealTimeChart = ({ data }) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="chart-container">
      <div className="chart-header-title">Real-time Performance & Vibration</div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={safeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorVibration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis
              yAxisId="left"
              stroke="#06b6d4"
              label={{ value: 'Speed (m/s)', angle: -90, position: 'insideLeft', fill: '#06b6d4' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#84cc16"
              label={{ value: 'Vibration (mm/s)', angle: 90, position: 'insideRight', fill: '#84cc16' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #06b6d4', borderRadius: '8px', color: '#fff' }}
              labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
              formatter={(value) => {
                // Safely format value
                return [`${typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : 'N/A'}`];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="speed"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorSpeed)"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="vibration"
              stroke="#84cc16"
              fillOpacity={1}
              fill="url(#colorVibration)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;
