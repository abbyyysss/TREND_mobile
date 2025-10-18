import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <TouchableOpacity 
      style={styles.toggleButton}
      onPress={onToggle}
      accessibilityLabel="Toggle dark mode"
    >
      <Ionicons 
        name={isDark ? 'moon' : 'sunny'} 
        size={30} 
        color={isDark ? '#facc15' : '#fcd34d'} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default DarkModeToggle;