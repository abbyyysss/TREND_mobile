import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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

  const colors = {
    text: isDark ? '#d2d2d2' : '#1e1e1e',
    inputLabel: isDark ? '#999' : '#666',
    border: isDark ? '#d2d2d2' : '#1e1e1e',
    labelFocused: isDark ? '#d2d2d2' : '#1e1e1e',
    icon: isDark ? '#d2d2d2' : '#1e1e1e',
  };

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -20],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.inputLabel, colors.labelFocused],
    }),
    fontWeight: '500',
    fontFamily: 'System',
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
          style={[passwordStyles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.inputLabel}
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
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text style={[passwordStyles.helperText, error && passwordStyles.errorText]}>
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
    color: '#666',
    fontFamily: 'System',
  },
  errorText: {
    color: '#f44336',
  },
});