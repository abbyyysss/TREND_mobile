import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function LoginDescription({ text, style }) {
  return (
    <Text style={[styles.description, style]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    color: '#313638',
    textAlign: 'center',
    fontFamily: 'Gotham', // Make sure this font is loaded in your app
    lineHeight: 20,
  },
});