// PrimaryModalHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function PrimaryModalHeader({ onClose, label }) {
  const { colors, isDark, radius, fonts } = useTheme(); 

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.secondary,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }
    ]}>
      <Text style={[
        styles.label,
        { color: colors.foreground, 
          fontFamily: fonts.gotham
         }
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
          color={colors.foreground}
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
    overflow: 'hidden', 
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
});