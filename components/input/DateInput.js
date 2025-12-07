import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DateInput() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const {colors, fonts, isDark} = useTheme();

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
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
    justifyContent: 'center',
    alignItems: 'center',
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