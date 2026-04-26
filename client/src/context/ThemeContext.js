import { createContext, useContext, useState, useLayoutEffect } from 'react';

const ThemeContext = createContext();

const applyTheme = (darkMode) => {
  const root = document.documentElement;
  if (darkMode) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  useLayoutEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    applyTheme(darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);