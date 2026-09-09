import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Dark mode por defecto para Admin
  });

  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('custom_accent_color') || '#00ff88';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', customColor);
    localStorage.setItem('custom_accent_color', customColor);
  }, [customColor]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? 'dark' : 'light',
        isDark,
        toggleTheme,
        customColor,
        setCustomColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export default ThemeContext;
