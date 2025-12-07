// CameraIconButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CameraIconButton({ onClick, onPress }) {
  const handlePress = onPress || onClick; // Support both prop names
  
  return (
    <TouchableOpacity 
      style={styles.iconButton} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <FontAwesome name="camera" size={25} color="#D4AF37" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});