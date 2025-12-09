import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function SummaryHelperText({ label, value = 0, isCheckIn = false }) {
  const { colors, spacing, typography, fonts } = useTheme();

  return (
    <View
      style={{
        paddingBottom: spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: typography.fontSize.md,
          lineHeight: typography.fontSize.md * 1.4,
          color: colors.text,
          fontFamily: fonts.gotham
        }}
      >
        <Text style={{ fontWeight: typography.weight.bold }}>
          {label} {isCheckIn ? 'Check-ins' : 'Guest nights'}:{' '}
        </Text>
        <Text>{value}</Text>
      </Text>
    </View>
  );
}