import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  useColorScheme,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoButton({ 
  iconSize = 20, 
  helperText = 'More information about this field',
  autoHideDuration = 3000, // 3 seconds
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#d2d2d2' : '#1e1e1e';

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
  }, [showTooltip]);

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

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={toggleTooltip}
        style={styles.iconButton}
        activeOpacity={0.6}
      >
        <Ionicons 
          name="information-circle" 
          size={iconSize} 
          color={iconColor} 
        />
      </TouchableOpacity>

      {showTooltip && (
        <Animated.View 
          style={[styles.tooltipContainer, { opacity: fadeAnim }]}
        >
          <View style={styles.tooltipBox}>
            <Text style={styles.tooltipText}>{helperText}</Text>
          </View>
          <View style={styles.tooltipArrow} />
        </Animated.View>
      )}
    </View>
  );
}

const TOOLTIP_BG = 'rgba(63, 63, 63, 0.92)';

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '130%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  tooltipBox: {
    backgroundColor: TOOLTIP_BG,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    maxWidth: 300, 
    minWidth: 240,
    elevation: 4,
    flexShrink: 1, 
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
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
    borderTopColor: TOOLTIP_BG, 
    marginTop: -1, 
  },
});
