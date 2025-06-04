import React from 'react';
import { CategoryProvider } from './contexts/CategoryContext';
import CategoriesPage from './pages/CategoriesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <CategoryProvider>
      <CategoriesPage />
    </CategoryProvider>
  );
}

export default App;