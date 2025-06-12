import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CategoryProvider } from './contexts/CategoryContext'; // Asegúrate de importar tu CategoryProvider
import Navbar from './components/Navbar'; // Importa el nuevo componente Navbar
import CategoriesPage from './pages/category/CategoriesPage'; // Tu página existente
import ProductsPage from './pages/product/ProductsPage'; // Nueva página placeholder
import SalesPage from './pages/sales/SalesPage';     // Nueva página placeholder
import ReportsPage from './pages/reports/ReportsPage';   // Nueva página placeholder
import HomePage from './pages/home/HomePage'; // Nueva página placeholder para la raíz

function App() {
  return (
    <Router>
      {/* El Navbar va fuera de Routes para que se muestre en todas las páginas */}
      <Navbar /> 
      <div className="container mt-4"> {/* Un contenedor para el contenido de la página */}
        <CategoryProvider> {/* El CategoryProvider envuelve las rutas que lo necesitan */}
          <Routes>
            {/* Ruta para la página de inicio */}
            <Route path="/" element={<HomePage />} />
            
            {/* Ruta para la gestión de categorías */}
            <Route path="/categorias" element={<CategoriesPage />} />
            
            {/* Rutas para las nuevas páginas (placeholders por ahora) */}
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            
            {/* Puedes añadir una ruta para 404 Not Found si lo deseas */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </CategoryProvider>
      </div>
    </Router>
  );
}

export default App;