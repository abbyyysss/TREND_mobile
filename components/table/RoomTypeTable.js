import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function RoomTypeTable({ roomTypes = [] }) {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <View style={[styles.container, styles.tableContainer(colors, radius)]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          {/* Table Header */}
          <View style={[styles.headerRow, styles.headerCellStyles(colors, spacing)]}>
            <View style={[styles.cell, styles.cellRoomTypeName]}>
              <Text style={styles.headerText(colors, typography)}>
                Room type name
              </Text>
            </View>
            <View style={[styles.cell, styles.cellMinCapacity]}>
              <Text style={styles.headerText(colors, typography)}>
                Minimum capacity
              </Text>
            </View>
            <View style={[styles.cell, styles.cellMaxCapacity]}>
              <Text style={styles.headerText(colors, typography)}>
                Maximum capacity
              </Text>
            </View>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.tableBody}>
            {roomTypes.length > 0 ? (
              roomTypes.map((room, index) => (
                <View
                  key={room.id}
                  style={[
                    styles.bodyRow,
                    styles.bodyCellStyles(colors, spacing),
                    index === roomTypes.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={[styles.cell, styles.cellRoomTypeName]}>
                    <Text style={styles.bodyText(colors, typography)}>
                      {room.room_name}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cellMinCapacity]}>
                    <Text style={styles.bodyText(colors, typography)}>
                      {room.min}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cellMaxCapacity]}>
                    <Text style={styles.bodyText(colors, typography)}>
                      {room.max}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.emptyRow, { paddingVertical: spacing.lg }]}>
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSize.sm,
                    },
                  ]}
                >
                  No room types found.
                </Text>
              </View>
            )}
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
  tableContainer: (colors, radius) => ({
    backgroundColor: colors.card,
    borderRadius: radius.lg || 8,
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
  },
  headerCellStyles: (colors, spacing) => ({
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md || 12,
    paddingHorizontal: spacing.md || 16,
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
  },
  bodyCellStyles: (colors, spacing) => ({
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: spacing.md || 12,
    paddingHorizontal: spacing.md || 16,
  }),
  bodyText: (colors, typography) => ({
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.weight.regular,
  }),
  lastRow: {
    borderBottomWidth: 0,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  // Column widths - responsive
  cellRoomTypeName: {
    flex: 2,
    minWidth: 200,
  },
  cellMinCapacity: {
    flex: 1,
    minWidth: 150,
  },
  cellMaxCapacity: {
    flex: 1,
    minWidth: 150,
  },
  tableBody: {
    flex: 1,
  },
  emptyRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    textAlign: 'center',
  },
});