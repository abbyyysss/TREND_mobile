import React from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Pressable,
  StyleSheet,
} from 'react-native';
import DefaultButton from '../button/DefaultButton';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function GuestLogTable({ openGuestLogModal, data, loading }) {
  console.log("🟢 TABLE COMPONENT RENDERED");
  console.log("Table data:", data);
  console.log("Loading:", loading);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, styles.tableContainer(isDark)]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          {/* Table Header */}
          <View style={[styles.headerRow, styles.headerCellStyles(isDark)]}>
            <View style={[styles.cell, styles.cellCheckInDate]}>
              <Text style={styles.headerText(isDark)}>Check in date</Text>
            </View>
            <View style={[styles.cell, styles.cellCheckInTime]}>
              <Text style={styles.headerText(isDark)}>Checked in at</Text>
            </View>
            <View style={[styles.cell, styles.cellRoomID]}>
              <Text style={styles.headerText(isDark)}>Room ID</Text>
            </View>
            <View style={[styles.cell, styles.cellNoOfGuests]}>
              <Text style={styles.headerText(isDark)}>No. of guests</Text>
            </View>
            <View style={[styles.cell, styles.cellLengthOfStay]}>
              <Text style={styles.headerText(isDark)}>Length of stay (in nights)</Text>
            </View>
            <View style={[styles.cell, styles.cellActions]}>
              <Text style={styles.headerText(isDark)}>Actions</Text>
            </View>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.tableBody}>
            {data.map((row) => (
              <Pressable
                key={row.id}
                style={({ pressed }) => [
                  styles.bodyRow,
                  styles.bodyCellStyles(isDark),
                  styles.rowHoverStyles(isDark, pressed),
                ]}
              >
                <View style={[styles.cell, styles.cellCheckInDate]}>
                  <Text style={styles.bodyText(isDark)}>{row.checkInDate}</Text>
                </View>
                <View style={[styles.cell, styles.cellCheckInTime]}>
                  <Text style={styles.bodyText(isDark)}>{row.checkInAt}</Text>
                </View>
                <View style={[styles.cell, styles.cellRoomID]}>
                  <Text style={styles.bodyText(isDark)}>{row.room_id}</Text>
                </View>
                <View style={[styles.cell, styles.cellNoOfGuests]}>
                  <Text style={styles.bodyText(isDark)}>
                    {formatReadableNumber(row.noOfGuests)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cellLengthOfStay]}>
                  <Text style={styles.bodyText(isDark)}>
                    {formatReadableNumber(row.lengthOfStay)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cellActions, styles.actionsCell]}>
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.viewButton(isDark),
                        pressed && styles.viewButtonPressed(isDark),
                      ]}
                      onPress={() => openGuestLogModal("view", row.id)}
                    >
                      <Text style={styles.viewButtonText(isDark)}>View</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.editButton(isDark),
                        pressed && styles.editButtonPressed(isDark),
                      ]}
                      onPress={() => openGuestLogModal("edit", row.id)}
                    >
                      <Text style={styles.editButtonText(isDark)}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tableContainer: (isDark) => ({
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  }),
  tableWrapper: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCellStyles: (isDark) => ({
    borderBottomColor: isDark ? '#404040' : '#e0e0e0',
  }),
  headerText: (isDark) => ({
    fontSize: 14,
    fontStyle: 'bold',
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#333333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),
  bodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bodyCellStyles: (isDark) => ({
    borderBottomColor: isDark ? '#2a2a2a' : '#f0f0f0',
  }),
  bodyText: (isDark) => ({
    fontSize: 14,
    color: isDark ? '#e0e0e0' : '#333333',
    fontWeight: '400',
  }),
  rowHoverStyles: (isDark, pressed) => ({
    backgroundColor: pressed
      ? isDark
        ? '#2a2a2a'
        : '#f9f9f9'
      : isDark
      ? '#1a1a1a'
      : '#ffffff',
  }),
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  // Column widths - optimized to reduce waste
  cellCheckInDate: {
    width: 200,
  },
  cellCheckInTime: {
    width: 140,
  },
  cellRoomID: {
    width: 180,
  },
  cellNoOfGuests: {
    width: 120,
  },
  cellLengthOfStay: {
    width: 190,
  },
  cellActions: {
    width: 130, // Significantly reduced from 240
  },
  actionsCell: {
    paddingHorizontal: 0,
  },
  tableBody: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6, // Reduced from 12 to 6
    flexWrap: 'wrap',
    paddingLeft: 8,
  },
  // Action Button Styles
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8, // Reduced from 10
    borderRadius: 4,
    minWidth: 50, // Reduced from 60
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: (isDark) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
  }),
  viewButtonPressed: (isDark) => ({
    opacity: 0.7,
  }),
  viewButtonText: (isDark) => ({
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  }),
  editButton: (isDark) => ({
    backgroundColor: 'transparent',
    borderWidth: 0,
  }),
  editButtonPressed: (isDark) => ({
    opacity: 0.7,
  }),
  editButtonText: (isDark) => ({
    color: '#D4A053',
    fontSize: 14,
    fontWeight: '500',
  }),
});