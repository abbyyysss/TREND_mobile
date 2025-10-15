import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ onPress, label, style }) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons name="arrow-back" size={25} color="#313638" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#313638',
  },
});