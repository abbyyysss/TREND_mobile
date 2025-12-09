import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/assets/theme/ThemeContext';
import { styles, getThemedStyles } from '@/styles/tableStyles';
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';
import DefaultButton from '@/components/button/DefaultButton';
import DownloadButton from '@/components/button/DownloadButton';
import MonthlyReportService from '@/services/ReportService';
import { formatReadableNumber } from '@/utils/numberFormatter';
import { convertMonthToNumber } from '@/utils/dateUtils';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
  onOpenMonthlyReport 
}) {
  const router = useRouter();
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedReport, setSelectedReport] = useState(null);

  const { user, loading, role } = useAuth();
  const u = user?.user_profile;
  const aeType = role === 'AE' ? u?.type : null;
  const reportMode = role === 'AE' ? u?.report_mode : null;

  const handleDownload = async (row) => {
    try {
      const monthNumber = convertMonthToNumber(row.month);
      const period = `${row.year}-${monthNumber}-1`;

      // Call the export API
      const fileBlob = await MonthlyReportService.exportReports({
        period,
        ...(!isAE && { aeid: row.ae_id }),
      });

      // For React Native, convert blob to base64 and save
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const filename = `${row.year}-${monthNumber} ${row.aeName} Tourism Report.xlsx`;
        const fileUri = FileSystem.documentDirectory + filename;

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      };
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  // Sort reports by year and month
  const sortedReports = [...reports].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;

    const monthToNum = (month) => {
      if (typeof month === 'number') return month;
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      return months.indexOf(month) + 1;
    };

    return monthToNum(b.month) - monthToNum(a.month);
  });

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
            <View style={[styles.headerCell, { width: 100 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Period</Text>
            </View>
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Available rooms</Text>
            </View>
            <View style={[styles.headerCell, { width: 180 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                No. of rooms occupied
              </Text>
            </View>
            <View style={[styles.headerCell, { width: 200 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                No. of guest check-ins
              </Text>
            </View>
            <View style={[styles.headerCell, { width: 200 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                No. of guest nights
              </Text>
            </View>
            <View style={[styles.headerCell, { width: 160 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Status</Text>
            </View>
            <View style={[styles.headerCell, { width: 180 }]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Actions</Text>
            </View>
          </View>

          {/* Table Body */}
          <View style={styles.tableBody}>
            {sortedReports.length > 0 ? (
              sortedReports.map((row) => (
                <View 
                  key={row.id} 
                  style={[styles.tableRow, themedStyles.tableRow]}
                >
                  <View style={[styles.cell, { width: 100 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {row.monthYear}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.availableRooms)}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 180 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.roomsOccupied)}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 200 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.totalGuests)}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 200 }]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(row.totalGuestNights)}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 160 }]}>
                    <Text 
                      style={[
                        styles.cellText, 
                        themedStyles.cellText,
                        { color: statusColors[row.status] || colors.text }
                      ]}
                    >
                      {row.status}
                    </Text>
                  </View>
                  <View style={[styles.cell, { width: 230}]}>
                    <View style={styles.actionsContainer}>
                      <DefaultButton
                        label="View"
                        isBlue={true}
                        isTransparent={true}
                        fullWidth={false}
                        onPress={() => {
                          const path = isAE
                            ? `/reports-management/my-summary/${row.year}/${row.month}`
                            : `/reports-management/${row.ae_id}/${row.year}/${row.month}`;
                          router.push(path);
                        }}
                      />
                      {isAE && reportMode === AEReportMode.MONTHLY && (
                        <>
                          {row.status === 'Pending' && (
                            <DefaultButton
                              label="Create"
                              isTransparent={true}
                              fullWidth={false}
                              onPress={() => onOpenMonthlyReport('add', row)}
                            />
                          )}
                          {(row.status === 'Submitted' || row.status === 'Flagged') && (
                            <DefaultButton
                              label="Edit"
                              isTransparent={true}
                              fullWidth={false}
                              onPress={() => onOpenMonthlyReport('edit', row)}
                            />
                          )}
                        </>
                      )}
                      <DownloadButton
                        iconSize={20}
                        text="Export"
                        onPress={() => handleDownload(row)}
                      />
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, themedStyles.emptyStateText]}>
                  No reports found.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}