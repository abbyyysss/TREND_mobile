import React from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';

export default function MainHeaderTitle({ label }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Text 
      style={[
        styles.title,
        { color: isDark ? '#e5e7eb' : '#313638' }
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // Note: To use custom font 'Barabara', you need to load it first
    // fontFamily: 'Barabara',
  },
});