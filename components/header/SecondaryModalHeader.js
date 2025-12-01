// SecondaryModalHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function SecondaryModalHeader({ onClose, label }) {
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
          size={20}
          color={isDark ? '#D5D6D7' : '#313638'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: '100%',
  },
  containerLight: {
    backgroundColor: '#F3F3F3',
  },
  containerDark: {
    backgroundColor: '#1C1C1C',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#313638',
  },
  labelDark: {
    color: '#D5D6D7',
  },
  closeButton: {
    padding: 4,
  },
});