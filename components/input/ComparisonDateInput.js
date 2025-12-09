import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { format, startOfMonth, subMonths, subYears, addMonths } from 'date-fns';
import { useTheme } from '@/assets/theme/ThemeContext';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ComparisonDateInput({
  placeholder = 'Compare with',
  mode = 'Last month',
  onModeChange = () => {},
  value = startOfMonth(new Date()),
  onChange = () => {},
  baseDate = startOfMonth(new Date()),
  availablePeriods = [],
}) {
  const { colors, isDark, radius, spacing, typography, fonts } = useTheme();
  const [frequency, setFrequency] = useState(mode);
  const [selectedDate, setSelectedDate] = useState(value);
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const frequencyOptions = ['Last month', 'Same month last year', 'Custom range'];
  const isCustomRange = frequency === 'Custom range';
  const formattedDate = useMemo(() => format(selectedDate, 'MMMM yyyy'), [selectedDate]);

  const generateContinuousPeriods = (periods) => {
    if (!periods.length) return [];
    const sorted = [...periods].sort();
    const [startYear, startMonth] = sorted[0].split('-').map(Number);
    const [endYear, endMonth] = sorted[sorted.length - 1].split('-').map(Number);
    const result = [];
    let current = new Date(startYear, startMonth - 1, 1);
    const end = new Date(endYear, endMonth - 1, 1);
    while (current <= end) {
      result.push(format(current, "yyyy-MM"));
      current = addMonths(current, 1);
    }
    return result;
  };

  const continuousPeriods = generateContinuousPeriods(availablePeriods);
  const availableSet = new Set(continuousPeriods);
  const availableYears = [...new Set(continuousPeriods.map(p => p.split('-')[0]))].sort((a, b) => b - a);

  useEffect(() => {
    let newDate = selectedDate;

    if (frequency === 'Last month') {
      newDate = subMonths(baseDate, 1);
    } else if (frequency === 'Same month last year') {
      newDate = subYears(baseDate, 1);
    }

    setSelectedDate(startOfMonth(newDate));
    onChange(startOfMonth(newDate));
  }, [baseDate, frequency]);

  const handleMonthYearChange = (monthIndex, year) => {
    const newDate = startOfMonth(new Date(year, monthIndex));
    setSelectedDate(newDate);
    onChange(newDate);
    setShowDateDropdown(false);
  };

  const handleYearChange = (year) => {
    const monthIndex = selectedDate.getMonth();
    const selectedKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    if (availableSet.has(selectedKey)) {
      const newDate = startOfMonth(new Date(year, monthIndex));
      setSelectedDate(newDate);
    } else {
      // Find first available month in the year
      for (let i = 0; i < 12; i++) {
        const testKey = `${year}-${String(i + 1).padStart(2, "0")}`;
        if (availableSet.has(testKey)) {
          const newDate = startOfMonth(new Date(year, i));
          setSelectedDate(newDate);
          break;
        }
      }
    }
    setShowYearDropdown(false);
  };

  const formatPeriod = (date) => format(date, "yyyy-MM");
  const lastMonth = startOfMonth(subMonths(baseDate, 1));
  const sameMonthLastYear = startOfMonth(subYears(baseDate, 1));
  const hasLastMonth = availableSet.has(formatPeriod(lastMonth));
  const hasSameMonthLastYear = availableSet.has(formatPeriod(sameMonthLastYear));
  const hasCustomRange = availablePeriods.length > 1;

  return (
    <View style={[compStyles.container, { marginBottom: spacing.lg - 4 }]}>
      <Text style={[
        compStyles.label,
        {
          fontSize: typography.fontSize.md - 1,
          color: colors.text,
          marginBottom: spacing.xs + 1,
          fontFamily: fonts.gotham,
        }
      ]}>
        {placeholder}
      </Text>

      <View style={[
        compStyles.splitButton,
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          backgroundColor: isDark ? colors.surface : colors.card,
        }
      ]}>
        {/* Frequency Button */}
        <View style={compStyles.splitLeftWrapper}>
          <TouchableOpacity
            style={[compStyles.splitLeft, { padding: spacing.sm + 4 }]}
            onPress={() => setShowFreqDropdown(!showFreqDropdown)}
          >
            <Text style={[
              compStyles.buttonText,
              {
                fontSize: typography.fontSize.md - 1,
                color: colors.text,
                fontFamily: fonts.gotham,
              }
            ]}>
              {frequency}
            </Text>
            <Text style={[
              compStyles.arrow,
              {
                fontSize: typography.fontSize.xs,
                color: colors.text,
                fontFamily: fonts.gotham,
              }
            ]}>▼</Text>
          </TouchableOpacity>

          {showFreqDropdown && (
            <View style={[
              compStyles.dropdownMenu,
              {
                marginTop: spacing.xs,
                backgroundColor: isDark ? colors.surface : colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.md,
                shadowColor: isDark ? '#000' : colors.border,
              }
            ]}>
              {frequencyOptions.map((option) => {
                const isDisabled =
                  (option === 'Last month' && !hasLastMonth) ||
                  (option === 'Same month last year' && !hasSameMonthLastYear) ||
                  (option === 'Custom range' && !hasCustomRange);

                return (
                  <TouchableOpacity
                    key={option}
                    disabled={isDisabled}
                    style={[
                      compStyles.menuItem,
                      {
                        padding: spacing.md - 1,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                      isDisabled && compStyles.menuItemDisabled,
                    ]}
                    onPress={() => {
                      if (!isDisabled) {
                        setFrequency(option);
                        onModeChange(option);
                        setShowFreqDropdown(false);
                      }
                    }}
                  >
                    <Text
                      style={[
                        compStyles.menuText,
                        {
                          fontSize: typography.fontSize.md - 1,
                          color: colors.text,
                          fontFamily: fonts.gotham,
                        },
                        isDisabled && { color: colors.placeholder },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={[
          compStyles.divider,
          {
            width: 1,
            backgroundColor: colors.border,
          }
        ]} />

        {/* Date Button */}
        <View style={compStyles.splitRightWrapper}>
          <TouchableOpacity
            style={[
              compStyles.splitRight,
              { padding: spacing.sm + 4 },
              !isCustomRange && compStyles.disabled,
            ]}
            disabled={!isCustomRange}
            onPress={() => isCustomRange && setShowDateDropdown(!showDateDropdown)}
          >
            <Text
              style={[
                compStyles.buttonText,
                {
                  fontSize: typography.fontSize.sm - 1,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                },
                !isCustomRange && { color: colors.placeholder },
              ]}
            >
              {formattedDate}
            </Text>
            <Text
              style={[
                compStyles.arrow,
                {
                  fontSize: typography.fontSize.xs,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                },
                !isCustomRange && { color: colors.placeholder },
              ]}
            >
              ▼
            </Text>
          </TouchableOpacity>

          {showDateDropdown && isCustomRange && (
            <View style={[
              compStyles.dateDropdownContent,
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
              <View style={[compStyles.monthGrid, { marginBottom: spacing.md }]}>
                {months.map((month, idx) => {
                  const monthKey = `${selectedDate.getFullYear()}-${(idx + 1)
                    .toString()
                    .padStart(2, '0')}`;
                  const isAvailable = availableSet.has(monthKey);
                  const isSelected = idx === selectedDate.getMonth();

                  return (
                    <TouchableOpacity
                      key={month}
                      disabled={!isAvailable}
                      style={[
                        compStyles.monthButton,
                        {
                          padding: spacing.sm + 2,
                          borderRadius: radius.md,
                          backgroundColor: isDark ? colors.secondary : colors.secondary,
                          marginBottom: spacing.sm,
                        },
                        isSelected && {
                          backgroundColor: isDark ? '#333' : '#e5e5e5',
                        },
                        !isAvailable && compStyles.monthDisabled,
                      ]}
                      onPress={() =>
                        isAvailable &&
                        handleMonthYearChange(idx, selectedDate.getFullYear())
                      }
                    >
                      <Text
                        style={[
                          compStyles.monthText,
                          {
                            fontSize: typography.fontSize.xs - 2,
                            color: colors.text,
                            fontFamily: fonts.gotham,
                          },
                          isSelected && compStyles.monthTextSelected,
                          !isAvailable && { color: colors.placeholder },
                        ]}
                      >
                        {month.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Year Dropdown */}
              <View style={compStyles.yearDropdownContainer}>
                <TouchableOpacity
                  style={[
                    compStyles.yearDropdownButton,
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
                    compStyles.yearDropdownText,
                    {
                      fontSize: typography.fontSize.xs + 1,
                      color: colors.text,
                      fontWeight: typography.weight.semibold,
                      fontFamily: fonts.gotham,
                    }
                  ]}>
                    {selectedDate.getFullYear()}
                  </Text>
                  <Text style={[
                    compStyles.arrow,
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
                    compStyles.yearDropdownList,
                    {
                      marginBottom: spacing.xs,
                      backgroundColor: isDark ? colors.surface : colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: radius.md,
                      shadowColor: isDark ? '#000' : colors.border,
                    }
                  ]}>
                    <ScrollView style={compStyles.yearScrollView} nestedScrollEnabled>
                      {availableYears.map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          style={[
                            compStyles.yearDropdownItem,
                            {
                              padding: spacing.sm + 4,
                              borderBottomWidth: 1,
                              borderBottomColor: colors.border,
                            },
                            yr === selectedDate.getFullYear().toString() && {
                              backgroundColor: isDark ? colors.secondary : colors.secondary,
                            },
                          ]}
                          onPress={() => handleYearChange(parseInt(yr))}
                        >
                          <Text
                            style={[
                              compStyles.yearDropdownItemText,
                              {
                                fontSize: typography.fontSize.md - 1,
                                color: colors.text,
                              },
                              yr === selectedDate.getFullYear().toString() && compStyles.yearDropdownItemTextSelected,
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
    </View>
  );
}

const compStyles = StyleSheet.create({
  container: {},
  label: {
    fontWeight: '400',
  },
  splitButton: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  splitLeftWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1001,
  },
  splitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splitRightWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1000,
  },
  splitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {},
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '400',
  },
  arrow: {
    fontWeight: '400',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1002,
  },
  dateDropdownContent: {
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
  menuItem: {
    fontWeight: '400',
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuText: {
    fontWeight: '400',
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