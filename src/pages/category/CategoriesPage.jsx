import React from 'react';
import CategoryForm from '../../components/category/CategoryForm';
import CategoryList from '../../components/category/CategoryList';

const CategoriesPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Gestión de Categorías</h1>
          </div>
          
          <CategoryForm />
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;