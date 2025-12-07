import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function BackButton({
  onPress,
  label,
  isArrow = true,
  hasBg = false,
  hasPadding = false,
  bgColor,
  fullWidth = true,
  disabled = false,
  style,
  textStyle,
}) {
  const { colors, radius, fonts, typography, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: fullWidth ? '100%' : 'auto',
          backgroundColor: hasBg ? bgColor || colors.border : 'transparent',
          paddingVertical: hasPadding ? 12 : 0,
          paddingHorizontal: hasPadding ? 16 : 0,
          borderRadius: radius.md,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {isArrow && (
          <Ionicons
            name="arrow-back"
            size={20}
            color={colors.text}
            style={{ marginRight: -5 }}
          />
        )}

        <Text
          style={[
            styles.text,
            {
              fontFamily: fonts.gotham,
              fontSize: typography.fontSize.md,
              fontWeight: typography.weight.medium,
              color: colors.text,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  text: {
    fontWeight: '500',
  },
});
