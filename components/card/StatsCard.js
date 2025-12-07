import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function StatsCard({
  titleText,
  descriptionText,
  statsText,
  percentageText,
  titleTextSize = 14,
  statsTextSize = 32,
  percentageTextSize = 14,
  isIncreasing = false,
  isArrowTriangle = false,
  isIconChart = false,
  withDescription = false,
  withStats = true,
  withPercentage = true,
  isRed = false,
  isGreen = false,
  isLightGreen = false,
  isBlue = false,
  isDefault = false,
  helperText = "",
}) {
  const { colors, fonts, isDark } = useTheme();

  // Choose the correct icon based on conditions
  const getIconName = () => {
    if (isIconChart) {
      return isIncreasing ? 'trending-up' : 'trending-down';
    }
    if (isArrowTriangle) {
      return isIncreasing ? 'caret-up' : 'caret-down';
    }
    return isIncreasing ? 'arrow-up' : 'arrow-down';
  };

  // Determine container background and text colors
  const getContainerStyle = () => {
    if (isRed) return { backgroundColor: '#EF1A25', color: '#FFFFFF' };
    if (isBlue) return { backgroundColor: '#3B82F6', color: '#FFFFFF' };
    if (isGreen) return { backgroundColor: '#7CB530', color: '#FFFFFF' };
    if (isLightGreen) return { backgroundColor: '#52C62D', color: '#FFFFFF' };
    if (isDefault) return { backgroundColor: '#EBC855', color: '#FFFFFF' };
    return {
      backgroundColor: isDark ? colors.surface : '#FFFFFF',
      color: isDark ? colors.text : '#000000',
      borderWidth: 1,
      borderColor: colors.border,
    };
  };

  const containerColors = getContainerStyle();
  const hasColoredBackground = isRed || isBlue || isGreen || isLightGreen || isDefault;

  return (
    <View style={[styles.container, containerColors]}>
      <Text style={[styles.title, { fontSize: titleTextSize, color: containerColors.color, fontFamily: fonts.gotham }]}>
        {titleText}
      </Text>
      
      {withDescription && (
        <Text style={[styles.description, { fontSize: titleTextSize, color: containerColors.color, fontFamily: fonts.gotham }]}>
          {descriptionText}
        </Text>
      )}
      
      <View style={[styles.statsContainer, !withStats && styles.statsContainerStart]}>
        <Text 
          style={[
            styles.stats, 
            { fontSize: statsTextSize, color: containerColors.color, fontFamily: fonts.gotham}
          ]}
          numberOfLines={1}
        >
          {statsText}
        </Text>
        
        {withPercentage && (
          <View style={[
            styles.percentageContainer,
            { backgroundColor: hasColoredBackground ? 'transparent' : 'transparent' }
          ]}>
            <Ionicons
              name={getIconName()}
              size={percentageTextSize}
              color={isIncreasing ? '#52C62D' : '#EB3223'}
            />
            {!isIconChart && (
              <Text style={[
                styles.percentageText,
                { fontSize: percentageTextSize },
                {fontFamily: fonts.gotham},
                { color: isIncreasing ? '#52C62D' : '#EB3223' }
              ]}>
                {percentageText}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {helperText !== "" && (
        <Text style={[styles.helperText, { color: containerColors.color, fontFamily: fonts.gotham }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    minHeight: 120,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontWeight: '400',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statsContainerStart: {
    justifyContent: 'flex-start',
  },
  stats: {
    fontWeight: 'bold',
    flex: 1,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentageText: {
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.8,
  },
});