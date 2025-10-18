// MainDateInput.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function MainDateInput({
  label,
  value,
  onChange,
  variant = 'standard',
  disabled = false,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [show, setShow] = useState(false);

  const colors = {
    text: isDark ? '#d2d2d2' : '#1e1e1e',
    inputLabel: isDark ? '#999' : '#666',
    border: isDark ? '#d2d2d2' : '#1e1e1e',
    placeholder: isDark ? '#666' : '#999',
    disabled: isDark ? '#666' : '#ccc',
  };

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange?.(selectedDate.toISOString().split('T')[0]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Handle if value is already a Date object
    let dateToFormat;
    if (dateString instanceof Date) {
      dateToFormat = dateString;
    } else if (typeof dateString === 'string') {
      dateToFormat = new Date(dateString);
    } else {
      return '';
    }

    // Format as mm/dd/yyyy
    const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
    const day = String(dateToFormat.getDate()).padStart(2, '0');
    const year = dateToFormat.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  const displayValue = value ? formatDate(value) : 'mm/dd/yyyy';

  return (
    <View style={styles.dateContainer}>
      {label && (
        <Text style={[styles.dateLabel, { color: colors.inputLabel }]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.dateInput,
          { borderBottomColor: colors.border },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateInputText, 
          { color: value ? colors.text : colors.placeholder }
        ]}>
          {displayValue}
        </Text>
        <MaterialIcons 
          name="event" 
          size={20} 
          color={colors.text} 
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    width: '100%',
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateInput: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  dateInputText: {
    fontSize: 16,
    flex: 1,
  },
});