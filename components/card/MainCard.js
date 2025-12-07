
import React from 'react';
import { View, ScrollView, StyleSheet, } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainCard({
  children,
  shadowColor = '#9ca3af',
  borderRadius = 8,
  scrollable = false,
  padding = 0,
  style = {},
}) {
  const {fonts, colors, isDark} = useTheme();

  const containerStyle = [
    mainStyles.container,
    {
      borderColor: colors.border,
      borderRadius,
      padding,
      backgroundColor: isDark ? colors.surface : '#fff',
    },
    style,
  ];

  const shadowStyle = {
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  if (scrollable) {
    return (
      <ScrollView
        style={[containerStyle, shadowStyle]}
        contentContainerStyle={mainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, shadowStyle]}>
      {children}
    </View>
  );
}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    flexGrow: 1,
  },
});