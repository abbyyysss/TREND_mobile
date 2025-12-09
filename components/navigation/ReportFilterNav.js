import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';

export default function ReportFilterNav({ activeFilter, onFilterChange }) {
  const { colors, spacing, typography, radius, isDark } = useTheme();
  const { user, role } = useAuth();
  const u = user?.user_profile;

  // For AE role, we check the AEProfile and display the AE type and report mode
  const aeType = role === 'AE' ? u?.type : null; // AEProfile contains the type field
  const reportMode = role === 'AE' ? u?.report_mode : null; // AEProfile contains the report_mode field

  let filterOptions = ['All', 'Auto', 'Pending', 'Submitted', 'Flagged', 'Missing'];

  if (role === 'AE') {
    if (reportMode === AEReportMode.DAILY) {
      filterOptions = ['All', 'Auto', 'Flagged'];
    } else {
      filterOptions = ['All', 'Pending', 'Submitted', 'Flagged', 'Missing'];
    }
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
        }}
      >
        {filterOptions.map((filter, index) => {
          const isActive = activeFilter === filter;
          const isLastItem = index === filterOptions.length - 1;

          return (
            <TouchableOpacity
              key={filter}
              onPress={() => onFilterChange(filter)}
              style={{
                minWidth: 80,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                backgroundColor: isActive
                  ? isDark
                    ? '#0B0B0B'
                    : '#F4F4F4'
                  : 'transparent',
                borderRightWidth: isLastItem ? 0 : 1,
                borderRightColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: isActive ? '#D4AF37' : colors.text,
                  fontSize: typography.fontSize.sm,
                  textAlign: 'center',
                  fontWeight: typography.weight.medium,
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}