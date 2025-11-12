import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';

export default function LoadingOverlay({ message = "Loading..." }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color={isDark ? '#E5E7EB' : '#313638'} 
        />
        <Text style={[
          styles.message,
          { color: isDark ? '#E5E7EB' : '#313638' }
        ]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});