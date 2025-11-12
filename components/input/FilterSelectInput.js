import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterSelectInput({
  options = [],
  placeholder = 'Select an option',
  placeholderOption = '',
  onSelect = () => {},
  value = '',
  isFilterIcon = false,
  disabled = false,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const initialValue = useMemo(
    () => value || placeholderOption || options[0] || '',
    [value, placeholderOption, options]
  );

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [selected, setSelected] = useState(initialValue);
  const [hasTyped, setHasTyped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (option) => {
    const label = typeof option === 'object' ? option.label : option;
    setSelected(label);
    setSearchQuery(label);
    setHasTyped(false);
    setIsOpen(false);
    lastSelectedRef.current = label;
    onSelect(label);
  };

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

  const handleClose = () => {
    setIsOpen(false);
    if (!selected && lastSelectedRef.current) {
      setSearchQuery(lastSelectedRef.current);
      setSelected(lastSelectedRef.current);
      setHasTyped(false);
    }
  };

  const theme = {
    text: {
      primary: isDark ? '#d2d2d2' : '#1e1e1e',
      input: isDark ? '#A3A3A3' : '#837B7B',
      placeholder: isDark ? '#A3A3A3' : '#837B7B',
      disabled: isDark ? '#666666' : '#9ca3af',
    },
    border: isDark ? '#666666' : '#C0BFBF',
    background: {
      input: isDark ? '#1a1a1a' : '#ffffff',
      dropdown: isDark ? '#000000' : '#ffffff',
      hover: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
      disabled: isDark ? '#1f2937' : '#f3f4f6',
    },
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: disabled ? theme.text.disabled : theme.text.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {placeholder}
      </Text>

      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            borderColor: theme.border,
            backgroundColor: disabled ? theme.background.disabled : theme.background.input,
          },
        ]}
        onPress={() => {
          if (!disabled) {
            setIsOpen(true);
            setHasTyped(false);
          }
        }}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.inputText,
            {
              color: searchQuery ? theme.text.input : theme.text.placeholder,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          numberOfLines={1}
        >
          {searchQuery || placeholder}
        </Text>
        {isFilterIcon ? (
          <Ionicons name="filter-outline" size={16} color={theme.text.input} />
        ) : (
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.text.input}
          />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modalContent}>
            <View
              style={[
                styles.dropdownContainer,
                {
                  backgroundColor: theme.background.dropdown,
                  borderColor: theme.border,
                },
              ]}
            >
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={theme.text.placeholder}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[
                    styles.searchInput,
                    { color: theme.text.primary },
                  ]}
                  value={searchQuery}
                  onChangeText={(val) => {
                    if (!hasTyped && val.length === 1 && selected) {
                      setSearchQuery(val);
                      setSelected('');
                    } else {
                      setSearchQuery(val);
                    }
                    setHasTyped(val.trim().length > 0);
                  }}
                  placeholder="Search..."
                  placeholderTextColor={theme.text.placeholder}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery('');
                      setHasTyped(false);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color={theme.text.placeholder} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Options List */}
              <ScrollView
                style={styles.optionsList}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
              >
                {filtered.length > 0 ? (
                  filtered.map((option, idx) => {
                    const isObject = typeof option === 'object' && option !== null;
                    const label = isObject ? option.label : option;
                    const key = isObject ? option.key : option;
                    const isPlaceholderDisabled = placeholderOption && idx === 0;

                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              selected === label
                                ? isDark
                                  ? 'rgba(212, 175, 55, 0.2)'
                                  : 'rgba(212, 175, 55, 0.1)'
                                : 'transparent',
                          },
                        ]}
                        onPress={() => handleSelect(option)}
                        disabled={isPlaceholderDisabled}
                        activeOpacity={0.6}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: isPlaceholderDisabled
                                ? theme.text.disabled
                                : theme.text.primary,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.text.disabled }]}>
                      No results
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: {
    flex: 1,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});