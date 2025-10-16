import React from 'react';
import "../App.css"

const MetricCard = ({ title, value, unit, icon: Icon, color }) => {
  const isCritical = value > 65 && title.includes("Temp");
  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <div className="metric-card" style={{ borderColor: '#374151' }}>
      <div className="icon-wrapper" style={{ backgroundColor: color }}>
        <Icon size={24} />
      </div>
      <div className="card-title">{title}</div>
      <div className="card-value" style={{ color: isCritical ? '#ef4444' : '#fff' }}>
        {displayValue} <span className="card-unit">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
