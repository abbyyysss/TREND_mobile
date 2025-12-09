import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function FilterSelectInput({
  options = [],
  placeholder = 'Select an option',
  placeholderOption = '',
  onSelect = () => {},
  className = '',
  value = '',
  isFilterIcon = false,
  disabled = false,
}) {
  const { colors, spacing, typography, radius } = useTheme();

  const initialValue = useMemo(
    () => value || placeholderOption || options[0] || '',
    [value, placeholderOption, options]
  );

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [selected, setSelected] = useState(initialValue);
  const [hasTyped, setHasTyped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🧠 store last valid selection before user types
  const lastSelectedRef = useRef(initialValue);

  const mergedOptions = useMemo(
    () => (placeholderOption ? [placeholderOption, ...options] : options),
    [placeholderOption, options]
  );

  const filtered = useMemo(() => {
    if (!hasTyped) return mergedOptions;
    const lowerQuery = searchQuery.toLowerCase();
    return mergedOptions.filter((option) => {
      const label = typeof option === 'object' ? option.label : option;
      return label.toLowerCase().includes(lowerQuery);
    });
  }, [hasTyped, searchQuery, mergedOptions]);

  const handleSelect = useCallback(
    (option) => {
      const label = typeof option === 'object' ? option.label : option;
      setSelected(label);
      setSearchQuery(label);
      setHasTyped(false);
      setIsOpen(false);
      lastSelectedRef.current = label; // ✅ remember latest valid option
      onSelect(label);
    },
    [onSelect]
  );

  useEffect(() => {
    if (!placeholderOption || initialValue !== placeholderOption) {
      onSelect(initialValue);
    }
  }, [initialValue, onSelect, placeholderOption]);

  useEffect(() => {
    if (value) {
      setSearchQuery(value);
      setSelected(value);
    }
  }, [value]);

  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: disabled ? colors.textSecondary : colors.text,
          marginBottom: spacing.xs,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {placeholder}
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          backgroundColor: disabled ? colors.secondary : colors.surface,
        }}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            if (!disabled) {
              setIsOpen(true);
              setHasTyped(false);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <TextInput
            value={searchQuery}
            editable={!disabled}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true);
                setSearchQuery(''); // 👈 clear text when focusing
                setSelected('');
              }
            }}
            onChangeText={(val) => {
              // 👇 When user starts typing for the first time, clear previous selection
              if (!hasTyped && val.length === 1 && selected) {
                setSearchQuery(val); // start fresh with just the typed letter
                setSelected('');
              } else {
                setSearchQuery(val);
              }
              setHasTyped(val.trim().length > 0);
              setIsOpen(true);
            }}
            style={{
              flex: 1,
              color: disabled ? colors.textSecondary : colors.placeholder,
              fontSize: typography.fontSize.md,
            }}
            placeholderTextColor={colors.placeholder}
            placeholder=""
          />
          {isFilterIcon ? (
            <Ionicons 
              name="filter-outline" 
              size={16} 
              color={disabled ? colors.textSecondary : colors.text} 
            />
          ) : (
            <Ionicons 
              name={isOpen ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={disabled ? colors.textSecondary : colors.text} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsOpen(false);
          // ✅ If user didn't select anything new, restore last selected value
          if (!selected && lastSelectedRef.current) {
            setSearchQuery(lastSelectedRef.current);
            setSelected(lastSelectedRef.current);
            setHasTyped(false);
          }
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => {
            setIsOpen(false);
            if (!selected && lastSelectedRef.current) {
              setSearchQuery(lastSelectedRef.current);
              setSelected(lastSelectedRef.current);
              setHasTyped(false);
            }
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              width: '80%',
              maxWidth: 400,
              maxHeight: 300,
              padding: spacing.xs,
            }}
          >
            <ScrollView>
              {filtered.length > 0 ? (
                filtered.map((option, idx) => {
                  const isObject = typeof option === 'object' && option !== null;
                  const label = isObject ? option.label : option;
                  const key = isObject ? option.key : option;
                  const isPlaceholderDisabled = placeholderOption && idx === 0;

                  return (
                    <TouchableOpacity
                      key={key}
                      disabled={isPlaceholderDisabled}
                      onPress={() => handleSelect(option)}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.md,
                      }}
                    >
                      <Text
                        style={{
                          color: isPlaceholderDisabled
                            ? colors.textSecondary
                            : colors.text,
                          fontSize: typography.fontSize.md,
                          opacity: isPlaceholderDisabled ? 0.5 : 1,
                        }}
                        numberOfLines={1}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={{ padding: spacing.md }}>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    No results
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}