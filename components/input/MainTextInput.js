import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, useColorScheme } from 'react-native';

export default function MainTextInput({ 
  label, 
  value, 
  onChangeText,
  placeholder,
  style,
  error = false,
  disabled = false,
  helperText,
  variant = 'standard', // 'standard' or 'outlined'
  multiline = false,
  numberOfLines,
  keyboardType = 'default',
  ...props 
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = !!value;

  // Theme colors
  const theme = {
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      input: isDark ? '#999999' : '#666666',
      placeholder: isDark ? '#666666' : '#999999',
    },
    border: {
      default: isDark ? '#ffffff' : '#000000',
      focused: '#2196F3',
      error: '#f44336',
    },
    background: {
      default: isDark ? '#1a1a1a' : '#ffffff',
    },
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return theme.border.error;
    if (isFocused) return theme.border.focused;
    return theme.border.default;
  };

  // For outlined variant, use fieldset style
  if (variant === 'outlined') {
    return (
      <View style={[styles.container, styles.outlinedContainer, style]}>
        <View style={[
          styles.fieldsetWrapper,
          { borderColor: getBorderColor() }
        ]}>
          {/* Legend/Label - positioned on border */}
          {label && (
            <View style={[
              styles.legendContainer,
              { backgroundColor: theme.background.default }
            ]}>
              <Text style={[
                styles.legend,
                { color: error ? theme.border.error : (isFocused ? theme.border.focused : theme.text.primary) }
              ]}>
                {label}
              </Text>
            </View>
          )}
          
          {/* Input */}
          <TextInput
            style={[
              styles.fieldsetInput,
              { color: theme.text.primary },
              disabled && styles.disabled,
              multiline && styles.multiline,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={theme.text.placeholder}
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            {...props}
          />
        </View>

        {/* Helper text */}
        {helperText && (
          <Text style={[
            styles.helperText, 
            { color: error ? theme.border.error : theme.text.input }
          ]}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }

  // Standard variant with bottom border only
  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text 
          style={[
            styles.label,
            {
              color: error 
                ? theme.border.error 
                : isFocused 
                  ? theme.border.focused 
                  : theme.text.input
            }
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input */}
      <TextInput
        style={[
          styles.input,
          { 
            color: theme.text.primary,
            borderBottomWidth: isFocused ? 2 : 1,
            borderBottomColor: getBorderColor(),
          },
          disabled && styles.disabled,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.text.placeholder}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        {...props}
      />

      {/* Helper text */}
      {helperText && (
        <Text style={[
          styles.helperText, 
          { color: error ? theme.border.error : theme.text.input }
        ]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    paddingTop: 20,
    position: 'relative',
  },
  outlinedContainer: {
    paddingTop: 0,
    marginBottom: 16,
  },
  // Standard variant styles
  label: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  // Outlined/Fieldset variant styles
  fieldsetWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    position: 'relative',
  },
  legendContainer: {
    position: 'absolute',
    top: -10,
    left: 8,
    paddingHorizontal: 6,
  },
  legend: {
    fontSize: 13,
    fontWeight: '400',
  },
  fieldsetInput: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  // Common styles
  disabled: {
    opacity: 0.6,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 0,
  },
});