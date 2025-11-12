import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SecondaryModalHeader({ onClose, label }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#1C1C1C' : '#F3F3F3';
  const textColor = isDark ? '#d5d6d7' : '#313638';
  const iconColor = isDark ? '#d5d6d7' : '#313638';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={styles.iconButton}
        activeOpacity={0.6}
      >
        <Ionicons 
          name="close" 
          size={24} 
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});