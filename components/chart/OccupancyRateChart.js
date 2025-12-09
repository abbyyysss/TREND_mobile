import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/assets/theme/ThemeContext';
import { format } from 'date-fns';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

export default function OccupancyRateChart({
  data = [],
  title = 'Occupancy Rate Comparison',
  yLabel = 'Occupancy Rate (%)',
  isAnimationActive = false,
}) {
  const { colors, isDark, spacing, typography } = useTheme();
  const [selectedBar, setSelectedBar] = useState(null);

  const chartData = data.map((item, index) => ({
    month: format(new Date(item.month), 'MMM'),
    ae: item.ae_occupancy ?? 0,
    city: item.city_occupancy ?? 0,
    index,
  }));

  const textColor = isDark ? '#CACDD6' : '#828898';
  const gridColor = isDark ? '#CACDD680' : '#82889880';

  // Prepare grouped bar data
  const barData = chartData.map((item) => ({
    value: item.ae,
    frontColor: '#8979FF',
    label: item.month,
    spacing: 2,
    onPress: () => setSelectedBar(item),
  }));

  const barData2 = chartData.map((item) => ({
    value: item.city,
    frontColor: '#FF928A',
  }));

  // Interleave the two datasets for side-by-side bars
  const combinedData = [];
  barData.forEach((item, i) => {
    combinedData.push(item);
    combinedData.push({ ...barData2[i], label: '' });
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {selectedBar && (
        <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tooltipLabel, { color: colors.text }]}>
            {selectedBar.month}
          </Text>
          <Text style={[styles.tooltipValue, { color: '#8979FF' }]}>
            Your establishment: {formatReadableNumber(selectedBar.ae)}
          </Text>
          <Text style={[styles.tooltipValue, { color: '#FF928A' }]}>
            City average: {formatReadableNumber(selectedBar.city)}
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
              data={combinedData}
              height={250}
              width={Math.max(chartData.length * 70, 350)}
              barWidth={22}
              noOfSections={4}
              yAxisTextStyle={{ color: textColor, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: textColor, fontSize: 11 }}
              rulesColor={gridColor}
              yAxisColor={gridColor}
              xAxisColor={gridColor}
              formatYLabel={(value) => formatCompactNumber(parseFloat(value))}
              hideOrigin
              spacing={16}
              isAnimated={isAnimationActive}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8979FF' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>
            Your establishment's avg
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF928A' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>City's avg</Text>
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