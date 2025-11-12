import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/authContext';
// import { AEReportMode } from '@/services/constants';
import DefaultButton from '../button/DefaultButton';
import DownloadButton from '../button/DownloadButton';

const statusColors = {
  Auto: '#3B82F6',
  Pending: '#FF9300',
  Flagged: '#D4AF37',
  Missing: '#EF1A25',
  Submitted: '#7CB530',
};

export default function AEReportsTable({
  reports = [],
  isAE = false,
  isDOT = false,
  onOpenMonthlyReport,
}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

//   const { user, role } = useAuth();
//   const u = user?.user_profile;
//   const reportMode = role === 'AE' ? u?.report_mode : null;

  const isMdUp = width >= 768;

  const theme = {
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      secondary: isDark ? '#9ca3af' : '#6b7280',
    },
    background: {
      primary: isDark ? '#000000' : '#ffffff',
      row: isDark ? '#1a1a1a' : '#f9fafb',
    },
    border: isDark ? '#374151' : '#e5e7eb',
  };

  // Sort reports by year and month (newest first)
  const sortedReports = [...reports].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;

    const monthToNum = (month) => {
      if (typeof month === 'number') return month;
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return months.indexOf(month) + 1;
    };

    return monthToNum(b.month) - monthToNum(a.month);
  });

  const formatNumber = (num) => {
    if (num == null) return '0';
    return num.toLocaleString();
  };

  const handleViewPress = (row) => {
    const path = isAE
      ? `/reports-management/my-summary/${row.year}/${row.month}`
      : `/reports-management/${row.ae_id}/${row.year}/${row.month}`;
    router.push(path);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
            <View style={[styles.cell, styles.columnPeriod]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>Period</Text>
            </View>
            <View style={[styles.cell, styles.columnNumber]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>
                Available rooms
              </Text>
            </View>
            <View style={[styles.cell, styles.columnNumber]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>
                Rooms occupied
              </Text>
            </View>
            <View style={[styles.cell, styles.columnNumber]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>
                Guest check-ins
              </Text>
            </View>
            <View style={[styles.cell, styles.columnNumber]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>Guest nights</Text>
            </View>
            <View style={[styles.cell, styles.columnStatus]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>Status</Text>
            </View>
            <View style={[styles.cell, styles.columnActions]}>
              <Text style={[styles.headerText, { color: theme.text.primary }]}>Actions</Text>
            </View>
          </View>

          {/* Table Body */}
          {sortedReports.length > 0 ? (
            sortedReports.map((row, index) => (
              <View
                key={row.id}
                style={[
                  styles.bodyRow,
                  {
                    backgroundColor: index % 2 === 0 ? theme.background.primary : theme.background.row,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View style={[styles.cell, styles.columnPeriod]}>
                  <Text style={[styles.bodyText, { color: theme.text.primary }]}>
                    {row.monthYear}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnNumber]}>
                  <Text style={[styles.bodyText, { color: theme.text.primary }]}>
                    {formatNumber(row.availableRooms)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnNumber]}>
                  <Text style={[styles.bodyText, { color: theme.text.primary }]}>
                    {formatNumber(row.roomsOccupied)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnNumber]}>
                  <Text style={[styles.bodyText, { color: theme.text.primary }]}>
                    {formatNumber(row.totalGuests)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnNumber]}>
                  <Text style={[styles.bodyText, { color: theme.text.primary }]}>
                    {formatNumber(row.totalGuestNights)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnStatus]}>
                  <Text style={[styles.bodyText, { color: statusColors[row.status] || theme.text.primary }]}>
                    {row.status}
                  </Text>
                </View>
                <View style={[styles.cell, styles.columnActions]}>
                  <View style={styles.actionsContainer}>
                    <DefaultButton
                      label="View"
                      isBlue={true}
                      isTransparent={true}
                      onPress={() => handleViewPress(row)}
                      fontSize={12}
                    />
                    {isAE && reportMode === AEReportMode.MONTHLY && (
                      <>
                        {row.status === 'Pending' && (
                          <DefaultButton
                            label="Create"
                            isTransparent={true}
                            onPress={() => onOpenMonthlyReport('add', row)}
                            fontSize={12}
                          />
                        )}
                        {(row.status === 'Submitted' || row.status === 'Flagged') && (
                          <DefaultButton
                            label="Edit"
                            isTransparent={true}
                            onPress={() => onOpenMonthlyReport('edit', row)}
                            fontSize={12}
                          />
                        )}
                      </>
                    )}
                    <DownloadButton iconSize={20} />
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                No reports found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  table: {
    minWidth: 900,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  bodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  columnPeriod: {
    width: 120,
  },
  columnNumber: {
    width: 140,
  },
  columnStatus: {
    width: 100,
  },
  columnActions: {
    width: 240,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 13,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});