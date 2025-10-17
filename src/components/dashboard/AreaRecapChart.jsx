import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const AreaRecapChart = ({ title, subtitle, labels = [], series = [] }) => {
  const data = useMemo(() => ({
    labels,
    datasets: series.map(s => ({
      label: s.label,
      data: s.data,
      fill: true,
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.35
    }))
  }), [labels, series]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  }), []);

  return (
    <div className="card border-0 shadow h-100">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <span className="text-muted small">{subtitle}</span>
      </div>
      <div className="card-body">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default AreaRecapChart;
