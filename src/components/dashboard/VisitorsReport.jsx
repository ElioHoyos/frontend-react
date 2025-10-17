import React from 'react';

const VisitorsReport = () => (
  <div className="card border-0 shadow">
    <div className="card-header bg-white d-flex align-items-center justify-content-between">
      <h5 className="mb-0">Visitors Report</h5>
      <div className="text-muted small">Widget demo</div>
    </div>
    <div className="card-body">
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="p-3 rounded border h-100">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center me-3" style={{width:44,height:44}}>
                <i className="bi bi-geo-alt-fill" />
              </div>
              <div>
                <div className="small text-muted">Unique Visitors</div>
                <div className="h5 mb-0">8,390</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="p-3 rounded border h-100">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center me-3" style={{width:44,height:44}}>
                <i className="bi bi-bar-chart-fill" />
              </div>
              <div>
                <div className="small text-muted">Page Views</div>
                <div className="h5 mb-0">12,450</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VisitorsReport;
