import React from 'react';

const KpiCard = ({ icon, title, value, color = 'primary' }) => (
  <div className="card border-0 shadow h-100">
    <div className="card-body d-flex align-items-center">
      <div className={`rounded-3 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center`} style={{ width: 54, height: 54 }}>
        <i className={`bi ${icon} fs-4`} />
      </div>
      <div className="ms-3">
        <div className="text-muted small">{title}</div>
        <div className="h4 mb-0">{value}</div>
      </div>
    </div>
  </div>
);

export default KpiCard;
