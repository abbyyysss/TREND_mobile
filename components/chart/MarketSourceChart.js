import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/assets/theme/ThemeContext';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';
import { capitalizeWords } from '@/utils/wordFormatUtil';

export default function MarketSourceChart({
  data = [],
  yLabel = 'Visitor Arrivals',
  title = 'Top 10 Sources of Markets (2024 vs 2025)',
  titleTextSize = 'text-[14px] md:text-[16px]',
  padding = 'p-[20px]',
  isAnimationActive = false,
}) {
  const { colors, isDark, spacing, typography } = useTheme();
  const [selectedBar, setSelectedBar] = useState(null);

  const safeData = Array.isArray(data) && data.length > 0
    ? data
    : [{ country: 'No Data', value: 0, change: 0 }];

  const barColor = '#EBC855';
  const textColor = isDark ? '#CACDD6' : '#828898';
  const gridColor = isDark ? '#CACDD680' : '#82889880';

  // Prepare bar data with custom labels
  const barData = safeData.map((item, index) => ({
    value: item.value || 0,
    label: capitalizeWords(item.country),
    topLabelComponent: () => {
      const change = item.change ?? 0;
      const color = change > 0 ? '#22C55E' : '#EF4444';
      return (
        <Text style={[styles.barLabel, { color }]}>
          {change > 0 ? `+${change}%` : `${change}%`}
        </Text>
      );
    },
    onPress: () => setSelectedBar({ ...item, index }),
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {selectedBar && (
        <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tooltipLabel, { color: colors.text }]}>
            {capitalizeWords(selectedBar.country)}
          </Text>
          <Text style={[styles.tooltipValue, { color: barColor }]}>
            Value: {formatReadableNumber(selectedBar.value)}
          </Text>
          <Text style={[styles.tooltipValue, { color: selectedBar.change >= 0 ? '#22C55E' : '#EF4444' }]}>
            Change: {selectedBar.change > 0 ? '+' : ''}{selectedBar.change}%
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
              data={barData}
              height={250}
              width={Math.max(safeData.length * 50, 350)}
              barWidth={28}
              frontColor={barColor}
              noOfSections={4}
              yAxisTextStyle={{ color: textColor, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: textColor, fontSize: 8, width: 60 }}
              rulesColor={gridColor}
              yAxisColor={gridColor}
              xAxisColor={gridColor}
              formatYLabel={(value) => formatCompactNumber(parseFloat(value))}
              hideOrigin
              spacing={30}
              xAxisLabelWidth={60}
              isAnimated={isAnimationActive}
            />
          </View>
        </ScrollView>
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