import React from 'react';

const StatItem = ({ title, value, delta, color='secondary' }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className="border rounded-3 p-3 h-100">
      <div className="small text-muted">{title}</div>
      <div className="d-flex align-items-baseline justify-content-between">
        <div className="h5 mb-0">{value}</div>
        <span className={`badge bg-${color} bg-opacity-10 text-${color}`}>{delta}</span>
      </div>
    </div>
  </div>
);

const StatSummaryStrip = ({ items = [] }) => (
  <div className="row g-3">
    {items.map((it, i) => <StatItem key={i} {...it} />)}
  </div>
);

export default StatSummaryStrip;
