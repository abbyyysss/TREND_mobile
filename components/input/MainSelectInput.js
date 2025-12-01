import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainSelectInput({
  label,
  value,
  onChange,
  options = [],
  variant = 'standard',
  size = 'small',
  id = 'main-select',
  helperText,
  error = false,
  shrink,
  disabled = false,
  placeholder = '',
  clearTextOnSelect = false,
}) {
  const { colors, fonts, isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Normalize options
  const normalized = useMemo(
    () =>
      options.map((opt) => {
        if (opt == null) return { value: '', label: '' };
        if (typeof opt === 'string' || typeof opt === 'number') {
          const s = String(opt);
          return { value: s, label: s };
        }
        const v = opt.value ?? '';
        const l = opt.label ?? String(v);
        return { value: String(v), label: l };
      }),
    [options]
  );

  // Get selected option
  const selected = useMemo(() => {
    const raw = typeof value === 'object' && value !== null ? value.value : value;
    if (raw == null) return null;
    const v = String(raw);
    return normalized.find((o) => String(o.value) === v) ?? null;
  }, [value, normalized]);

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!searchText) return normalized;
    return normalized.filter((opt) =>
      opt.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [normalized, searchText]);

  const hasValue = selected !== null;
  const shouldShrink = shrink !== undefined ? shrink : (isFocused || hasValue || isOpen);
  const isOutlined = variant === 'outlined';

  const handleSelect = (option) => {
    onChange?.(option ? option.value : '');
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

  // Get border color
  const getBorderColor = () => {
    if (error) return '#d32f2f';
    if (isFocused || isOpen) return colors.primary;
    return colors.border;
  };

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
    outputRange: [15, 12],
  });

  return (
    <View style={styles.container}>
      {/* Main Input Wrapper */}
      <View
        style={[
          isOutlined ? styles.outlinedWrapper : styles.standardWrapper,
          { 
            borderColor: getBorderColor(),
            backgroundColor: colors.background,
          },
          isOutlined && (isFocused || isOpen) && styles.outlinedFocused,
          !isOutlined && (isFocused || isOpen) && styles.standardFocused,
          disabled && styles.disabled,
        ]}
      >
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
                  : (isFocused || isOpen)
                    ? colors.primary
                    : colors.textSecondary,
                backgroundColor: isOutlined ? colors.background : 'transparent',
                paddingHorizontal: isOutlined ? 4 : 0,
              },
              isOutlined && styles.labelOutlined,
            ]}
          >
            {label}
          </Animated.Text>
        )}

        {/* Select Button / Search Input */}
        {isOpen ? (
          <View style={[styles.selectContent, isOutlined && styles.selectContentOutlined]}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: colors.text,
                  fontFamily: fonts.gotham,
                  flex: 1,
                },
                size === 'small' && styles.searchInputSmall,
              ]}
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              autoFocus
            />
            <TouchableOpacity 
              onPress={handleToggle} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.selectContent,
              isOutlined && styles.selectContentOutlined,
              disabled && styles.disabled,
            ]}
            onPress={handleToggle}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectedText,
                {
                  color: hasValue ? colors.text : colors.placeholder, fontFamily: fonts.gotham
                },
                size === 'small' && styles.selectedTextSmall,
              ]}
              numberOfLines={1}
            >
              {hasValue ? selected.label : placeholder}
            </Text>
            <Ionicons
              name="caret-down"
              size={16}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown Options */}
      {isOpen && (
        <View
          style={[
            styles.optionsContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
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
                  { borderBottomColor: colors.border },
                  selected?.value === item.value && {
                    backgroundColor: isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                  },
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
              >
                <Text style={[styles.optionText, { color: colors.text , fontFamily: fonts.gotham}]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            {filteredOptions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.gotham }]}>
                  {searchText ? 'No matching options' : 'No options available'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Helper Text */}
      {helperText && (
        <Text
          style={[
            styles.helperText,
            { color: error ? '#d32f2f' : colors.textSecondary, fontFamily: fonts.gotham },
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

  // Standard Variant
  standardWrapper: {
    borderBottomWidth: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  standardFocused: {
    borderBottomWidth: 2,
  },

  // Outlined Variant
  outlinedWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  outlinedFocused: {
    borderWidth: 2,
  },

  // Disabled State
  disabled: {
    opacity: 0.6,
  },

  // Label Styles
  label: {
    position: 'absolute',
    left: 0,
    fontWeight: '400',
  },
  labelOutlined: {
    left: 12,
  },

  // Select Content
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  selectContentOutlined: {
    paddingTop: 0,
  },

  // Selected Text
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
  selectedTextSmall: {
    fontSize: 14,
  },

  // Search Input
  searchInput: {
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  searchInputSmall: {
    fontSize: 14,
  },

  // Options Dropdown
  optionsContainer: {
    borderRadius: 6,
    borderWidth: 1,
    maxHeight: 200,
    overflow: 'hidden',
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionsList: {
    flexGrow: 0,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
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

  // Helper Text
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});