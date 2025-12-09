import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/assets/theme/ThemeContext';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

export default function TouristTypeChart({
  domesticData = [],
  foreignData = [],
  ofwData = [],
  yLabel = 'Growth Rate (%)',
  xLabel = 'Months',
  title = 'Tourist Types by Month',
  titleTextSize = 'text-[14px] md:text-[16px]',
  padding = 'p-[20px]',
  hasInput = false,
  isAnimationActive = false,
}) {
  const { colors, isDark, spacing, typography } = useTheme();
  const [selectedBar, setSelectedBar] = useState(null);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Find highest stacked total
  const highest = useMemo(() => {
    const totals = months.map((_, i) => 
      (domesticData[i] || 0) + (foreignData[i] || 0) + (ofwData[i] || 0)
    );
    return totals.length ? Math.max(...totals) : 0;
  }, [domesticData, foreignData, ofwData]);

  // Smart rounded maximum
  const roundedMax = useMemo(() => {
    if (highest === 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(highest)));
    const normalized = highest / magnitude;

    let rounded;
    if (normalized <= 1) rounded = 1;
    else if (normalized <= 2) rounded = 2;
    else if (normalized <= 3) rounded = 3;
    else if (normalized <= 5) rounded = 5;
    else if (normalized <= 7.5) rounded = 7.5;
    else rounded = 10;

    return rounded * magnitude;
  }, [highest]);

  // Prepare stacked bar data
  const stackData = months.map((month, i) => ({
    stacks: [
      { value: ofwData[i] || 0, color: '#3B82F6' },
      { value: foreignData[i] || 0, color: '#EF4444' },
      { value: domesticData[i] || 0, color: '#FFB95A' },
    ],
    label: month,
    onPress: () => setSelectedBar({ month, index: i }),
  }));

  const textColor = isDark ? '#CACDD6' : '#828898';
  const gridColor = isDark ? '#CACDD680' : '#82889880';

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {selectedBar && (
        <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tooltipLabel, { color: colors.text }]}>
            {selectedBar.month}
          </Text>
          <Text style={[styles.tooltipValue, { color: '#FFB95A' }]}>
            Domestic: {formatReadableNumber(domesticData[selectedBar.index])}
          </Text>
          <Text style={[styles.tooltipValue, { color: '#EF4444' }]}>
            Foreign: {formatReadableNumber(foreignData[selectedBar.index])}
          </Text>
          <Text style={[styles.tooltipValue, { color: '#3B82F6' }]}>
            OFW: {formatReadableNumber(ofwData[selectedBar.index])}
          </Text>
        </View>
      )}

      <View style={styles.chartRow}>
        {yLabel && (
          <View style={styles.yLabelContainer}>
            <Text style={[styles.yLabel, { color: textColor }]}>{yLabel}</Text>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.chartWrapper}>
            <BarChart
              stackData={stackData}
              height={250}
              width={Math.max(months.length * 45, 350)}
              maxValue={roundedMax}
              noOfSections={4}
              yAxisTextStyle={{ color: textColor, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: textColor, fontSize: 10 }}
              rulesColor={gridColor}
              yAxisColor={gridColor}
              xAxisColor={gridColor}
              formatYLabel={(value) => formatCompactNumber(parseFloat(value))}
              hideOrigin
              spacing={35}
              isAnimated={isAnimationActive}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFB95A' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>Domestic</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>Foreign</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>OFW</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yLabelContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  yLabel: {
    fontSize: 12,
    transform: [{ rotate: '-90deg' }],
    width: 200,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  chartWrapper: {
    paddingVertical: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  tooltip: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  tooltipLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tooltipValue: {
    fontSize: 12,
    marginVertical: 2,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
});