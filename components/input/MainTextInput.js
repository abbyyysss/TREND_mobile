import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainTextInput({
  label,
  type = 'default',
  variant = 'standard',
  size = 'normal',
  shrink,
  onChange,
  placeholder,
  value,
  isDescription = false,
  minRows,
  maxRows,
  disabled = false,
  error = false,
  helperText = '',
  autoComplete = 'off',
  style,
  ...props
}) {
  const { colors, isDark, fonts } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldShrink = shrink !== undefined ? shrink : (isFocused || hasValue);

  // Determine keyboard type based on type prop
  const getKeyboardType = () => {
    if (type === 'email') return 'email-address';
    if (type === 'number') return 'numeric';
    if (type === 'tel') return 'phone-pad';
    return 'default';
  };

  // Calculate height for multiline
  const getInputHeight = () => {
    if (!isDescription) return size === 'small' ? 40 : 48;
    const lineHeight = 20;
    const minHeight = minRows ? minRows * lineHeight + 20 : 80;
    return minHeight;
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return '#d32f2f';
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const isOutlined = variant === 'outlined';

  // Floating label animation
  const labelAnim = new Animated.Value(shouldShrink ? 1 : 0);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: shouldShrink ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [shouldShrink]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isOutlined ? [16, -10] : [20, 0],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, isOutlined ? 13 : 12],
  });

  // Outlined variant
  if (isOutlined) {
    return (
      <View style={[styles.container, styles.outlinedContainer, style]}>
        <View
          style={[
            styles.fieldsetWrapper,
            {
              borderColor: getBorderColor(),
              backgroundColor: colors.background,
            },
            isFocused && styles.fieldsetFocused,
          ]}
        >
          {/* Animated Floating Label */}
          {label && (
            <Animated.Text
              style={[
                styles.legendContainer,
                {
                  top: labelTop,
                  fontSize: labelFontSize,
                  fontFamily: fonts.gotham,
                  color: error
                    ? '#d32f2f'
                    : isFocused
                      ? colors.primary
                      : colors.textSecondary,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {label}
            </Animated.Text>
          )}

          {/* Input */}
          <TextInput
            style={[
              styles.fieldsetInput,
              {
                color: colors.text,
                fontFamily: fonts.gotham,
                height: getInputHeight(),
              },
              disabled && styles.disabled,
              isDescription && styles.multiline,
              size === 'small' && styles.inputSmall,
            ]}
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            editable={!disabled}
            keyboardType={getKeyboardType()}
            secureTextEntry={type === 'password'}
            autoComplete={autoComplete}
            multiline={isDescription}
            numberOfLines={isDescription ? maxRows || 4 : 1}
            textAlignVertical={isDescription ? 'top' : 'center'}
            {...props}
          />
        </View>

        {/* Helper text */}
        {helperText && (
          <Text
            style={[
              styles.helperText,
              { color: error ? '#d32f2f' : colors.textSecondary, fontFamily: fonts.gotham},
            ]}
          >
            {helperText}
          </Text>
        )}
      </View>
    );
  }

  // Standard variant with bottom border
  return (
    <View style={[styles.container, style]}>
      <View style={styles.standardWrapper}>
        {/* Animated Floating Label */}
        {label && (
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
                fontFamily: fonts.gotham,
                color: error
                  ? '#d32f2f'
                  : isFocused
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: fonts.gotham,
              borderBottomWidth: isFocused ? 2 : 1,
              borderBottomColor: getBorderColor(),
              height: getInputHeight(),
            },
            disabled && styles.disabled,
            isDescription && styles.multiline,
            size === 'small' && styles.inputSmall,
          ]}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled}
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password'}
          autoComplete={autoComplete}
          multiline={isDescription}
          numberOfLines={isDescription ? maxRows || 4 : 1}
          textAlignVertical={isDescription ? 'top' : 'center'}
          {...props}
        />
      </View>

      {/* Helper text */}
      {helperText && (
        <Text
          style={[
            styles.helperText,
            { color: error ? '#d32f2f' : colors.textSecondary, fontFamily: fonts.gotham},
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    position: 'relative',
  },
  outlinedContainer: {
    marginBottom: 16,
  },

  // Standard variant
  standardWrapper: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  label: {
    position: 'absolute',
    left: 0,
    fontWeight: '400',
  },
  input: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },

  // Outlined/Fieldset variant
  fieldsetWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingBottom: 4,
    position: 'relative',
  },
  fieldsetFocused: {
    borderWidth: 2,
  },
  legendContainer: {
    position: 'absolute',
    left: 8,
    paddingHorizontal: 6,
    fontWeight: '400',
  },
  fieldsetInput: {
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  // Common styles
  inputSmall: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});