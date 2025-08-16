import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import useProductSearch from '../hooks/useProductSearch';

const ProductList = ({ searchTerm }) => {
  const { isDarkTheme } = useContext(ThemeContext);
  const { t } = useLanguage();

  const {
    products, 
    loading, 
    error,
    reload,
    currentPage,
    totalPages,
    totalProducts,
    nextPage,
    previousPage,
    goToPage,
    hasNextPage,
    hasPreviousPage
  } = useProductSearch(searchTerm);
  
  if (loading) return (
    <div className="text-center my-4">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger" role="alert">
      {t('error')}: {error}
      <div className="mt-2">
        <button 
          className="btn btn-outline-danger btn-sm" 
          onClick={reload}
        >
          {t('reload')}
        </button>
      </div>
    </div>
  );

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajuster si on est près de la fin
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  return (
    <div>
      {/* Bouton de rechargement et informations */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button 
            className={`btn ${isDarkTheme ? 'btn-outline-light' : 'btn-outline-primary'} btn-sm`}
            onClick={reload}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>
            {t('reload')}
          </button>
        </div>
        <div className={`text-${isDarkTheme ? 'light' : 'muted'} small`}>
          {totalProducts} {t('products')} - {t('page')} {currentPage} {t('of')} {totalPages}
        </div>
      </div>

      {/* Liste des produits */}
      {products.length === 0 ? (
        <div className={`text-center py-5 text-${isDarkTheme ? 'light' : 'muted'}`}>
          <i className="fas fa-search fa-3x mb-3"></i>
          <p>{t('noResults')}</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <div className={`card h-100 ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}>
                {product.thumbnail && (
                  <img 
                    src={product.thumbnail} 
                    className="card-img-top" 
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>{t('price')}: </strong>
                    <span className="text-success fw-bold">{product.price}€</span>
                  </p>
                  {product.rating && (
                    <div className="mb-2">
                      <small className={`text-${isDarkTheme ? 'light' : 'muted'}`}>
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                        <span className="ms-1">({product.rating})</span>
                      </small>
                    </div>
                  )}
                  {product.category && (
                    <span className={`badge ${isDarkTheme ? 'bg-secondary' : 'bg-light text-dark'} text-capitalize`}>
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Contrôles de pagination */}
      {totalPages > 1 && (
        <nav className="mt-4" aria-label="Navigation des pages">
          <ul className="pagination justify-content-center">
            {/* Bouton Précédent */}
            <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
              <button 
                className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}
                onClick={previousPage}
                disabled={!hasPreviousPage}
              >
                <i className="fas fa-chevron-left me-1"></i>
                {t('previous')}
              </button>
            </li>
            
            {/* Première page si nécessaire */}
            {currentPage > 3 && (
              <>
                <li className="page-item">
                  <button 
                    className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}
                    onClick={() => goToPage(1)}
                  >
                    1
                  </button>
                </li>
                {currentPage > 4 && (
                  <li className="page-item disabled">
                    <span className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}>...</span>
                  </li>
                )}
              </>
            )}
            
            {/* Numéros de pages */}
            {getPageNumbers().map(pageNum => (
              <li key={pageNum} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                <button 
                  className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''} ${pageNum === currentPage ? (isDarkTheme ? 'bg-primary' : '') : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            ))}
            
            {/* Dernière page si nécessaire */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <li className="page-item disabled">
                    <span className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}>...</span>
                  </li>
                )}
                <li className="page-item">
                  <button 
                    className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}
                    onClick={() => goToPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}
            
            {/* Bouton Suivant */}
            <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
              <button 
                className={`page-link ${isDarkTheme ? 'bg-dark text-light border-secondary' : ''}`}
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                {t('next')}
                <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </li>
          </ul>
          
          {/* Informations sur la pagination */}
          <div className={`text-center mt-2 text-${isDarkTheme ? 'light' : 'muted'} small`}>
            {t('page')} {currentPage} {t('of')} {totalPages} ({totalProducts} {t('products')} au total)
          </div>
        </nav>
      )}
    </div>
  );
};

export default ProductList;