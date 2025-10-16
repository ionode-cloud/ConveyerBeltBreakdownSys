import React from 'react';
import "../App.css"
const StatusCard = ({ title, status, icon: Icon, isVibration = false, value, unit }) => {
  let color = '#84cc16'; // Optimal
  if (status === 'Moderate' || status === 'Suboptimal') color = '#facc15';
  if (status === 'Critical' || status === 'Poor') color = '#ef4444';

  const displayValue = isVibration ? `${value.toFixed(2)} ${unit}` : status;

  return (
    <div className="status-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="status-header">
        <Icon size={20} style={{ color }} />
        <span className="status-title">{title}</span>
      </div>
      <div className="status-value-display" style={{ color }}>{displayValue}</div>
      {isVibration && <span className="status-recommendation" style={{ color: '#9ca3af' }}>{status}</span>}
    </div>
  );
};

export default StatusCard;
