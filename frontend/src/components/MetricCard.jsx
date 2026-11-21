import React from 'react';

const MetricCard = ({ label, value, subtext, icon: Icon, iconColor = '#15803d', iconBg = '#dcfce7', isAccentGold = false }) => {
  return (
    <div className="metric-card">
      <div className={isAccentGold ? 'metric-card-accent-gold' : 'metric-card-accent'}></div>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className="metric-icon-box" style={{ backgroundColor: iconBg, color: iconColor }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
};

export default MetricCard;
