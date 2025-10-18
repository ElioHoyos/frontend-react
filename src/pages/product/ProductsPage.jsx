import React, { useMemo, useState } from 'react';
import { ArticleProvider, useArticleContext } from '../../contexts/ArticleContext';
import ArticleList from '../../components/article/ArticleList';
import ArticleForm from '../../components/article/ArticleForm';
import ArticleToolbar from '../../components/article/ArticleToolbar';
import StatCard from '../../components/common/StatCard';
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaCalendarTimes } from 'react-icons/fa';

function DashboardProducts() {
  const {
    items,
    totalElements,
    searchTerm, setSearchTerm
  } = useArticleContext();

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // KPIs (con lo que ya está cargado en la tabla)
  const stats = useMemo(() => {
    const now = new Date();
    const in30 = new Date(now); in30.setDate(in30.getDate() + 30);

    const activos = items.filter(i => i.state).length;
    const bajoStock = items.filter(i => (i.amount ?? 0) <= 10).length;
    const porVencer = items.filter(i => {
      if (!i.expiration_date) return false;
      const d = new Date(i.expiration_date);
      return d > now && d <= in30;
    }).length;

    return { activos, bajoStock, porVencer };
  }, [items]);

  const openDrawer = () => setShowOffcanvas(true);
  const closeDrawer = () => setShowOffcanvas(false);

  return (
    <div className="container-fluid px-2 px-lg-3 py-3">

      {/* Título + toolbar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
        <h1 className="h4 mb-2 mb-md-0">Gestión de Productos</h1>
      </div>
      <ArticleToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={openDrawer}
      />

      {/* KPIs */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaBoxOpen />}
            title="Total productos"
            value={totalElements}
            subtitle="en sistema"
            className="border-0"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaCheckCircle className="text-success" />}
            title="Activos"
            value={stats.activos}
            subtitle="visibles para venta"
            className="border-0"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaExclamationTriangle className="text-warning" />}
            title="Bajo stock"
            value={stats.bajoStock}
            subtitle="≤ 10 unidades"
            className="border-0"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaCalendarTimes className="text-danger" />}
            title="Por vencer"
            value={stats.porVencer}
            subtitle="próx. 30 días"
            className="border-0"
          />
        </div>
      </div>

      {/* Tabla */}
      <ArticleList />

      {/* Offcanvas para agregar */}
      <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`}
           tabIndex="-1" style={{ visibility: showOffcanvas ? 'visible' : 'hidden', width: '540px', maxWidth:'100%' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Agregar Producto</h5>
          <button type="button" className="btn-close" onClick={closeDrawer}></button>
        </div>
        <div className="offcanvas-body">
          {/* Para que el form no se vea “doble tarjeta”, lo envolvemos simple */}
          <div className="mb-3">
            <ArticleForm onSaved={closeDrawer} />
          </div>
        </div>
      </div>
      {showOffcanvas && <div className="offcanvas-backdrop fade show" onClick={closeDrawer} />}
    </div>
  );
}

export default function ProductsPage() {
  // Envolvemos esta página con el provider de artículos
  return (
    <ArticleProvider>
      <DashboardProducts />
    </ArticleProvider>
  );
}
