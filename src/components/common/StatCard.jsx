import React from 'react';

const StatCard = ({ icon, title, value, subtitle, className = '' }) => (
  <div className={`card shadow-sm ${className}`}>
    <div className="card-body d-flex align-items-center">
      <div className="me-3 fs-3">{icon}</div>
      <div>
        <div className="fw-semibold">{title}</div>
        <div className="fs-4 fw-bold">{value}</div>
        {subtitle && <div className="text-muted small">{subtitle}</div>}
      </div>
    </div>
  </div>
);

export default StatCard;
