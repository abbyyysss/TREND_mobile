import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

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
  const { colors, isDark, radius, spacing, typography, fonts } = useTheme();

  // Define increase/decrease colors
  const increaseColor = '#52C62D';
  const decreaseColor = '#EB3223';

  return (
    <View style={[
      compStyles.container,
      {
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        backgroundColor: isDark ? colors.surface : colors.card,
        shadowColor: isDark ? '#000' : colors.border,
      }
    ]}>
      <Text style={[
        compStyles.title,
        {
          fontSize: typography.fontSize.xs,
          color: colors.textSecondary,
          fontFamily: fonts.gotham,
          marginBottom: spacing.xs - 2,
        }
      ]}>
        {titleText}
      </Text>
      
      <Text style={[
        compStyles.stats,
        {
          fontSize: typography.fontSize.xxl,
          color: colors.text,
          fontFamily: fonts.gotham,
          marginBottom: spacing.sm + 2,
        }
      ]}>
        {statsText}
      </Text>

      <View style={compStyles.contentRow}>
        {/* Left Section */}
        <View style={compStyles.section}>
          {isAE ? (
            <View style={compStyles.valueContainer}>
              <Text style={[
                compStyles.valueText,
                {
                  fontSize: typography.fontSize.md,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                }
              ]}>
                {accreditedValue}
              </Text>
            </View>
          ) : (
            <View style={compStyles.percentageContainer}>
              <Text style={[
                compStyles.arrow,
                {
                  fontSize: typography.fontSize.sm,
                  fontFamily: fonts.gotham,
                  color: isIncreasing ? increaseColor : decreaseColor,
                }
              ]}>
                {isIncreasing ? '↑' : '↓'}
              </Text>
              <Text style={[
                compStyles.percentageText,
                {
                  fontSize: typography.fontSize.sm,
                  fontFamily: fonts.gotham,
                  color: isIncreasing ? increaseColor : decreaseColor,
                }
              ]}>
                {percentageText}%
              </Text>
            </View>
          )}
          
          <Text style={[
            compStyles.label,
            {
              fontSize: typography.fontSize.xs - 1,
              color: colors.textSecondary,
              fontFamily: fonts.gotham,
            }
          ]}>
            {isAE ? 'Accredited' : 'Versus'}
          </Text>
        </View>

        {/* Divider */}
        <View style={[
          compStyles.divider,
          {
            backgroundColor: colors.border,
            marginHorizontal: spacing.sm - 4,
          }
        ]} />

        {/* Right Section */}
        <View style={compStyles.section}>
          {isAE ? (
            <View style={compStyles.valueContainer}>
              <Text style={[
                compStyles.valueText,
                {
                  fontSize: typography.fontSize.md,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                }
              ]}>
                {unaccreditedValue}
              </Text>
            </View>
          ) : (
            <View style={compStyles.textContainer}>
              <Text style={[
                compStyles.comparisonValue,
                {
                  fontSize: typography.fontSize.sm,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                  marginBottom: 2,
                }
              ]}>
                {comparisonText}
              </Text>
              <Text style={[
                compStyles.monthText,
                {
                  fontSize: typography.fontSize.xs - 1,
                  color: colors.textSecondary,
                  fontFamily: fonts.gotham,
                }
              ]}>
                {monthYearText}
              </Text>
            </View>
          )}
          
          {isAE && (
            <Text style={[
              compStyles.label,
              {
                fontSize: typography.fontSize.xs - 1,
                color: colors.textSecondary,
                fontFamily: fonts.gotham,
              }
            ]}>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontWeight: '400',
  },
  stats: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
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
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontWeight: '600',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  arrow: {
    fontWeight: 'bold',
  },
  percentageText: {
    fontWeight: '600',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  comparisonValue: {
    fontWeight: '600',
  },
  monthText: {
    fontWeight: '400',
  },
  label: {
    fontWeight: '400',
  },
});