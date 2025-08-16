import React, { createContext, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Contexte pour le thème
export const ThemeContext = createContext();

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <LanguageProvider>
      <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
        <div className={`App ${isDarkTheme ? 'bg-dark text-light' : 'bg-light'}`} style={{ minHeight: '100vh' }}>
          <Header />
          <div className="container py-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ProductList searchTerm={searchTerm} />
          </div>
        </div>
      </ThemeContext.Provider>
    </LanguageProvider>
  );
}

export default App;