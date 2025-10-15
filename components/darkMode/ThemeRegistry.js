import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getDesignTokens } from './components/darkMode/inputTheme';

const ThemeContext = createContext();

export const ThemeRegistry = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Auto-detect system theme
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const tokens = getDesignTokens(theme);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, tokens, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
export default ThemeRegistry;