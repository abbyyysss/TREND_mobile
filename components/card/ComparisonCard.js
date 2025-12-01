import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function ComparisonCard({
  titleText,
  statsText,
  percentageText,
  comparisonText,
  accreditedValue,
  accreditedPct,
  unaccreditedValue,
  unaccreditedPct,
  isAE = false,
  isIncreasing = false,
  monthYearText
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[compStyles.container, isDark && compStyles.containerDark]}>
      <Text style={[compStyles.title, isDark && compStyles.titleDark]}>
        {titleText}
      </Text>
      
      <Text style={[compStyles.stats, isDark && compStyles.statsDark]}>
        {statsText}
      </Text>

      <View style={compStyles.contentRow}>
        {/* Left Section */}
        <View style={compStyles.section}>
          {isAE ? (
            <View style={compStyles.valueContainer}>
              <Text style={[compStyles.valueText, isDark && compStyles.valueTextDark]}>
                {accreditedValue}
              </Text>
            </View>
          ) : (
            <View style={compStyles.percentageContainer}>
              <Text style={[
                compStyles.arrow,
                { color: isIncreasing ? '#52C62D' : '#EB3223' }
              ]}>
                {isIncreasing ? '↑' : '↓'}
              </Text>
              <Text style={[
                compStyles.percentageText,
                { color: isIncreasing ? '#52C62D' : '#EB3223' }
              ]}>
                {percentageText}%
              </Text>
            </View>
          )}
          
          <Text style={compStyles.label}>
            {isAE ? 'Accredited' : 'Versus'}
          </Text>
        </View>

        {/* Divider */}
        <View style={[compStyles.divider, isDark && compStyles.dividerDark]} />

        {/* Right Section */}
        <View style={compStyles.section}>
          {isAE ? (
            <View style={compStyles.valueContainer}>
              <Text style={[compStyles.valueText, isDark && compStyles.valueTextDark]}>
                {unaccreditedValue}
              </Text>
            </View>
          ) : (
            <View style={compStyles.textContainer}>
              <Text style={[compStyles.comparisonValue, isDark && compStyles.comparisonValueDark]}>
                {comparisonText}
              </Text>
              <Text style={[compStyles.monthText, isDark && compStyles.monthTextDark]}>
                {monthYearText}
              </Text>
            </View>
          )}
          
          {isAE && (
            <Text style={[compStyles.label, compStyles.unaccreditedLabel]}>
              Unaccredited
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const compStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#374151',
  },
  title: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  titleDark: {
    color: '#9ca3af',
  },
  stats: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  statsDark: {
    color: '#f9fafb',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  dividerDark: {
    backgroundColor: '#374151',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  valueTextDark: {
    color: '#f9fafb',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  arrow: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  comparisonValueDark: {
    color: '#f9fafb',
  },
  monthText: {
    fontSize: 11,
    color: '#6b7280',
  },
  monthTextDark: {
    color: '#9ca3af',
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
  },
  accreditedLabel: {
    color: '#52C62D',
  },
  unaccreditedLabel: {
    color: '#EB3223',
  },
});