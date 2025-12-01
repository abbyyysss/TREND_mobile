// EditIconButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditIconButton({ onClick }) {
  return (
    <TouchableOpacity 
      style={styles.iconButton} 
      onPress={onClick}
      activeOpacity={0.7}
    >
      <MaterialIcons name="edit" size={30} color="#D4AF37" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});