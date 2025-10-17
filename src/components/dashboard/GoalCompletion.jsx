import React from 'react';
const colors = ['primary','success','warning','danger'];

const GoalCompletion = ({ title, items = [] }) => (
  <div className="card border-0 shadow h-100">
    <div className="card-header bg-white">
      <h5 className="mb-0">{title}</h5>
    </div>
    <div className="card-body">
      {items.map((g, idx) => (
        <div className="mb-3" key={g.label}>
          <div className="d-flex justify-content-between mb-1">
            <span className="small">{g.label}</span>
            <span className="small fw-semibold">{g.value}%</span>
          </div>
          <div className="progress" style={{height: 8}}>
            <div className={`progress-bar bg-${colors[idx % colors.length]}`} style={{width: `${g.value}%`}} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GoalCompletion;
