// DisabledPasswordInput.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DisabledPasswordInput({
  label,
  variant = 'standard', // 'standard' or 'outlined'
  size = 'normal', // 'normal' or 'small'
  shrink = true,
  value,
  onEditClick,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isSmall = size === 'small';
  const isOutlined = variant === 'outlined';

  // Hide password value (show dots)
  const displayValue = value ? '•'.repeat(value.length) : '';

  return (
    <View style={styles.container}>
      {/* Label */}
      {shrink && (
        <Text
          style={[
            styles.label,
            isSmall && styles.labelSmall,
            isDark && styles.labelDark,
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isOutlined ? styles.inputContainerOutlined : styles.inputContainerStandard,
          isDark && (isOutlined ? styles.inputContainerOutlinedDark : styles.inputContainerStandardDark),
        ]}
      >
        <TextInput
          value={displayValue}
          editable={false}
          secureTextEntry={false} // We're manually hiding with dots
          style={[
            styles.input,
            isSmall && styles.inputSmall,
            isDark && styles.inputDark,
          ]}
          placeholder={!shrink ? label : ''}
          placeholderTextColor={isDark ? '#999' : '#666'}
        />

        {/* Edit Button */}
        <TouchableOpacity
          onPress={onEditClick}
          style={styles.editButton}
          activeOpacity={0.6}
        >
          <MaterialIcons
            name="edit"
            size={isSmall ? 16 : 18}
            color={isDark ? '#D5D6D7' : '#313638'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
  },
  labelSmall: {
    fontSize: 11,
  },
  labelDark: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainerStandard: {
    borderBottomWidth: 1,
    borderBottomColor: '#313638',
    paddingBottom: 4,
  },
  inputContainerStandardDark: {
    borderBottomColor: '#D5D6D7',
  },
  inputContainerOutlined: {
    borderWidth: 1,
    borderColor: '#313638',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputContainerOutlinedDark: {
    borderColor: '#D5D6D7',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#313638',
    padding: 0,
  },
  inputSmall: {
    fontSize: 14,
  },
  inputDark: {
    color: '#D5D6D7',
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
});