// VisitorGrowthRateChart.js
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '@/assets/theme/ThemeContext';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

export default function VisitorGrowthRateChart({
  title = 'Visitor Growth Rate',
  labels = [],
  oldData = [],
  newData = [],
  period,
  comparePeriod,
}) {
  const { colors, isDark } = useTheme();
  const [selectedPoint, setSelectedPoint] = useState(null);

  const hasOldData = oldData.some(v => v != null);
  const hasNewData = newData.some(v => v != null);

  // Find highest value
  const highest = useMemo(() => {
    const all = [...oldData, ...newData].filter(v => typeof v === 'number' && !isNaN(v));
    return all.length ? Math.max(...all) : 0;
  }, [oldData, newData]);

  // Smart rounding for Y-axis
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

  // Prepare data for gifted-charts
  const oldChartData = labels.map((label, i) => ({
    value: oldData[i] ?? 0,
    label: label,
    dataPointText: oldData[i]?.toString() ?? '0',
  }));

  const newChartData = labels.map((label, i) => ({
    value: newData[i] ?? 0,
    label: label,
    dataPointText: newData[i]?.toString() ?? '0',
  }));

  const textColor = isDark ? '#CACDD6' : '#828898';
  const gridColor = isDark ? '#CACDD680' : '#82889880';

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      {selectedPoint && (
        <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tooltipLabel, { color: colors.text }]}>
            {labels[selectedPoint.index]}
          </Text>
          {hasOldData && (
            <Text style={[styles.tooltipValue, { color: '#D9D9D9' }]}>
              {comparePeriod}: {formatReadableNumber(oldData[selectedPoint.index])}
            </Text>
          )}
          {hasNewData && (
            <Text style={[styles.tooltipValue, { color: '#D4AF37' }]}>
              {period}: {formatReadableNumber(newData[selectedPoint.index])}
            </Text>
          )}
        </View>
      )}

      <View style={styles.chartRow}>
        <View style={styles.yLabelContainer}>
          <Text style={[styles.yLabel, { color: textColor }]}>
            Growth Rate (%)
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.chartWrapper}>
            <LineChart
              data={hasNewData ? newChartData : []}
              data2={hasOldData ? oldChartData : []}
              height={200}
              width={Math.max(labels.length * 40, 300)}
              maxValue={roundedMax}
              noOfSections={4}
              yAxisTextStyle={{ color: textColor, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: textColor, fontSize: 10 }}
              color1="#D4AF37"
              color2="#D9D9D9"
              thickness1={2}
              thickness2={2}
              curved
              hideDataPoints={false}
              dataPointsColor1="#D4AF37"
              dataPointsColor2="#D9D9D9"
              dataPointsRadius={4}
              rulesColor={gridColor}
              yAxisColor={gridColor}
              xAxisColor={gridColor}
              hideRules={false}
              yAxisLabelSuffix=""
              formatYLabel={(value) => formatCompactNumber(parseFloat(value))}
              onPress={(item, index) => setSelectedPoint({ item, index })}
              hideOrigin
              animateOnDataChange
              animationDuration={500}
              spacing={40}
            />
          </View>
        </ScrollView>
      </View>

      {(hasOldData || hasNewData) && (
        <View style={styles.legend}>
          {hasNewData && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D4AF37' }]} />
              <Text style={[styles.legendText, { color: textColor }]}>
                {period} (Current)
              </Text>
            </View>
          )}
          {hasOldData && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D9D9D9' }]} />
              <Text style={[styles.legendText, { color: textColor }]}>
                {comparePeriod} (Comparison)
              </Text>
            </View>
          )}
        </View>
      )}
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