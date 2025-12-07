// SecondaryModalHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function SecondaryModalHeader({ onClose, label }) {
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
          size={20}
          color={colors.foreground}
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
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
});