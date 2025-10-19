import React from 'react';
import "../App.css"

const StatusCard = ({ title, status, icon: Icon, isVibration = false, value, unit }) => {
  let color = '#84cc16'; // Optimal
  if (status === 'Moderate' || status === 'Suboptimal') color = '#facc15';
  if (status === 'Critical' || status === 'Poor') color = '#ef4444';

  // Safely format vibration value
  const displayValue = isVibration 
    ? (typeof value === 'number' && !isNaN(value) ? `${value.toFixed(2)} ${unit}` : 'N/A') 
    : status || 'N/A';

  return (
    <div className="status-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="status-header">
        <Icon size={20} style={{ color }} />
        <span className="status-title">{title}</span>
      </div>
      <div className="status-value-display" style={{ color }}>{displayValue}</div>
      {isVibration && <span className="status-recommendation" style={{ color: '#9ca3af' }}>{status || 'N/A'}</span>}
    </div>
  );
};

export default StatusCard;
