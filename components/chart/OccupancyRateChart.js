import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

const formatMonth = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
};

export default function OccupancyRateChart({
  data = [],
  title = 'Occupancy Rate Comparison',
  yLabel = 'Occupancy Rate (%)',
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const textColor = isDark ? '#CACDD6' : '#828898';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';

  // Prepare grouped bar data
  const barData = data.flatMap((item, index) => {
    const month = formatMonth(item.month);
    return [
      {
        value: item.ae_occupancy ?? 0,
        label: index === 0 ? month : '', // Only show label on first bar
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: { color: textColor, fontSize: 10 },
        frontColor: '#8979FF',
        topLabelComponent: () => (
          <Text style={{ fontSize: 9, color: textColor, marginBottom: 2 }}>
            {(item.ae_occupancy ?? 0).toFixed(1)}%
          </Text>
        ),
      },
      {
        value: item.city_occupancy ?? 0,
        spacing: index === data.length - 1 ? 2 : 20, // Extra spacing after each group
        frontColor: '#FF928A',
        topLabelComponent: () => (
          <Text style={{ fontSize: 9, color: textColor, marginBottom: 2 }}>
            {(item.city_occupancy ?? 0).toFixed(1)}%
          </Text>
        ),
      },
    ];
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: isDark ? '#E5E7EB' : '#313638' }]}>
        {title}
      </Text>

      <View style={styles.chartWrapper}>
        {yLabel && (
          <View style={styles.yAxisLabel}>
            <Text style={[styles.yAxisText, { color: textColor }]}>
              {yLabel}
            </Text>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              height={220}
              width={Math.max(data.length * 70, 300)}
              barWidth={22}
              spacing={8}
              initialSpacing={20}
              endSpacing={20}
              noOfSections={4}
              maxValue={100}
              yAxisColor={textColor}
              xAxisColor={textColor}
              yAxisTextStyle={{ color: textColor, fontSize: 11 }}
              rulesColor={isDark ? 'rgba(202, 205, 214, 0.2)' : 'rgba(130, 136, 152, 0.2)'}
              rulesType="solid"
              formatYLabel={formatCompactNumber}
              showValuesAsTopLabel={false}
              // Enable press interaction
              showStripOnPress
              stripColor={isDark ? '#ffffff20' : '#00000020'}
              stripWidth={1}
              stripOpacity={0.3}
              renderTooltip={(item, index) => {
                const monthIndex = Math.floor(index / 2);
                const isAE = index % 2 === 0;
                const monthData = data[monthIndex];
                
                if (!monthData) return null;
                
                return (
                  <View
                    style={{
                      backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                      borderRadius: 8,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: isDark ? '#CACDD680' : '#82889880',
                      minWidth: 140,
                      marginBottom: 10,
                      marginLeft: -50,
                    }}
                  >
                    <Text style={{ color: textColor, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>
                      {formatMonth(monthData.month)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#8979FF', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        Your establishment: {(monthData.ae_occupancy ?? 0).toFixed(1)}%
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FF928A', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        City average: {(monthData.city_occupancy ?? 0).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8979FF' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>
            Your establishment's avg
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF928A' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>
            City's avg
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabel: {
    width: 20,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yAxisText: {
    fontSize: 12,
    transform: [{ rotate: '-90deg' }],
    width: 220,
    textAlign: 'center',
  },
  chartContainer: {
    paddingVertical: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});