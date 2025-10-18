import React from 'react';
import { Text, StyleSheet } from 'react-native';

const LoginTitle = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default LoginTitle;