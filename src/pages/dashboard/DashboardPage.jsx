import React, { useMemo } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';
import KpiCard from '../../components/dashboard/KpiCard';
import AreaRecapChart from '../../components/dashboard/AreaRecapChart';
import GoalCompletion from '../../components/dashboard/GoalCompletion';
import StatSummaryStrip from '../../components/dashboard/StatSummaryStrip';
import VisitorsReport from '../../components/dashboard/VisitorsReport';

const DashboardPage = () => {
  const { categories, totalElements } = useCategoryContext();

  // KPIs reales desde categorías (puedes sustituir por endpoints de ventas/likes/etc.)
  const active = categories.filter(c => c.state).length;
  const inactive = categories.length - active;

  const lastUpdated = useMemo(() => {
    const last = categories
      .map(c => c.dateModified || c.dateCreated)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];
    return last || '—';
  }, [categories]);

  // Demo: datos de ventas (cámbialos por tu API cuando la tengas)
  const salesSeries = [
    { label: 'Online', data: [25, 40, 28, 55, 42, 75, 90] },
    { label: 'Tienda', data: [15, 22, 20, 30, 25, 35, 45] }
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // “Goal completion” demo (usa tus propios KPIs después)
  const goals = [
    { label: 'Add Products to Cart', value: 80 },
    { label: 'Complete Purchase', value: 55 },
    { label: 'Visit Premium Page', value: 40 },
    { label: 'Send Inquiries', value: 70 }
  ];

  // Strip de stats (demo)
  const stripStats = [
    { title: 'TOTAL REVENUE', value: '$35,210.43', delta: '+17%', color: 'success' },
    { title: 'TOTAL COST', value: '$10,390.90', delta: '0%', color: 'secondary' },
    { title: 'TOTAL PROFIT', value: '$24,831.53', delta: '+20%', color: 'success' },
    { title: 'GOAL COMPLETION', value: '1200', delta: '-18%', color: 'danger' }
  ];

  return (
    <div className="row g-4">
      {/* Top KPIs */}
      <div className="col-12 col-md-6 col-xl-3">
        <KpiCard icon="bi-cpu" title="CPU TRAFFIC" value="90%" color="info" />
      </div>
      <div className="col-12 col-md-6 col-xl-3">
        <KpiCard icon="bi-hand-thumbs-up-fill" title="LIKES" value="41,410" color="danger" />
      </div>
      <div className="col-12 col-md-6 col-xl-3">
        <KpiCard icon="bi-bag-check-fill" title="SALES" value="760" color="success" />
      </div>
      <div className="col-12 col-md-6 col-xl-3">
        <KpiCard icon="bi-people-fill" title="NEW MEMBERS" value="2,000" color="warning" />
      </div>

      {/* Monthly Recap + Goals (como AdminLTE) */}
      <div className="col-12 col-xxl-8">
        <AreaRecapChart
          title="Monthly Recap Report"
          subtitle="Sales | Jan - Jul"
          labels={months}
          series={salesSeries}
        />
        <div className="mt-3">
          <StatSummaryStrip items={stripStats} />
        </div>
      </div>
      <div className="col-12 col-xxl-4">
        <GoalCompletion title="Goal Completion" items={goals} />
        <div className="card shadow-sm mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small">Categorías (total)</div>
                <div className="h4 mb-0">{totalElements}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Última actualización</div>
                <div className="h6 mb-0">{lastUpdated}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-success me-2" style={{width:60}}>Activas</span>
                <div className="progress flex-grow-1" style={{height:8}}>
                  <div className="progress-bar bg-success" style={{width: `${totalElements ? (active*100/totalElements).toFixed(0) : 0}%`}} />
                </div>
                <span className="ms-2 small">{active}</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-danger me-2" style={{width:60}}>Inactivas</span>
                <div className="progress flex-grow-1" style={{height:8}}>
                  <div className="progress-bar bg-danger" style={{width: `${totalElements ? (inactive*100/totalElements).toFixed(0) : 0}%`}} />
                </div>
                <span className="ms-2 small">{inactive}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitors Report (widget lateral tipo AdminLTE) */}
      <div className="col-12">
        <VisitorsReport />
      </div>
    </div>
  );
};

export default DashboardPage;
