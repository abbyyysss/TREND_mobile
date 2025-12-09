import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { format, startOfMonth, isAfter } from 'date-fns';
import { useTheme } from '@/assets/theme/ThemeContext';

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
  const { colors, isDark, radius, spacing, typography, fonts } = useTheme();
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
    <View style={[styles.container, { marginBottom: spacing.lg - 4 }]}>
      <Text style={[
        styles.label,
        {
          fontSize: typography.fontSize.md - 1,
          color: colors.text,
          marginBottom: spacing.xs + 1,
          fontFamily: fonts.gotham,
        }
      ]}>
        {placeholder}
      </Text>

      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              padding: spacing.sm + 4,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.md,
              backgroundColor: isDark ? colors.surface : colors.card,
            }
          ]}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={[
            styles.buttonText,
            {
              fontSize: typography.fontSize.md - 1,
              color: colors.text,
              fontFamily: fonts.gotham,
            }
          ]}>
            {formattedDate}
          </Text>
          <Text style={[
            styles.arrow,
            {
              fontSize: typography.fontSize.xs,
              color: colors.text,
              fontFamily: fonts.gotham,
            }
          ]}>▼</Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={[
            styles.dropdownContent,
            {
              marginTop: spacing.xs,
              backgroundColor: isDark ? colors.surface : colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.md,
              shadowColor: isDark ? '#000' : colors.border,
            }
          ]}>
            {/* Months Grid */}
            <View style={[styles.monthGrid, { marginBottom: spacing.md }]}>
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
                      {
                        padding: spacing.sm + 2,
                        borderRadius: radius.md,
                        backgroundColor: isDark ? colors.secondary : colors.secondary,
                        marginBottom: spacing.sm,
                      },
                      isSelected && {
                        backgroundColor: isDark ? '#333' : '#e5e5e5',
                      },
                      disabled && styles.monthDisabled,
                    ]}
                    onPress={() =>
                      handleMonthYearChange(idx, selectedDate.getFullYear())
                    }
                  >
                    <Text
                      style={[
                        styles.monthText,
                        {
                          fontSize: typography.fontSize.sm,
                          color: colors.text,
                          fontFamily: fonts.gotham,
                        },
                        isSelected && styles.monthTextSelected,
                        disabled && { color: colors.placeholder },
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
                style={[
                  styles.yearDropdownButton,
                  {
                    padding: spacing.sm + 4,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    backgroundColor: isDark ? colors.surface : colors.card,
                  }
                ]}
                onPress={() => setShowYearDropdown(!showYearDropdown)}
              >
                <Text style={[
                  styles.yearDropdownText,
                  {
                    fontSize: typography.fontSize.md - 1,
                    color: colors.text,
                    fontWeight: typography.weight.semibold,
                    fontFamily: fonts.gotham,
                  }
                ]}>
                  {selectedDate.getFullYear()}
                </Text>
                <Text style={[
                  styles.arrow,
                  {
                    fontSize: typography.fontSize.xs,
                    color: colors.text,
                    fontFamily: fonts.gotham,
                  }
                ]}>
                  {showYearDropdown ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {showYearDropdown && (
                <View style={[
                  styles.yearDropdownList,
                  {
                    marginBottom: spacing.xs,
                    backgroundColor: isDark ? colors.surface : colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    shadowColor: isDark ? '#000' : colors.border,
                  }
                ]}>
                  <ScrollView style={styles.yearScrollView} nestedScrollEnabled>
                    {availableYears.map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        style={[
                          styles.yearDropdownItem,
                          {
                            padding: spacing.sm + 4,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                          },
                          yr === selectedDate.getFullYear() && {
                            backgroundColor: isDark ? colors.secondary : colors.secondary,
                          },
                        ]}
                        onPress={() => handleYearChange(yr)}
                      >
                        <Text
                          style={[
                            styles.yearDropdownItemText,
                            {
                              fontSize: typography.fontSize.md - 1,
                              color: colors.text,
                              fontFamily: fonts.gotham,
                            },
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
  container: {},
  label: {
    fontWeight: '400',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontWeight: '400',
  },
  arrow: {
    fontWeight: '400',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '31%',
    alignItems: 'center',
  },
  monthDisabled: {
    opacity: 0.4,
  },
  monthText: {
    fontWeight: '400',
  },
  monthTextSelected: {
    fontWeight: 'bold',
  },
  yearDropdownContainer: {
    position: 'relative',
    zIndex: 1002,
  },
  yearDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearDropdownText: {
    fontWeight: '600',
  },
  yearDropdownList: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1003,
  },
  yearScrollView: {
    maxHeight: 200,
  },
  yearDropdownItem: {
    fontWeight: '400',
  },
  yearDropdownItemText: {
    fontWeight: '400',
  },
  yearDropdownItemTextSelected: {
    fontWeight: 'bold',
  },
});