import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    colors: {
      background: isDark ? '#1a1a1a' : '#ffffff',
      text: isDark ? '#ffffff' : '#000000',
      primary: Platform.select({
        ios: '#007AFF', // iOS blue
        android: '#2196F3', // Material blue
        default: '#007AFF',
      }),
      secondary: isDark ? '#404040' : '#f4f4f5',
      border: isDark ? '#404040' : '#e4e4e7',
      placeholder: isDark ? '#808080' : '#71717a',
      // iOS specific colors
      iosBackground: isDark ? '#000000' : '#F2F2F7',
      iosGroupedBackground: isDark ? '#1C1C1E' : '#FFFFFF',
      iosSystemGray: isDark ? '#8E8E93' : '#8E8E93',
    },
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
