import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { format, startOfMonth, isAfter } from 'date-fns';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthYearInput({
  placeholder = 'Select a month',
  value = null,
  onSelect = () => {},
  availablePeriods = [],
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const today = startOfMonth(new Date());
  const [selectedDate, setSelectedDate] = useState(
    value ? startOfMonth(new Date(value)) : today
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const availableSet = useMemo(
    () => new Set(availablePeriods),
    [availablePeriods]
  );

  const availableYears = useMemo(() => {
    const years = [...new Set(availablePeriods.map(p => p.split('-')[0]))].map(Number);
    return years.length ? years.sort((a, b) => b - a) : [selectedDate.getFullYear()];
  }, [availablePeriods, selectedDate]);

  const formattedDate = useMemo(
    () => format(selectedDate, 'MMMM yyyy'),
    [selectedDate]
  );

  const handleMonthYearChange = (monthIndex, year) => {
    const newDate = startOfMonth(new Date(year, monthIndex));
    const selectedKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    if (!availableSet.has(selectedKey)) return;
    if (isAfter(newDate, today)) return;

    setSelectedDate(newDate);
    onSelect(newDate);
    setDropdownVisible(false);
  };

  const handleYearChange = (year) => {
    const monthIndex = selectedDate.getMonth();
    const newDate = startOfMonth(new Date(year, monthIndex));
    const selectedKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    if (availableSet.has(selectedKey) && !isAfter(newDate, today)) {
      setSelectedDate(newDate);
    } else {
      // Find first available month in the year
      for (let i = 0; i < 12; i++) {
        const testDate = startOfMonth(new Date(year, i));
        const testKey = `${year}-${String(i + 1).padStart(2, "0")}`;
        if (availableSet.has(testKey) && !isAfter(testDate, today)) {
          setSelectedDate(testDate);
          break;
        }
      }
    }
    setShowYearDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && styles.labelDark]}>
        {placeholder}
      </Text>

      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={[styles.button, isDark && styles.buttonDark]}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
            {formattedDate}
          </Text>
          <Text style={[styles.arrow, isDark && styles.arrowDark]}>▼</Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={[styles.dropdownContent, isDark && styles.dropdownContentDark]}>
            {/* Months Grid */}
            <View style={styles.monthGrid}>
              {months.map((month, idx) => {
                const monthKey = `${selectedDate.getFullYear()}-${String(
                  idx + 1
                ).padStart(2, '0')}`;
                const thisDate = startOfMonth(
                  new Date(selectedDate.getFullYear(), idx)
                );
                const isFuture = isAfter(thisDate, today);
                const disabled = !availableSet.has(monthKey) || isFuture;
                const isSelected = idx === selectedDate.getMonth();

                return (
                  <TouchableOpacity
                    key={month}
                    disabled={disabled}
                    style={[
                      styles.monthButton,
                      isSelected &&
                        (isDark ? styles.monthSelectedDark : styles.monthSelected),
                      disabled && styles.monthDisabled,
                    ]}
                    onPress={() =>
                      handleMonthYearChange(idx, selectedDate.getFullYear())
                    }
                  >
                    <Text
                      style={[
                        styles.monthText,
                        isDark && styles.monthTextDark,
                        isSelected && styles.monthTextSelected,
                        disabled && styles.monthTextDisabled,
                      ]}
                    >
                      {month.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Year Dropdown */}
            <View style={styles.yearDropdownContainer}>
              <TouchableOpacity
                style={[styles.yearDropdownButton, isDark && styles.yearDropdownButtonDark]}
                onPress={() => setShowYearDropdown(!showYearDropdown)}
              >
                <Text style={[styles.yearDropdownText, isDark && styles.yearDropdownTextDark]}>
                  {selectedDate.getFullYear()}
                </Text>
                <Text style={[styles.arrow, isDark && styles.arrowDark]}>
                  {showYearDropdown ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {showYearDropdown && (
                <View style={[styles.yearDropdownList, isDark && styles.yearDropdownListDark]}>
                  <ScrollView style={styles.yearScrollView} nestedScrollEnabled>
                    {availableYears.map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        style={[
                          styles.yearDropdownItem,
                          yr === selectedDate.getFullYear() && styles.yearDropdownItemSelected,
                        ]}
                        onPress={() => handleYearChange(yr)}
                      >
                        <Text
                          style={[
                            styles.yearDropdownItemText,
                            isDark && styles.yearDropdownItemTextDark,
                            yr === selectedDate.getFullYear() && styles.yearDropdownItemTextSelected,
                          ]}
                        >
                          {yr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#1e1e1e',
    marginBottom: 5,
  },
  labelDark: {
    color: '#d2d2d2',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  buttonText: {
    fontSize: 15,
    color: '#313638',
  },
  buttonTextDark: {
    color: '#e5e5e5',
  },
  arrow: {
    fontSize: 12,
    color: '#313638',
  },
  arrowDark: {
    color: '#e5e5e5',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  dropdownContentDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    width: '31%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  monthSelected: {
    backgroundColor: '#e5e5e5',
  },
  monthSelectedDark: {
    backgroundColor: '#333',
  },
  monthDisabled: {
    opacity: 0.4,
  },
  monthText: {
    fontSize: 14,
    color: '#313638',
  },
  monthTextDark: {
    color: '#e5e5e5',
  },
  monthTextSelected: {
    fontWeight: 'bold',
  },
  monthTextDisabled: {
    color: '#999',
  },
  yearDropdownContainer: {
    position: 'relative',
    zIndex: 1002,
  },
  yearDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  yearDropdownButtonDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  yearDropdownText: {
    fontSize: 15,
    color: '#313638',
    fontWeight: '600',
  },
  yearDropdownTextDark: {
    color: '#e5e5e5',
  },
  yearDropdownList: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1003,
  },
  yearDropdownListDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  yearScrollView: {
    maxHeight: 200,
  },
  yearDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  yearDropdownItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  yearDropdownItemText: {
    fontSize: 15,
    color: '#313638',
  },
  yearDropdownItemTextDark: {
    color: '#e5e5e5',
  },
  yearDropdownItemTextSelected: {
    fontWeight: 'bold',
  },
});