import { useState, useEffect } from 'react';
import useDebounce from "./useDebounce";

// TODO: Exercice 3.1 - Créer le hook useDebounce
// TODO: Exercice 3.2 - Créer le hook useLocalStorage

const useProductSearch = (searchTerm = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // TODO: Exercice 4.2 - Ajouter l'état pour la pagination
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Exercice 4.2 - Modifier l'URL pour inclure les paramètres de pagination
        const response = await fetch('https://api.daaif.net/products?delay=1000');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // TODO: Exercice 4.2 - Ajouter les dépendances pour la pagination


  // Filter products when search term changes
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

  // TODO: Exercice 4.1 - Ajouter la fonction de rechargement
  // TODO: Exercice 4.2 - Ajouter les fonctions pour la pagination

  return { 
    products: filteredProducts,
    loading, 
    error,
    // TODO: Exercice 4.1 - Retourner la fonction de rechargement
    // TODO: Exercice 4.2 - Retourner les fonctions et états de pagination
  };
};

export default useProductSearch;