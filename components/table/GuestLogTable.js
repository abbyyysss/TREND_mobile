import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function GuestLogTable({ openGuestLogModal, data, loading }) {
  console.log("🟢 TABLE COMPONENT RENDERED");
  console.log("Table data:", data);
  console.log("Loading:", loading);

  const { colors, isDark, spacing, typography, radius } = useTheme();

  return (
    <View style={[styles.container, styles.tableContainer(colors)]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          {/* Table Header */}
          <View style={[styles.headerRow, styles.headerCellStyles(colors)]}>
            <View style={[styles.cell, styles.cellCheckInDate]}>
              <Text style={styles.headerText(colors, typography)}>Check in date</Text>
            </View>
            <View style={[styles.cell, styles.cellCheckInTime]}>
              <Text style={styles.headerText(colors, typography)}>Checked in at</Text>
            </View>
            <View style={[styles.cell, styles.cellRoomID]}>
              <Text style={styles.headerText(colors, typography)}>Room ID</Text>
            </View>
            <View style={[styles.cell, styles.cellNoOfGuests]}>
              <Text style={styles.headerText(colors, typography)}>No. of guests</Text>
            </View>
            <View style={[styles.cell, styles.cellLengthOfStay]}>
              <Text style={styles.headerText(colors, typography)}>Length of stay (in nights)</Text>
            </View>
            <View style={[styles.cell, styles.cellActions]}>
              <Text style={styles.headerText(colors, typography)}>Actions</Text>
            </View>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.tableBody}>
            {data.map((row) => (
              <Pressable
                key={row.id}
                style={({ pressed }) => [
                  styles.bodyRow,
                  styles.bodyCellStyles(colors),
                  styles.rowHoverStyles(colors, pressed),
                ]}
              >
                <View style={[styles.cell, styles.cellCheckInDate]}>
                  <Text style={styles.bodyText(colors, typography)}>{row.checkInDate}</Text>
                </View>
                <View style={[styles.cell, styles.cellCheckInTime]}>
                  <Text style={styles.bodyText(colors, typography)}>{row.checkInAt}</Text>
                </View>
                <View style={[styles.cell, styles.cellRoomID]}>
                  <Text style={styles.bodyText(colors, typography)}>{row.room_id}</Text>
                </View>
                <View style={[styles.cell, styles.cellNoOfGuests]}>
                  <Text style={styles.bodyText(colors, typography)}>
                    {formatReadableNumber(row.noOfGuests)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cellLengthOfStay]}>
                  <Text style={styles.bodyText(colors, typography)}>
                    {formatReadableNumber(row.lengthOfStay)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cellActions, styles.actionsCell]}>
                  <View style={styles.actionButtons(spacing)}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton(spacing, radius),
                        styles.viewButton,
                        pressed && styles.viewButtonPressed,
                      ]}
                      onPress={() => openGuestLogModal("view", row.id)}
                    >
                      <Text style={styles.viewButtonText(colors, typography)}>View</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton(spacing, radius),
                        styles.editButton,
                        pressed && styles.editButtonPressed,
                      ]}
                      onPress={() => openGuestLogModal("edit", row.id)}
                    >
                      <Text style={styles.editButtonText(colors, typography)}>Edit</Text>
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
  tableContainer: (colors) => ({
    backgroundColor: colors.card,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
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
  headerCellStyles: (colors) => ({
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  }),
  headerText: (colors, typography) => ({
    fontSize: typography.fontSize.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),
  bodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bodyCellStyles: (colors) => ({
    borderBottomColor: colors.border,
  }),
  bodyText: (colors, typography) => ({
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.weight.regular,
  }),
  rowHoverStyles: (colors, pressed) => ({
    backgroundColor: pressed ? colors.surface : colors.card,
  }),
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  // Column widths
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
    width: 130,
  },
  actionsCell: {
    paddingHorizontal: 0,
  },
  tableBody: {
    flex: 1,
  },
  actionButtons: (spacing) => ({
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    paddingLeft: spacing.sm,
  }),
  // Action Button Styles
  actionButton: (spacing, radius) => ({
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  viewButtonPressed: {
    opacity: 0.7,
  },
  viewButtonText: (colors, typography) => ({
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.weight.medium,
  }),
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  editButtonPressed: {
    opacity: 0.7,
  },
  editButtonText: (colors, typography) => ({
    color: '#D4AF37',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.weight.medium,
  }),
});