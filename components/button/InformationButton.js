import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function InfoButton({ 
  iconSize = 20, 
  helperText = 'More information about this field',
  autoHideDuration = 3000, // 3 seconds
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors, fonts, isDark, typography, radius, spacing } = useTheme();

  useEffect(() => {
    let timer;

    if (showTooltip) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Auto-hide after duration
      timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowTooltip(false));
      }, autoHideDuration);
    }

    return () => clearTimeout(timer);
  }, [showTooltip, fadeAnim, autoHideDuration]);

  const toggleTooltip = () => {
    if (!showTooltip) {
      setShowTooltip(true);
    } else {
      // manual close
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowTooltip(false));
    }
  };

  const tooltipBg = isDark ? 'rgba(63, 63, 63, 0.95)' : 'rgba(45, 45, 45, 0.92)';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={toggleTooltip}
        style={[styles.iconButton, { padding: spacing.xs }]}
        activeOpacity={0.6}
      >
        <Ionicons 
          name="information-circle" 
          size={iconSize} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>

      {showTooltip && (
        <Animated.View 
          style={[styles.tooltipContainer, { opacity: fadeAnim }]}
        >
          <View style={[
            styles.tooltipBox, 
            { 
              backgroundColor: tooltipBg,
              borderRadius: radius.sm,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm + 2,
            }
          ]}>
            <Text style={[
              styles.tooltipText,
              {
                fontFamily: fonts.gotham,
                fontSize: typography.fontSize.xs,
                color: '#FFFFFF',
              }
            ]}>
              {helperText}
            </Text>
          </View>
          <View style={[
            styles.tooltipArrow,
            { borderTopColor: tooltipBg }
          ]} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    // padding applied dynamically
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '130%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  tooltipBox: {
    maxWidth: 300, 
    minWidth: 240,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexShrink: 1, 
  },
  tooltipText: {
    textAlign: 'center',
    flexWrap: 'wrap', 
    flexShrink: 1,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1, 
  },
});