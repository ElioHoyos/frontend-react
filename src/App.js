import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CategoryProvider } from './contexts/CategoryContext';

import AdminLayout from './layouts/AdminLayout';

// Páginas
import CategoriesPage from './pages/category/CategoriesPage';
import ProductsPage from './pages/product/ProductsPage';
import SalesPage from './pages/sales/SalesPage';
import ReportsPage from './pages/reports/ReportsPage';
import DashboardPage from './pages/dashboard/DashboardPage'; // tu dashboard actual

function App() {
  return (
    <Router>
      <AdminLayout>
        <CategoryProvider>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
          </Routes>
        </CategoryProvider>
      </AdminLayout>
    </Router>
  );
}
export default App;
