// EditIconButton.js - Fixed version
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditIconButton({ onPress, onClick }) {
  // Support both prop names for backward compatibility
  const handlePress = onPress || onClick;
  
  return (
    <TouchableOpacity 
      style={styles.iconButton} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="edit" size={30} color="#D4AF37" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 4,
    borderRadius: 20,
  },
});