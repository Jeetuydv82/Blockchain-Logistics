import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const colors = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }, [darkMode, colors]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const lightTheme = {
  background: '#f0f2f5',
  card: '#ffffff',
  cardHover: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f1f5f9',
  primary: '#4f46e5',
  primaryHover: '#4338ca',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  badge: '#f1f5f9',
};

const darkTheme = {
  background: '#0f172a',
  card: '#1e293b',
  cardHover: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#334155',
  borderLight: '#475569',
  primary: '#6366f1',
  primaryHover: '#818cf8',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
  purple: '#a78bfa',
  inputBg: '#334155',
  inputBorder: '#475569',
  badge: '#475569',
};

export { lightTheme, darkTheme };