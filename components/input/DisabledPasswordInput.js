import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DisabledPasswordInput({
  label,
  variant = 'standard',
  size = 'normal',
  shrink = true,
  value,
  onEditClick,
}) {
  const { colors, isDark, fonts } = useTheme();

  const hasValue = value && value.length > 0;
  const shouldShrink = shrink !== undefined ? shrink : hasValue;

  // Hide password value (show dots)
  const displayValue = value ? '•'.repeat(value.length) : '';

  const isOutlined = variant === 'outlined';
  const isSmall = size === 'small';

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
    outputRange: [15, isOutlined ? 13 : 12],
  });

  // Outlined variant
  if (isOutlined) {
    return (
      <View style={[styles.container, styles.outlinedContainer]}>
        <View
          style={[
            styles.fieldsetWrapper,
            {
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
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
                  color: colors.textSecondary,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {label}
            </Animated.Text>
          )}

          {/* Input Container with Edit Button */}
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.fieldsetInput,
                {
                  color: colors.text,
                  fontFamily: fonts.gotham,
                  height: isSmall ? 40 : 48,
                },
                isSmall && styles.inputSmall,
              ]}
              value={displayValue}
              editable={false}
              secureTextEntry={false}
              placeholder={!shouldShrink ? label : ''}
              placeholderTextColor={colors.placeholder}
            />

            {/* Edit Icon (visual only) */}
            <View style={styles.editIcon}>
              <MaterialIcons
                name="edit"
                size={isSmall ? 16 : 18}
                color={colors.foreground}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Standard variant with bottom border
  return (
    <View style={styles.container}>
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
                color: colors.textSecondary,
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}

        {/* Input Container with Edit Icon */}
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                fontFamily: fonts.gotham,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                height: isSmall ? 40 : 48,
              },
              isSmall && styles.inputSmall,
            ]}
            value={displayValue}
            editable={false}
            secureTextEntry={false}
            placeholder={!shouldShrink ? label : ''}
            placeholderTextColor={colors.placeholder}
          />

          {/* Edit Icon (visual only) */}
          <View style={[styles.editIcon, styles.editIconStandard]}>
            <MaterialIcons
              name="edit"
              size={isSmall ? 16 : 18}
              color={colors.foreground}
            />
          </View>
        </View>
      </View>
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
    flex: 1,
  },

  // Outlined/Fieldset variant
  fieldsetWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingTop: 3,
    paddingBottom: 6,
    position: 'relative',
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
    flex: 1,
  },

  // Input row for edit icon
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Common styles
  inputSmall: {
    fontSize: 14,
  },

  // Edit icon (non-functional, visual only)
  editIcon: {
    padding: 4,
    marginLeft: 8,
  },
  editIconStandard: {
    position: 'absolute',
    right: 0,
    bottom: 4,
  },
});