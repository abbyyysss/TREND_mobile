import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext'; 
import { styles, getThemedStyles } from '@/styles/tableStyles'; 

export default function RoomTypeTable({ roomTypes = [] }) {
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.scrollView}
      >
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Room type name
              </Text>
            </View>
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Minimum capacity
              </Text>
            </View>
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Maximum capacity
              </Text>
            </View>
          </View>

          {/* Table Body */}
          <View style={styles.tableBody}>
            {roomTypes.length > 0 ? (
              roomTypes.map((room) => (
                <View 
                  key={room.id} 
                  style={[styles.tableRow, themedStyles.tableRow]}
                >
                  <View style={[styles.cell, styles.checkInDateCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {room.room_name}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {room.min}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {room.max}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, themedStyles.emptyStateText]}>
                  No room types found.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}