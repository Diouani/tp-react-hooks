import { useState, useEffect } from 'react';


const useLocalStorage = (key, initialValue) => {
  // Fonction pour récupérer la valeur depuis le localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture du localStorage pour la clé "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      // Permettre à la valeur d'être une fonction pour la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Sauvegarder dans le localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur lors de l'écriture dans le localStorage pour la clé "${key}":`, error);
    }
  };

  // Écouter les changements du localStorage dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erreur lors de la synchronisation du localStorage pour la clé "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
