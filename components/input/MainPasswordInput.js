import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainPasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  error = false,
  helperText,
  disabled = false,
  ...props
}) {
  const { colors, isDark, fonts } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.textSecondary, isFocused ? colors.primary : colors.textSecondary],
    }),
    fontWeight: '500',
    fontFamily: fonts.gotham,
  };

  return (
    <View style={[passwordStyles.container, style]}>
      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
      <View
        style={[
          passwordStyles.inputContainer,
          {
            borderBottomColor: error ? '#f44336' : colors.border,
          },
        ]}
      >
        <TextInput
          style={[passwordStyles.input, { color: colors.placeholder, fontFamily: fonts.gotham }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!showPassword}
          editable={!disabled}
          {...props}
        />
        <TouchableOpacity
          style={passwordStyles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text style={[
          passwordStyles.helperText, 
          { color: error ? '#f44336' : colors.textSecondary, fontFamily: fonts.gotham }
        ]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const passwordStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    paddingTop: 20,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontFamily: 'System',
  },
  iconButton: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'System',
  },
});