import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { format, startOfMonth, subMonths, subYears, addMonths } from 'date-fns';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <View style={compStyles.container}>
      <Text style={[compStyles.label, isDark && compStyles.labelDark]}>
        {placeholder}
      </Text>

      <View style={[compStyles.splitButton, isDark && compStyles.splitButtonDark]}>
        {/* Frequency Button */}
        <View style={compStyles.splitLeftWrapper}>
          <TouchableOpacity
            style={compStyles.splitLeft}
            onPress={() => setShowFreqDropdown(!showFreqDropdown)}
          >
            <Text style={[compStyles.buttonText, isDark && compStyles.buttonTextDark]}>
              {frequency}
            </Text>
            <Text style={[compStyles.arrow, isDark && compStyles.arrowDark]}>▼</Text>
          </TouchableOpacity>

          {showFreqDropdown && (
            <View style={[compStyles.dropdownMenu, isDark && compStyles.dropdownMenuDark]}>
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
                        isDark && compStyles.menuTextDark,
                        isDisabled && compStyles.menuTextDisabled,
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

        <View style={[compStyles.divider, isDark && compStyles.dividerDark]} />

        {/* Date Button */}
        <View style={compStyles.splitRightWrapper}>
          <TouchableOpacity
            style={[compStyles.splitRight, !isCustomRange && compStyles.disabled]}
            disabled={!isCustomRange}
            onPress={() => isCustomRange && setShowDateDropdown(!showDateDropdown)}
          >
            <Text
              style={[
                compStyles.buttonText,
                isDark && compStyles.buttonTextDark,
                !isCustomRange && compStyles.disabledText,
              ]}
            >
              {formattedDate}
            </Text>
            <Text
              style={[
                compStyles.arrow,
                isDark && compStyles.arrowDark,
                !isCustomRange && compStyles.disabledText,
              ]}
            >
              ▼
            </Text>
          </TouchableOpacity>

          {showDateDropdown && isCustomRange && (
            <View style={[compStyles.dateDropdownContent, isDark && compStyles.dateDropdownContentDark]}>
              {/* Months Grid */}
              <View style={compStyles.monthGrid}>
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
                        isSelected &&
                          (isDark
                            ? compStyles.monthSelectedDark
                            : compStyles.monthSelected),
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
                          isDark && compStyles.monthTextDark,
                          isSelected && compStyles.monthTextSelected,
                          !isAvailable && compStyles.monthTextDisabled,
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
                  style={[compStyles.yearDropdownButton, isDark && compStyles.yearDropdownButtonDark]}
                  onPress={() => setShowYearDropdown(!showYearDropdown)}
                >
                  <Text style={[compStyles.yearDropdownText, isDark && compStyles.yearDropdownTextDark]}>
                    {selectedDate.getFullYear()}
                  </Text>
                  <Text style={[compStyles.arrow, isDark && compStyles.arrowDark]}>
                    {showYearDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showYearDropdown && (
                  <View style={[compStyles.yearDropdownList, isDark && compStyles.yearDropdownListDark]}>
                    <ScrollView style={compStyles.yearScrollView} nestedScrollEnabled>
                      {availableYears.map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          style={[
                            compStyles.yearDropdownItem,
                            yr === selectedDate.getFullYear().toString() && compStyles.yearDropdownItemSelected,
                          ]}
                          onPress={() => handleYearChange(parseInt(yr))}
                        >
                          <Text
                            style={[
                              compStyles.yearDropdownItemText,
                              isDark && compStyles.yearDropdownItemTextDark,
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
  splitButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    overflow: 'visible',
    backgroundColor: '#fff',
  },
  splitButtonDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
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
    padding: 12,
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
    padding: 12,
  },
  divider: {
    width: 1,
    backgroundColor: '#C0BFBF',
  },
  dividerDark: {
    backgroundColor: '#555',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
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
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C0BFBF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1002,
  },
  dropdownMenuDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  dateDropdownContent: {
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
  dateDropdownContentDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuText: {
    fontSize: 15,
    color: '#313638',
  },
  menuTextDark: {
    color: '#e5e5e5',
  },
  menuTextDisabled: {
    color: '#999',
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
    fontSize: 10,
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
    fontSize: 13,
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