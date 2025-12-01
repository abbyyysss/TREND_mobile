// PrimaryModalHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function PrimaryModalHeader({ onClose, label }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <Text style={[
        styles.label,
        isDark && styles.labelDark
      ]}>
        {label}
      </Text>
      
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <AntDesign
          name="close"
          size={24}
          color={isDark ? '#D5D6D7' : '#313638'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  containerLight: {
    backgroundColor: '#F3F3F3',
  },
  containerDark: {
    backgroundColor: '#1C1C1C',
  },
  label: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#313638',
  },
  labelDark: {
    color: '#D5D6D7',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
});