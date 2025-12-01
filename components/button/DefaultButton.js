import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DefaultButton({
  onPress,
  label,
  uppercase = false,
  isNeutral = false,
  isRed = false,
  isGreen = false,
  isBlue = false,
  isAction = false,
  isTransparent = false,
  fullWidth = true,
  withIcon = false,
  isCheck = false,
  isX = false,
  isInfo = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const { colors, isDark, radius, fonts, typography } = useTheme();

  // Determine button background and text colors
  const getButtonStyle = () => {
    if (isAction) {
      if (isGreen) {
        return {
          backgroundColor: isDark ? '#2D3A1F' : '#D9F3B7',
          textColor: isDark ? '#A3D96C' : '#7CB530',
          activeColor: isDark ? '#3D4A2F' : '#B3DD80',
        };
      } else if (isRed) {
        return {
          backgroundColor: isDark ? '#3D1F23' : '#FFD5D9',
          textColor: isDark ? '#FF6B7A' : '#EF1A25',
          activeColor: isDark ? '#4D2F33' : '#FFA3AB',
        };
      } else if (isBlue) {
        return {
          backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE',
          textColor: isDark ? '#60A5FA' : '#3B82F6',
          activeColor: isDark ? '#2E4A6F' : '#93C5FD',
        };
      } else {
        return {
          backgroundColor: isDark ? '#3D3520' : '#F9E9B4',
          textColor: isDark ? '#F0C674' : '#D4AF37',
          activeColor: isDark ? '#4D4530' : '#E8CB6F',
        };
      }
    } else if (isTransparent) {
      if (isRed) {
        return {
          backgroundColor: 'transparent',
          textColor: isDark ? '#FF6B7A' : '#EF1A25',
          activeColor: 'transparent',
        };
      } else if (isGreen) {
        return {
          backgroundColor: 'transparent',
          textColor: isDark ? '#A3D96C' : '#8DC641',
          activeColor: 'transparent',
        };
      } else if (isBlue) {
        return {
          backgroundColor: 'transparent',
          textColor: isDark ? '#60A5FA' : '#3B82F6',
          activeColor: 'transparent',
        };
      } else {
        return {
          backgroundColor: 'transparent',
          textColor: isDark ? '#F0C674' : '#D4AF37',
          activeColor: 'transparent',
        };
      }
    } else {
      if (isNeutral) {
        return {
          backgroundColor: isDark ? '#2C2C2C' : '#E8E8E8',
          textColor: isDark ? colors.text : '#313638',
          activeColor: isDark ? '#3C3C3C' : '#CFCFCF',
        };
      } else if (isRed) {
        return {
          backgroundColor: isDark ? '#B3131B' : '#EF1A25',
          textColor: 'white',
          activeColor: isDark ? '#8D0F15' : '#B3131B',
        };
      } else if (isGreen) {
        return {
          backgroundColor: isDark ? '#6A9E30' : '#8DC641',
          textColor: 'white',
          activeColor: isDark ? '#547D26' : '#6A9E30',
        };
      } else if (isBlue) {
        return {
          backgroundColor: isDark ? '#1E40AF' : '#3B82F6',
          textColor: 'white',
          activeColor: isDark ? '#1E3A8A' : '#1E40AF',
        };
      } else {
        return {
          backgroundColor: isDark ? '#8C6F22' : '#D4AF37',
          textColor: 'white',
          activeColor: isDark ? '#6B5519' : '#8C6F22',
        };
      }
    }
  };

  const buttonColors = getButtonStyle();

  const getIconName = () => {
    if (isCheck) return 'checkmark';
    if (isX) return 'close';
    if (isInfo) return 'information-circle-outline';
    return null;
  };

  const iconName = getIconName();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.backgroundColor,
          width: fullWidth ? '100%' : 'auto',
          borderRadius: radius.md,
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={buttonColors.textColor} />
        ) : (
          <>
            {withIcon && iconName && (
              <Ionicons 
                name={iconName} 
                size={20} 
                color={buttonColors.textColor} 
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: buttonColors.textColor,
                  textTransform: uppercase ? 'uppercase' : 'none',
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.weight.medium,
                  fontFamily: fonts.gotham,
                },
                textStyle,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '500',
  },
});