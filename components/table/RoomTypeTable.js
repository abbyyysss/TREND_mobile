// RoomTypeTable.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { tableContainerStyles, headerCellStyles, bodyCellStyles, rowStyles } from '@/styles/tableStyles';

export default function RoomTypeTable({ roomTypes = [] }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get dynamic styles based on theme
  const containerStyle = tableContainerStyles(isDark);
  const headerStyle = headerCellStyles(isDark);
  const bodyStyle = bodyCellStyles(isDark);
  const getRowStyle = (index) => rowStyles(isDark, index);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View style={[styles.container, containerStyle]}>
        {/* Table Header */}
        <View style={[styles.headerRow, headerStyle.row]}>
          <View style={styles.headerCell}>
            <Text style={headerStyle.text}>
              Room type name
            </Text>
          </View>
          <View style={styles.headerCellSmall}>
            <Text style={headerStyle.text}>
              Minimum capacity
            </Text>
          </View>
          <View style={styles.headerCellSmall}>
            <Text style={headerStyle.text}>
              Maximum capacity
            </Text>
          </View>
        </View>

        {/* Table Body */}
        {roomTypes.length > 0 ? (
          roomTypes.map((room, index) => (
            <View
              key={room.id}
              style={[styles.bodyRow, getRowStyle(index)]}
            >
              <View style={styles.bodyCell}>
                <Text style={bodyStyle.text}>
                  {room.room_name}
                </Text>
              </View>
              <View style={styles.bodyCellSmall}>
                <Text style={bodyStyle.text}>
                  {room.min}
                </Text>
              </View>
              <View style={styles.bodyCellSmall}>
                <Text style={bodyStyle.text}>
                  {room.max}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyRow, bodyStyle.emptyRow]}>
            <Text style={bodyStyle.emptyText}>
              No room types found.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerCell: {
    width: 200,
    padding: 12,
    justifyContent: 'center',
  },
  headerCellSmall: {
    width: 120,
    padding: 12,
    justifyContent: 'center',
  },
  bodyRow: {
    flexDirection: 'row',
  },
  bodyCell: {
    width: 200,
    padding: 12,
    justifyContent: 'center',
  },
  bodyCellSmall: {
    width: 120,
    padding: 12,
    justifyContent: 'center',
  },
  emptyRow: {
    padding: 24,
    alignItems: 'center',
  },
});