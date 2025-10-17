import React, { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import './admin-layout.css';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(v => !v);
  const toggleMobile = () => setMobileOpen(v => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={`al-wrapper ${collapsed ? 'al-collapsed' : ''} ${mobileOpen ? 'al-mobile-open' : ''}`}>
      <Sidebar onNavigate={closeMobile} />
      <div className="al-main">
        <Topbar onToggleSidebar={toggleCollapse} onToggleMobile={toggleMobile} />
        <main className="al-content container-fluid py-3">
          {children}
        </main>
      </div>
      {/* backdrop móvil */}
      {mobileOpen && <div className="al-backdrop" onClick={closeMobile} />}
    </div>
  );
};

export default AdminLayout;
