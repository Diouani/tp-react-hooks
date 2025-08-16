import { useState, useEffect, useCallback } from 'react';
import useDebounce from "./useDebounce";

const useProductSearch = (searchTerm = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Fonction de rechargement
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const response = await fetch(
        `https://api.daaif.net/products?delay=1000&limit=${itemsPerPage}&skip=${skip}`
      );
      
      if (!response.ok) throw new Error('Erreur réseau');
      
      const data = await response.json();
      setProducts(data.products);
      setTotalProducts(data.total);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Fonctions de pagination
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Chargement initial et rechargement lors du changement de page
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await fetch(
          `https://api.daaif.net/products?delay=1000&limit=${itemsPerPage}&skip=${skip}`
        );
        
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage]);

  // Filtrage des produits quand le terme de recherche change
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTermLower = debouncedSearchTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower)
    );

    setFilteredProducts(filtered);
  }, [debouncedSearchTerm, products]);

  return { 
    products: filteredProducts,
    loading, 
    error,
    reload,
    // États et fonctions de pagination
    currentPage,
    totalPages,
    totalProducts,
    itemsPerPage,
    nextPage,
    previousPage,
    goToPage,
    // Indicateurs pour les boutons
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

export default useProductSearch;
