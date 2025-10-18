import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export default function RegisterCheckInput({ text, value, onChange }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    text: isDark ? '#d2d2d2' : '#1e1e1e',
    subText: '#828282',
    divider: '#D9D9D9',
    checkbox: value ? '#2196F3' : 'transparent',
    border: isDark ? '#666' : '#999',
  };

  return (
    <View style={styles.checkContainer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.checkbox, { borderColor: colors.border, backgroundColor: colors.checkbox }]}
          onPress={() => onChange(!value)}
          activeOpacity={0.7}
        >
          {value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={[styles.checkText, { color: colors.text }]}>{text}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Text style={[styles.helperText, { color: colors.subText }]}>
        *Leave unchecked if not applicable. You can still proceed with the registration.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkContainer: {
    width: '100%',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkText: {
    fontSize: 18,
    flex: 1,
  },
  divider: {
    width: '100%',
    height: 2,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    paddingHorizontal: 10,
  },
});
