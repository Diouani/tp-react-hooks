import React, {useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../App';

const ProductSearch = ({ searchTerm, onSearchChange }) => {
  const { isDarkTheme } = useContext(ThemeContext);
  // TODO: Exercice 2.1 - Utiliser le LanguageContext

  // DONE: Exercice 1.2 - Utiliser le hook useDebounce

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Rechercher un produit..."
        className={`form-control ${isDarkTheme ? 'bg-dark text-light' : ''}`}
      />
    </div>
  );
};

export default ProductSearch;