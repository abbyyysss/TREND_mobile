import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function MarketSourceChart({
  data = [],
  yLabel = 'Visitor Arrivals',
  title = 'Top 10 Sources of Markets (2024 vs 2025)',
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const textColor = isDark ? '#CACDD6' : '#828898';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';

  const safeData =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ country: 'No Data', value: 0, change: 0 }];

  // Calculate total for percentage calculation
  const total = safeData.reduce((sum, item) => sum + (item.value ?? 0), 0);

  // Prepare bar chart data with percentage labels
  const barData = safeData.map((item) => {
    const changeValue = item.change ?? 0;
    const changeColor = changeValue > 0 ? '#22C55E' : '#EF4444';
    const changeText = changeValue > 0 ? `+${changeValue}%` : `${changeValue}%`;
    
    // Calculate percentage of total
    const percentage = total > 0 ? ((item.value ?? 0) / total * 100).toFixed(0) : 0;

    return {
      value: item.value ?? 0,
      label: capitalizeWords(item.country || ''),
      frontColor: '#EBC855',
      spacing: 2,
      labelWidth: 70,
      labelTextStyle: {
        color: textColor,
        fontSize: 9,
        transform: [{ rotate: '-30deg' }],
      },
      // Top label showing percentage change and percentage of total
      topLabelComponent: () => (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              color: changeColor,
              marginBottom: 2,
            }}
          >
            {changeText}
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: textColor,
              marginBottom: 2,
            }}
          >
            {percentage}%
          </Text>
        </View>
      ),
    };
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
              width={Math.max(safeData.length * 50, 300)}
              barWidth={32}
              spacing={50}
              initialSpacing={25}
              endSpacing={25}
              noOfSections={4}
              yAxisColor={textColor}
              xAxisColor={textColor}
              yAxisTextStyle={{ color: textColor, fontSize: 11 }}
              rulesColor={isDark ? 'rgba(202, 205, 214, 0.2)' : 'rgba(130, 136, 152, 0.2)'}
              rulesType="solid"
              formatYLabel={formatCompactNumber}
              showValuesAsTopLabel={false}
              maxValue={Math.max(...safeData.map(d => d.value)) * 1.15}
              // Enable press interaction
              showStripOnPress
              stripColor={isDark ? '#ffffff20' : '#00000020'}
              stripWidth={1}
              stripOpacity={0.3}
              renderTooltip={(item, index) => {
                const country = safeData[index]?.country || '';
                const value = safeData[index]?.value || 0;
                const change = safeData[index]?.change || 0;
                const changeColor = change > 0 ? '#22C55E' : '#EF4444';
                
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
                      {capitalizeWords(country)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EBC855', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        Arrivals: {formatReadableNumber(value)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: textColor, fontSize: 10, marginRight: 4 }}>
                        Change:
                      </Text>
                      <Text style={{ color: changeColor, fontSize: 10, fontWeight: '600' }}>
                        {change > 0 ? `+${change}%` : `${change}%`}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
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
});