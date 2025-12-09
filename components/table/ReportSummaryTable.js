import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { styles, getThemedStyles } from '@/styles/tableStyles';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function ReportSummaryTable({ reports }) {
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  return (
    <View style={{ gap: 50, paddingBottom: 25 }}>
      {/* First Table */}
      <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.scrollView}
        >
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableHeader, themedStyles.tableHeader]}>
              <View style={[styles.headerCell, { width: 250 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Guest check-ins
                </Text>
              </View>
              <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Guest nights
                </Text>
              </View>
              <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Foreign guest check-ins
                </Text>
              </View>
              <View style={[styles.headerCell, { width: 120 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Foreign guest nights
                </Text>
              </View>
            </View>

            {/* Table Body */}
            <View style={styles.tableBody}>
              {reports.map((row) => (
                <View 
                  key={row.id} 
                  style={[styles.tableRow, themedStyles.tableRow]}
                >
                  <View style={[styles.cell, { width: 250 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.totalGuests)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.totalGuestNights)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.foreignGuests)}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 120 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.foreignGuestNights)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Second Table */}
      <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.scrollView}
        >
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableHeader, themedStyles.tableHeader]}>
              <View style={[styles.headerCell, { width: 250 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Available rooms
                </Text>
              </View>
              <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Rooms occupied
                </Text>
              </View>
              <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Average occupancy rate
                </Text>
              </View>
              <View style={[styles.headerCell, { width: 120 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>
                  Average length of stay (in nights)
                </Text>
              </View>
            </View>

            {/* Table Body */}
            <View style={styles.tableBody}>
              {reports.map((row) => (
                <View 
                  key={row.id} 
                  style={[styles.tableRow, themedStyles.tableRow]}
                >
                  <View style={[styles.cell, { width: 250 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.availableRooms)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.roomsOccupied)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {row.avgOccupancyRate}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 120 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {row.avgLengthOfStay}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}