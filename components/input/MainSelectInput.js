import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MainSelectInput({
  label,
  value,
  onChange,
  options = [],
  helperText,
  error = false,
  disabled = false,
  placeholder = '',
  variant = 'standard',
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

  const selected = useMemo(() => {
    const raw = typeof value === 'object' && value !== null ? value.value : value;
    if (raw == null || raw === '') return null;
    const v = String(raw);
    return normalized.find((o) => String(o.value) === v) ?? null;
  }, [value, normalized]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(selected ? 1 : 0)).current;

  const hasValue = selected !== null;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const handleSelect = (option) => {
    onChange?.(option ? option.value : '');
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const colors = {
    text: isDark ? '#d2d2d2' : '#1e1e1e',
    labelDefault: isDark ? '#666' : '#666',
    labelFocused: isDark ? '#2196F3' : '#2196F3',
    border: isDark ? '#d2d2d2' : '#1e1e1e',
    optionBg: isDark ? '#2a2a2a' : '#f9f9f9',
    optionBorder: isDark ? '#333' : '#e0e0e0',
    disabled: isDark ? '#666' : '#ccc',
    focusedBorder: '#2196F3',
    selectedBg: isDark ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.08)',
    hoverBg: isDark ? '#333' : '#f5f5f5',
  };

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -22],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error 
      ? '#f44336' 
      : (isFocused ? colors.labelFocused : colors.labelDefault),
    fontWeight: '500',
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
        
        <TouchableOpacity
          style={[
            styles.dropdown,
            { 
              borderBottomColor: error 
                ? '#f44336' 
                : (isFocused ? colors.focusedBorder : colors.border),
              borderBottomWidth: isFocused ? 2 : 1,
            },
            disabled && styles.disabled,
          ]}
          onPress={handleToggle}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.dropdownText, 
              { color: hasValue ? colors.text : 'transparent' }
            ]}
            numberOfLines={1}
          >
            {selected?.label || placeholder}
          </Text>
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={[
          styles.optionsContainer,
          { 
            backgroundColor: colors.optionBg,
            borderColor: colors.optionBorder,
          }
        ]}>
          <ScrollView
            style={styles.optionsList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {normalized.map((item, idx) => (
              <TouchableOpacity
                key={item.value + idx}
                style={[
                  styles.option,
                  selected?.value === item.value && {
                    backgroundColor: colors.selectedBg
                  },
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            {normalized.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.labelDefault }]}>
                  No options available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {helperText && (
        <Text style={[
          styles.helperText, 
          { color: error ? '#f44336' : colors.labelDefault }
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
    marginBottom: 24,
    paddingTop: 20,
    position: 'relative',
    zIndex: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    minHeight: 40,
  },
  disabled: {
    opacity: 0.6,
  },
  dropdownText: {
    marginBottom: 20,
    fontSize: 16,
    flex: 1,
  },
  optionsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsList: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
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
    marginLeft: 0,
  },
});