import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function NoResultsText({ text = "No results found.", isGap = true }) {
  const {fonts, colors, isDark} = useTheme();

  return (
    <View style={[
      styles.container,
      isGap && styles.containerWithGap
    ]}>
      <Ionicons 
        name="file-tray-outline" 
        size={48} 
        color={isDark ? colors.textSecondary : '#A0A0A0'} 
      />
      <Text style={[
        styles.text,
        { color: isDark ? colors.textSecondary : '#606060', fontFamily: fonts.gotham }
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithGap: {
    paddingVertical: 40,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});