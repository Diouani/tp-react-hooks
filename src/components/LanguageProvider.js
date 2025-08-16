import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    fr: 'Français',
    en: 'English', 
    es: 'Español'
  };

  const languageFlags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    es: '🇪🇸'
  };

  return (
    <div className="dropdown">
      <button
        className={`btn ${isDarkTheme ? 'btn-outline-light' : 'btn-outline-dark'} btn-sm dropdown-toggle`}
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {languageFlags[currentLanguage]} {languageNames[currentLanguage]}
      </button>
      <ul 
        className={`dropdown-menu ${isDarkTheme ? 'dropdown-menu-dark' : ''}`} 
        aria-labelledby="languageDropdown"
      >
        {availableLanguages.map(lang => (
          <li key={lang}>
            <button
              className={`dropdown-item ${currentLanguage === lang ? 'active' : ''}`}
              onClick={() => changeLanguage(lang)}
            >
              {languageFlags[lang]} {languageNames[lang]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;