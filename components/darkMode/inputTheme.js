
// theme.js
export const getDesignTokens = (mode) => ({
  colors: {
    mode,
    ...(mode === 'light'
      ? {
          primary: '#1976d2',
          background: '#ffffff',
          paper: '#f5f5f5',
          text: '#000000',
          textSecondary: '#666666',
          input: '#1e1e1e',
          border: '#e0e0e0',
        }
      : {
          primary: '#90caf9',
          background: '#121212',
          paper: '#1d1d1d',
          text: '#ffffff',
          textSecondary: '#b0b0b0',
          input: '#d2d2d2',
          border: '#333333',
        }),
  },
  typography: {
    fontFamily: 'System', // You can use custom fonts with expo-font
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
});
