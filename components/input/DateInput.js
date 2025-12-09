import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DateInput({ onFilterChange, initialFilter }) {
  const [date, setDate] = useState(
    initialFilter?.date ? new Date(initialFilter.date) : new Date()
  );
  const [mode, setMode] = useState(initialFilter?.mode || 'daily');
  const [show, setShow] = useState(false);
  const { colors, fonts, isDark } = useTheme();

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    if (onFilterChange && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onFilterChange({
        mode,
        date: formattedDate,
      });
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (onFilterChange) {
      onFilterChange({
        mode: newMode,
        date: date.toISOString().split('T')[0],
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {['daily', 'monthly'].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => handleModeChange(m)}
            style={[
              styles.modeButton,
              {
                backgroundColor: mode === m ? colors.primary : 'transparent',
                borderColor: colors.border,
              }
            ]}
          >
            <Text
              style={[
                styles.modeText,
                {
                  color: mode === m ? '#fff' : colors.text,
                  fontFamily: fonts.gotham,
                }
              ]}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[
          styles.button,
          { 
            borderColor: colors.border,
            borderWidth: 1,
            backgroundColor: isDark ? colors.surface : '#fff',
          }
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateText,
          { color: isDark ? colors.text : '#313638', fontFamily: fonts.gotham }
        ]}>
          {formatDate(date)}
        </Text>
        <Ionicons 
          name="calendar-outline" 
          size={16} 
          color={isDark ? colors.text : '#313638'} 
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
  },
});