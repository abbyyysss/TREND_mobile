import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useReportFilter } from '@/context/ReportFilterContext';

export default function ReportSummaryFilterNav() {
  const { colors, spacing, typography, radius, isDark } = useTheme();
  const { activeFilter, setActiveFilter } = useReportFilter();
  
  const filterOptions = ['Daily Breakdown', 'Guest Nights', 'Guest Check-ins'];

  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: 'hidden',
        height: 'auto',
      }}
    >
      {filterOptions.map((filter, index) => {
        const isActive = activeFilter === filter;
        const isLastItem = index === filterOptions.length - 1;

        return (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.xs,
              backgroundColor: isActive
                ? isDark
                  ? '#0B0B0B'
                  : '#F4F4F4'
                : 'transparent',
              borderRightWidth: isLastItem ? 0 : 1,
              borderRightColor: colors.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: isActive ? '#D4AF37' : colors.text,
                fontSize: typography.fontSize.sm,
                textAlign: 'center',
                fontWeight: typography.weight.medium,
              }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}