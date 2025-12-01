// EmployeeSexChart.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

export default function EmployeeSexChart({ 
  male = 0, 
  female = 0,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedSection, setSelectedSection] = useState(null);

  const textColor = isDark ? '#CACDD6' : '#313638';
  const borderColor = isDark ? '#444' : '#9CA3AF';
  const shadowColor = isDark ? '#000' : '#9CA3AF';

  const pieData = [
    {
      value: male,
      color: '#3B82F6',
      text: `${male}`,
      name: 'Male',
      focused: selectedSection === 'Male',
      onPress: () => setSelectedSection(selectedSection === 'Male' ? null : 'Male'),
    },
    {
      value: female,
      color: '#EF4444',
      text: `${female}`,
      name: 'Female',
      focused: selectedSection === 'Female',
      onPress: () => setSelectedSection(selectedSection === 'Female' ? null : 'Female'),
    },
  ];

  const total = male + female;

  return (
    <View style={[
      styles.container,
      { 
        borderColor,
        shadowColor,
        backgroundColor: isDark ? '#000' : '#FFF',
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Employee's Sex Disaggregation
        </Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={[styles.legendText, { color: textColor }]}>Male</Text>
            <View style={[styles.legendBox, { backgroundColor: '#3B82F6' }]} />
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendText, { color: textColor }]}>Female</Text>
            <View style={[styles.legendBox, { backgroundColor: '#EF4444' }]} />
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={100}
          innerRadius={60}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={[styles.centerLabelText, { color: textColor }]}>
                {selectedSection ? pieData.find(d => d.name === selectedSection)?.value : total}
              </Text>
              <Text style={[styles.centerLabelSubtext, { color: textColor }]}>
                {selectedSection || 'Total'}
              </Text>
            </View>
          )}
          focusOnPress
          toggleFocusOnPress
        />
      </View>

      {/* Selected Info */}
      {selectedSection && (
        <View style={[
          styles.infoBox,
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
            borderColor: isDark ? '#444' : '#E5E7EB',
          }
        ]}>
          <Text style={[styles.infoText, { color: textColor }]}>
            {selectedSection}: {pieData.find(d => d.name === selectedSection)?.value}
          </Text>
          <Text style={[styles.infoSubtext, { color: textColor }]}>
            {total > 0 ? `${((pieData.find(d => d.name === selectedSection)?.value / total) * 100).toFixed(1)}%` : '0%'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '100%',
    padding: 20,
    borderWidth: 1,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  legend: {
    alignItems: 'flex-end',
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 14,
  },
  legendBox: {
    width: 10,
    height: 10,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginVertical: 10,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerLabelSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSubtext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
});