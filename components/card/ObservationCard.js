import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ObservationCard({ 
  message = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam earum, exercitationem quaerat voluptate voluptatibus ab voluptatum reiciendis similique incidunt quos iure magni quas consequuntur odio totam. Nisi officiis assumenda labore?" 
}) {
  const { colors, isDark, radius, typography, spacing, fonts } = useTheme();
  
  return (
    <View style={[
      styles.container,
      {
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.lg,
        backgroundColor: isDark ? colors.surface : colors.card,
        shadowColor: isDark ? '#000' : colors.border,
      }
    ]}>
      <Text style={[
        styles.title,
        {
          fontSize: typography.fontSize.md,
          color: colors.text,
          fontFamily: fonts.gotham,
          marginBottom: spacing.sm,
        }
      ]}>
        Notes and Observations
      </Text>
      <Text style={[
        styles.message,
        {
          fontSize: typography.fontSize.sm,
          color: colors.textSecondary,
          fontFamily: fonts.gotham,
          lineHeight: 20,
        }
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: '500',
  },
  message: {
    lineHeight: 20,
  },
});