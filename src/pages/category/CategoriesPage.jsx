// src/pages/category/CategoriesPage.jsx
import React from 'react';
import CategoryForm from '../../components/category/CategoryForm';
import CategoryList from '../../components/category/CategoryList';

const CategoriesPage = () => {
  return (
    <>
      <h2 className="page-title">Gestión de Categorías</h2>
      <div className="mb-3">
        <CategoryForm />
      </div>
      <CategoryList />
    </>
  );
};
export default CategoriesPage;
