import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext'; 

const LoginTitle = ({ children, style }) => {
  const { colors, fonts } = useTheme();

  return (
    <Text 
      style={[
        styles.title, 
        { 
          color: colors.text, 
          fontFamily: 'Barabara'
        }, 
        style
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default LoginTitle;