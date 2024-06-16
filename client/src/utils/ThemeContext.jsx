import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme) {
      setIsDarkTheme(JSON.parse(savedTheme));
      document.body.classList.toggle('dark', JSON.parse(savedTheme));
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => {
      const newTheme = !prevTheme;
      localStorage.setItem('dark-theme', JSON.stringify(newTheme));
      document.body.classList.toggle('dark', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
