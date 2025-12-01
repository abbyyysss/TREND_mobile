import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  useColorScheme,
} from 'react-native';
// import { useAuth } from '@/context/authContext';
// import { fetchMergedReports } from '@/services/reportService';
import StatsCard from '@/components/card/StatsCard';
import Pagination from '@/components/pagination/Pagination';
import ReportFilterNav from '@/components/navigation/ReportFilterNav';
import AEReportsTable from '@/components/table/AEReportsTable';
import SummaryCard from '@/components/card/SummaryCard';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import NoResultsText from '@/components/text/NoResultsText';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import NotificationModal from '@/components/modal/NotificationModal';
import MonthlyReportModal from '@/components/modal/MonthlyReportModal';
import FilterSelectInput from '@/components/input/FilterSelectInput';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function ReportsManagement() {
  // const { myProfileId, user, loading: authLoading } = useAuth();
  const { colors, fonts } = useTheme();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedYear, setSelectedYear] = useState('');

  // New state for current month report status
  const [currentMonthReportStatus, setCurrentMonthReportStatus] = useState(null);
  const [currentMonthReport, setCurrentMonthReport] = useState(null);

  const [statsCache, setStatsCache] = useState({
    missingCount: 0,
    flaggedCount: 0,
    availableYears: [],
  });

  const statsLoadedRef = useRef(false);
  const filterDebounceRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const initialLoadRef = useRef(false);

  // Modal states
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openMonthlyReport, setOpenMonthlyReport] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedReport, setSelectedReport] = useState(null);

   // New function to fetch current month report status
  // const loadCurrentMonthReportStatus = useCallback(async () => {
  //   if (!myProfileId) return;

  //   try {
  //     const today = new Date();
  //     const year = today.getFullYear();
  //     const month = today.getMonth() + 1; // JavaScript months are 0-indexed

  //     const { mapped } = await fetchMergedReports({
  //       id: myProfileId,
  //       year: year,
  //       month: month,
  //       page: 1,
  //       page_size: 1,
  //     });

  //     if (mapped && mapped.length > 0) {
  //       setCurrentMonthReportStatus(mapped[0].status);
  //       setCurrentMonthReport(mapped[0]); // Store the full report for editing
  //     } else {
  //       setCurrentMonthReportStatus(null);
  //       setCurrentMonthReport(null);
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch current month report status:', err);
  //     setCurrentMonthReportStatus(null);
  //     setCurrentMonthReport(null);
  //   }
  // }, [myProfileId]);

  // const loadStatsAndYears = useCallback(async () => {
  //   if (!myProfileId || statsLoadedRef.current) return;

  //   try {
  //     const { mapped: allReports } = await fetchMergedReports({
  //       id: myProfileId,
  //       page: 1,
  //       page_size: 9999,
  //     });

  //     const missingCount = allReports.filter(
  //       (r) => r.status?.toUpperCase() === 'MISSING'
  //     ).length;
  //     const flaggedCount = allReports.filter(
  //       (r) => r.status?.toUpperCase() === 'FLAGGED'
  //     ).length;

  //     const years = Array.from(
  //       new Set(
  //         allReports
  //           .map((r) => {
  //             if (!r.date) return null;
  //             const dateObj = new Date(r.date);
  //             if (isNaN(dateObj)) return null;
  //             return dateObj.getFullYear().toString();
  //           })
  //           .filter(Boolean)
  //       )
  //     ).sort((a, b) => b - a);

  //     setStatsCache({
  //       missingCount,
  //       flaggedCount,
  //       availableYears: years,
  //     });

  //     if (years.length > 0) {
  //       setSelectedYear(years[0]);
  //     }

  //     statsLoadedRef.current = true;
  //   } catch (err) {
  //     console.error('Failed to fetch stats:', err);
  //   }
  // }, [myProfileId]);

  // const loadPaginatedReports = useCallback(
  //   async (year) => {
  //     if (!myProfileId || !year || requestInFlightRef.current) return;

  //     requestInFlightRef.current = true;
  //     setLoading(true);

  //     try {
  //       const params = {
  //         id: myProfileId,
  //         page: page,
  //         page_size: rowsPerPage,
  //       };

  //       if (selectedStatus !== 'All') params.status = selectedStatus;
  //       params.year = year;

  //       const { mapped, count } = await fetchMergedReports(params);
  //       setReportData(mapped);
  //       setTotalCount(count);
  //     } catch (err) {
  //       console.error('Failed to fetch reports:', err);
  //     } finally {
  //       setLoading(false);
  //       requestInFlightRef.current = false;
  //     }
  //   },
  //   [myProfileId, rowsPerPage, selectedStatus, page]
  // );

  // useEffect(() => {
  //   if (authLoading || !myProfileId || initialLoadRef.current) return;

  //   initialLoadRef.current = true;

  //   const initializeData = async () => {
  //     await loadStatsAndYears();
  //     await loadCurrentMonthReportStatus(); // Load current month status
  //   };

  //   initializeData();
  // }, [authLoading, myProfileId, loadStatsAndYears, loadCurrentMonthReportStatus]);

  // useEffect(() => {
  //   if (!myProfileId || !selectedYear || !statsLoadedRef.current) {
  //     setLoading(false);
  //     return;
  //   }

  //   loadPaginatedReports(selectedYear);
  // }, [myProfileId, selectedYear, page, rowsPerPage, selectedStatus, loadPaginatedReports]);

  // const handleStatusChange = useCallback(
  //   (filter) => {
  //     if (filter === selectedStatus) return;

  //     if (filterDebounceRef.current) {
  //       clearTimeout(filterDebounceRef.current);
  //     }

  //     filterDebounceRef.current = setTimeout(() => {
  //       setSelectedStatus(filter);
  //       setPage(1);
  //     }, 300);
  //   },
  //   [selectedStatus]
  // );

  // const handleYearChange = useCallback(
  //   (year) => {
  //     if (year === selectedYear) return;

  //     if (filterDebounceRef.current) {
  //       clearTimeout(filterDebounceRef.current);
  //     }

  //     filterDebounceRef.current = setTimeout(() => {
  //       setSelectedYear(year);
  //       setPage(1);
  //     }, 300);
  //   },
  //   [selectedYear]
  // );

  // // Pull to refresh handler
  // const onRefresh = useCallback(async () => {
  //   setRefreshing(true);
  //   try {
  //     await loadCurrentMonthReportStatus();
  //     if (selectedYear) {
  //       await loadPaginatedReports(selectedYear);
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing:', error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // }, [loadCurrentMonthReportStatus, loadPaginatedReports, selectedYear]);

  // // Updated modal handler to handle edit mode when status is submitted
  // const handleOpenMonthlyReport = (mode = 'add', report = null) => {
  //   // If opening from SummaryCard and status is submitted, use edit mode
  //   if (
  //     mode === 'add' &&
  //     currentMonthReportStatus?.toLowerCase() === 'submitted' &&
  //     currentMonthReport
  //   ) {
  //     setModalMode('edit');
  //     setSelectedReport(currentMonthReport);
  //   } else {
  //     setModalMode(mode);
  //     setSelectedReport(report);
  //   }
  //   setOpenMonthlyReport(true);
  // };

  // const confirmAction = () => {
  //   setOpenNotification(true);
  // };

  // // Refresh current month status after modal closes
  // const handleModalClose = () => {
  //   setOpenMonthlyReport(false);
  //   loadCurrentMonthReportStatus(); // Refresh status after closing modal
  //   if (selectedYear) {
  //     loadPaginatedReports(selectedYear); // Refresh the table as well
  //   }
  // };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      marginBottom: 25,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    statsCard: {
      flex: 1,
      minWidth: '100%',
    },
    statsCardTablet: {
      minWidth: '45%',
    },
    filterContainer: {
      marginBottom: 20,
    },
    tableContainer: {
      marginTop: 20,
    },
    loadingContainer: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationContainer: {
      marginTop: 25,
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Card - now with reportStatus prop */}
        <View style={styles.section}>
          <SummaryCard
            onOpenMonthlyReport={() => handleOpenMonthlyReport('add')}
            reportStatus={currentMonthReportStatus}
          />
        </View>

        {/* Year Filter */}
        <View style={styles.section}>
          <FilterSelectInput
            placeholder="Select Year"
            options={statsCache.availableYears}
            value={selectedYear}
            onSelect={handleYearChange}
          />
        </View>

        {/* Stats Section */}
        <View style={[styles.section, styles.statsGrid]}>
          <View style={styles.statsCard}>
            <StatsCard
              titleText="Flagged Reports"
              statsText={formatReadableNumber(statsCache.flaggedCount)}
              withPercentage={false}
              isRed={true}
            />
          </View>
          <View style={styles.statsCard}>
            <StatsCard
              titleText="Missing Reports"
              statsText={formatReadableNumber(statsCache.missingCount)}
              withPercentage={false}
              isDefault={true}
            />
          </View>
        </View>

        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <ReportFilterNav
            activeFilter={selectedStatus}
            onFilterChange={handleStatusChange}
          />
        </View>

        {/* Reports Table */}
        <View style={styles.tableContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingOverlay message="Loading reports..." />
            </View>
          ) : reportData.length === 0 ? (
            <AEReportsTable
              reports={reportData}
              isAE={true}
              onOpenMonthlyReport={handleOpenMonthlyReport}
            />
          ) : (
            <View>
              <AEReportsTable
                reports={reportData}
                isAE={true}
                onOpenMonthlyReport={handleOpenMonthlyReport}
              />
              <View style={styles.paginationContainer}>
                <Pagination
                  count={Math.max(1, Math.ceil(totalCount / rowsPerPage))}
                  page={page}
                  onChange={(value) => setPage(value)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(newSize) => {
                    setRowsPerPage(newSize);
                    setPage(1);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <ConfirmationModal
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        label="SUBMIT REPORT"
        description="Submit report for the selected year?"
        confirmButtonLabel="Yes, submit"
        cancelButtonLabel="No, nevermind"
        onConfirm={confirmAction}
      />

      <NotificationModal
        open={openNotification}
        onClose={() => setOpenNotification(false)}
        label="SUCCESS"
        description="You have successfully submitted your report."
      />

      <MonthlyReportModal
        open={openMonthlyReport}
        mode={modalMode}
        rowData={selectedReport}
        onClose={handleModalClose}
        refreshLogs={loadPaginatedReports}
      />
    </View>
  );
}