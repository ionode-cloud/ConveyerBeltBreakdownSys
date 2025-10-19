import React from 'react';
import "../App.css"

const MetricCard = ({ title, value, unit, icon: Icon, color }) => {
  // Fallback to 0 if value is undefined or null
  const safeValue = (typeof value === 'number' && !isNaN(value)) ? value.toFixed(1) : 'N/A';

  const isCritical = value > 65 && title.includes("Temp");

  return (
    <div className="metric-card" style={{ borderColor: '#374151' }}>
      <div className="icon-wrapper" style={{ backgroundColor: color }}>
        <Icon size={24} />
      </div>
      <div className="card-title">{title}</div>
      <div className="card-value" style={{ color: isCritical ? '#ef4444' : '#fff' }}>
        {safeValue} {unit && <span className="card-unit">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
