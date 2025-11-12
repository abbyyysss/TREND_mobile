import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  style,
  textStyle,
}) {
  // Determine button background and text colors
  const getButtonStyle = () => {
    if (isAction) {
      if (isGreen) {
        return {
          backgroundColor: '#D9F3B7',
          textColor: '#7CB530',
          activeColor: '#B3DD80',
        };
      } else if (isRed) {
        return {
          backgroundColor: '#FFD5D9',
          textColor: '#EF1A25',
          activeColor: '#FFA3AB',
        };
      } else if (isBlue) {
        return {
          backgroundColor: '#DBEAFE',
          textColor: '#3B82F6',
          activeColor: '#93C5FD',
        };
      } else {
        return {
          backgroundColor: '#F9E9B4',
          textColor: '#D4AF37',
          activeColor: '#E8CB6F',
        };
      }
    } else if (isTransparent) {
      if (isRed) {
        return {
          backgroundColor: 'transparent',
          textColor: '#EF1A25',
          activeColor: 'transparent',
        };
      } else if (isGreen) {
        return {
          backgroundColor: 'transparent',
          textColor: '#8DC641',
          activeColor: 'transparent',
        };
      } else if (isBlue) {
        return {
          backgroundColor: 'transparent',
          textColor: '#3B82F6',
          activeColor: 'transparent',
        };
      } else {
        return {
          backgroundColor: 'transparent',
          textColor: '#D4AF37',
          activeColor: 'transparent',
        };
      }
    } else {
      if (isNeutral) {
        return {
          backgroundColor: '#E8E8E8',
          textColor: '#313638',
          activeColor: '#CFCFCF',
        };
      } else if (isRed) {
        return {
          backgroundColor: '#EF1A25',
          textColor: 'white',
          activeColor: '#B3131B',
        };
      } else if (isGreen) {
        return {
          backgroundColor: '#8DC641',
          textColor: 'white',
          activeColor: '#6A9E30',
        };
      } else if (isBlue) {
        return {
          backgroundColor: '#3B82F6',
          textColor: 'white',
          activeColor: '#1E40AF',
        };
      } else {
        return {
          backgroundColor: '#D4AF37',
          textColor: 'white',
          activeColor: '#8C6F22',
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
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
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
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: '500',
  },
});