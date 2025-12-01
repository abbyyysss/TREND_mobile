import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';


export default function AccreditedCheckInput({ text, value, onChange }) {
  const {colors, fonts} = useTheme();

  return (
    <View style={styles.checkContainer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.checkbox, { borderColor: colors.border, backgroundColor: value ? colors.checkboxChecked : 'transparent' }]}
          onPress={() => onChange(!value)}
          activeOpacity={0.7}
        >
          {value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={[styles.checkText, { color: colors.text, fontFamily: fonts.gotham }]}>{text}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border}]} />
      <Text style={[styles.helperText, { color: colors.textSecondary, fontFamily: fonts.gotham }]}>
        *Leave unchecked if not accredited. You can still proceed with the registration.
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
