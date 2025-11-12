import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, useColorScheme, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MainSelectInput({
  label,
  value,
  onChange,
  options = [],
  helperText,
  error = false,
  disabled = false,
  placeholder = 'Select room type',
  variant = 'outlined',
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Normalize options
  const normalizedOptions = options.map((opt) => {
    if (opt == null) return { value: '', label: '' };
    if (typeof opt === 'string' || typeof opt === 'number') {
      const s = String(opt);
      return { value: s, label: s };
    }
    return { value: String(opt.value ?? ''), label: opt.label ?? String(opt.value ?? '') };
  });

  // Filter options based on search text
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Find selected option
  const rawValue = typeof value === 'object' && value !== null ? value.value : value;
  const selectedOption = rawValue 
    ? normalizedOptions.find((o) => String(o.value) === String(rawValue)) 
    : null;

  const hasValue = !!selectedOption;

  const handleSelect = (option) => {
    onChange?.(option.value);
    setSearchText('');
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      const newState = !isOpen;
      setIsOpen(newState);
      setIsFocused(newState);
      if (!newState) {
        setSearchText('');
      }
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (!isOpen) {
      setIsOpen(true);
      setIsFocused(true);
    }
  };

  // Theme colors
  const theme = {
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      input: isDark ? '#aaaaaa' : '#666666',
      placeholder: isDark ? '#666666' : '#999999',
    },
    border: {
      default: isDark ? '#888888' : '#000000',
      focused: '#2196F3',
      error: '#f44336',
    },
    background: {
      default: isDark ? '#1a1a1a' : '#ffffff',
      option: isDark ? '#2a2a2a' : '#ffffff',
    },
  };

  // Border color
  const getBorderColor = () => {
    if (error) return theme.border.error;
    if (isFocused) return theme.border.focused;
    return theme.border.default;
  };

  // --- Floating label animation ---
  const labelAnim = new Animated.Value(hasValue || isFocused ? 1 : 0);

  React.useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: hasValue || isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -10],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  return (
    <View style={[styles.container]}>
      <View style={[
        styles.fieldsetWrapper,
        { borderColor: getBorderColor(), backgroundColor: theme.background.default },
      ]}>
        {/* Animated Label */}
        {label && (
          <Animated.Text
            style={[
              styles.legend,
              {
                top: labelTop,
                left: 12,
                fontSize: labelFontSize,
                color: error
                  ? theme.border.error
                  : isFocused
                    ? theme.border.focused
                    : theme.text.input,
                backgroundColor: theme.background.default,
                paddingHorizontal: 4,
                position: 'absolute',
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}

        {/* Select Button / Search Input */}
        {isOpen ? (
          <View style={styles.fieldsetSelect}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.text.primary,
                  flex: 1,
                },
              ]}
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder={placeholder}
              placeholderTextColor={theme.text.placeholder}
              autoFocus
            />
            <TouchableOpacity onPress={handleToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.fieldsetSelect, disabled && styles.disabled]}
            onPress={handleToggle}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.fieldsetSelectText,
                {
                  color: hasValue ? theme.text.primary : 'transparent',
                },
              ]}
              numberOfLines={1}
            >
              {hasValue ? selectedOption.label : ''}
            </Text>
            <Ionicons
              name="caret-down"
              size={16}
              color={theme.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown options */}
      {isOpen && (
        <View style={[
          styles.optionsContainer,
          { backgroundColor: theme.background.option, borderColor: theme.border.default },
        ]}>
          <ScrollView
            style={styles.optionsList}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {filteredOptions.map((item, idx) => (
              <TouchableOpacity
                key={item.value + idx}
                style={[
                  styles.option,
                  selectedOption?.value === item.value && {
                    backgroundColor: isDark
                      ? 'rgba(33, 150, 243, 0.15)'
                      : 'rgba(33, 150, 243, 0.08)',
                  },
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
              >
                <Text style={[styles.optionText, { color: theme.text.primary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            {filteredOptions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text.input }]}>
                  {searchText ? 'No matching options' : 'No options available'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Helper text */}
      {helperText && (
        <Text
          style={[
            styles.helperText,
            { color: error ? theme.border.error : theme.text.input },
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
    marginBottom: 24,
    position: 'relative',
  },
  fieldsetWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  legend: {
    fontWeight: '400',
  },
  fieldsetSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldsetSelectText: {
    fontSize: 16,
    flex: 1,
  },
  searchInput: {
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  optionsContainer: {
    borderRadius: 6,
    borderWidth: 1,
    maxHeight: 200,
    overflow: 'hidden',
    marginTop: 4,
    elevation: 3,
  },
  optionsList: { flexGrow: 0 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  disabled: {
    opacity: 0.6,
  },
});