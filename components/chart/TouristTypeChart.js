import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';

export default function TouristTypeChart({
  domesticData = [],
  foreignData = [],
  ofwData = [],
  yLabel = 'Growth Rate (%)',
  title = 'Tourist Types by Month',
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const textColor = isDark ? '#CACDD6' : '#828898';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Prepare stacked bar data
  const stackData = useMemo(() => {
    return months.map((month, i) => {
      const domestic = domesticData[i] ?? 0;
      const foreign = foreignData[i] ?? 0;
      const ofw = ofwData[i] ?? 0;
      const total = domestic + foreign + ofw;

      return {
        value: domestic,
        label: month,
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: { color: textColor, fontSize: 10 },
        frontColor: '#FFB95A',
        // Show total on top of stack
        topLabelComponent: () => (
          <Text style={{ fontSize: 9, color: textColor, marginBottom: 2 }}>
            {formatCompactNumber(total)}
          </Text>
        ),
        stacks: [
          { value: domestic, color: '#FFB95A' },
          { value: foreign, color: '#EF4444' },
          { value: ofw, color: '#3B82F6' },
        ],
      };
    });
  }, [domesticData, foreignData, ofwData, textColor]);

  // Calculate max value for Y-axis
  const highest = useMemo(() => {
    const totals = months.map((_, i) => 
      (domesticData[i] ?? 0) + (foreignData[i] ?? 0) + (ofwData[i] ?? 0)
    );
    return totals.length ? Math.max(...totals) : 0;
  }, [domesticData, foreignData, ofwData]);

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
              data={stackData}
              height={220}
              width={Math.max(months.length * 45, 300)}
              maxValue={roundedMax}
              noOfSections={4}
              stackData={stackData}
              barWidth={28}
              spacing={45}
              initialSpacing={20}
              endSpacing={20}
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
              onPress={(item, index) => {
                // Handle bar press
              }}
              renderTooltip={(item, index) => {
                const monthIndex = Math.floor(index);
                const domestic = domesticData[monthIndex] ?? 0;
                const foreign = foreignData[monthIndex] ?? 0;
                const ofw = ofwData[monthIndex] ?? 0;
                const total = domestic + foreign + ofw;
                
                return (
                  <View
                    style={{
                      backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                      borderRadius: 8,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: isDark ? '#CACDD680' : '#82889880',
                      minWidth: 120,
                      marginBottom: 10,
                      marginLeft: -40,
                    }}
                  >
                    <Text style={{ color: textColor, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>
                      {months[monthIndex]}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FFB95A', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        Domestic: {formatReadableNumber(domestic)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        Foreign: {formatReadableNumber(foreign)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#3B82F6', marginRight: 6 }} />
                      <Text style={{ color: textColor, fontSize: 10 }}>
                        OFW: {formatReadableNumber(ofw)}
                      </Text>
                    </View>
                    <View style={{ borderTopWidth: 1, borderTopColor: isDark ? '#CACDD640' : '#82889840', marginTop: 4, paddingTop: 4 }}>
                      <Text style={{ color: textColor, fontSize: 10, fontWeight: '600' }}>
                        Total: {formatReadableNumber(total)}
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
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>OFW</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>Foreign</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFB95A' }]} />
          <Text style={[styles.legendText, { color: textColor }]}>Domestic</Text>
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