import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { fetchMergedReports } from '@/services/ReportService';
import MonthlyReportService from '@/services/ReportService';
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
import DownloadButton from '@/components/button/DownloadButton';
import { convertMonthToNumber } from '@/utils/dateUtils';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MainSnackbar from '@/components/snackbar/MainSnackbar';

export default function ReportsManagement() {
  const { colors, spacing } = useTheme();
  const { myProfileId, user, loading: authLoading } = useAuth();

  const aeName = user?.user_profile?.establishment_name || 'My Report';

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

  // Error snackbar state
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });

  const handleDownload = async () => {
    try {
      if (!selectedYear) {
        setErrorSnackbar({
          open: true,
          message: 'Please select a year to export reports.',
        });
        return;
      }

      const period = `${selectedYear}-12-01`; // Format: YYYY-MM-DD

      // Call the export API
      const fileBlob = await MonthlyReportService.exportReports({
        period,
      });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];

        // Save to device
        const fileName = `${selectedYear}_${aeName}_Tourism_Report.xlsx`;
        const fileUri = FileSystem.documentDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          setErrorSnackbar({
            open: true,
            message: 'Sharing is not available on this device',
          });
        }
      };
    } catch (error) {
      console.error('Download error:', error);
      setErrorSnackbar({
        open: true,
        message: error?.response?.data?.detail || 'Failed to export reports. Please try again.',
      });
    }
  };

  // New function to fetch current month report status
  const loadCurrentMonthReportStatus = useCallback(async () => {
    if (!myProfileId) return;

    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // JavaScript months are 0-indexed

      const { mapped } = await fetchMergedReports({
        id: myProfileId,
        year: year,
        month: month,
        page: 1,
        page_size: 1,
      });

      if (mapped && mapped.length > 0) {
        setCurrentMonthReportStatus(mapped[0].status);
        setCurrentMonthReport(mapped[0]); // Store the full report for editing
      } else {
        setCurrentMonthReportStatus(null);
        setCurrentMonthReport(null);
      }
    } catch (err) {
      console.error('Failed to fetch current month report status:', err);
      setCurrentMonthReportStatus(null);
      setCurrentMonthReport(null);
    }
  }, [myProfileId]);

  const loadStatsAndYears = useCallback(async () => {
    if (!myProfileId || statsLoadedRef.current) return;

    try {
      const { mapped: allReports } = await fetchMergedReports({
        id: myProfileId,
        page: 1,
        page_size: 9999,
      });

      const missingCount = allReports.filter((r) => r.status?.toUpperCase() === 'MISSING').length;
      const flaggedCount = allReports.filter((r) => r.status?.toUpperCase() === 'FLAGGED').length;

      const years = Array.from(
        new Set(
          allReports
            .map((r) => {
              if (!r.date) return null;
              const dateObj = new Date(r.date);
              if (isNaN(dateObj)) return null;
              return dateObj.getFullYear().toString();
            })
            .filter(Boolean),
        ),
      ).sort((a, b) => b - a);

      setStatsCache({
        missingCount,
        flaggedCount,
        availableYears: years,
      });

      if (years.length > 0) {
        setSelectedYear(years[0]);
      }

      statsLoadedRef.current = true;
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [myProfileId]);

  const loadPaginatedReports = useCallback(
    async (year) => {
      if (!myProfileId || !year || requestInFlightRef.current) return;

      requestInFlightRef.current = true;
      setLoading(true);

      try {
        const params = {
          id: myProfileId,
          page: page,
          page_size: rowsPerPage,
        };

        if (selectedStatus !== 'All') params.status = selectedStatus;
        params.year = year;

        const { mapped, count } = await fetchMergedReports(params);
        setReportData(mapped);
        setTotalCount(count);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
        requestInFlightRef.current = false;
      }
    },
    [myProfileId, rowsPerPage, selectedStatus, page],
  );

  useEffect(() => {
    if (authLoading || !myProfileId || initialLoadRef.current) return;

    initialLoadRef.current = true;

    const initializeData = async () => {
      await loadStatsAndYears();
      await loadCurrentMonthReportStatus(); // Load current month status
    };

    initializeData();
  }, [authLoading, myProfileId, loadStatsAndYears, loadCurrentMonthReportStatus]);

  useEffect(() => {
    if (!myProfileId || !selectedYear || !statsLoadedRef.current) {
      setLoading(false);
      return;
    }

    loadPaginatedReports(selectedYear);
  }, [myProfileId, selectedYear, page, rowsPerPage, selectedStatus, loadPaginatedReports]);

  const handleStatusChange = useCallback(
    (filter) => {
      if (filter === selectedStatus) return;

      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }

      filterDebounceRef.current = setTimeout(() => {
        setSelectedStatus(filter);
        setPage(1);
      }, 300);
    },
    [selectedStatus],
  );

  const handleYearChange = useCallback(
    (year) => {
      if (year === selectedYear) return;

      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }

      filterDebounceRef.current = setTimeout(() => {
        setSelectedYear(year);
        setPage(1);
      }, 300);
    },
    [selectedYear],
  );

  // Updated modal handler to handle edit mode when status is submitted
  const handleOpenMonthlyReport = (mode = 'add', report = null) => {
    // If opening from SummaryCard and status is submitted, use edit mode
    if (mode === 'add' && currentMonthReportStatus?.toLowerCase() === 'submitted' && currentMonthReport) {
      setModalMode('edit');
      setSelectedReport(currentMonthReport);
    } else {
      setModalMode(mode);
      setSelectedReport(report);
    }
    setOpenMonthlyReport(true);
  };

  const confirmAction = () => {
    setOpenNotification(true);
  };

  // Refresh current month status after modal closes
  const handleModalClose = () => {
    setOpenMonthlyReport(false);
    loadCurrentMonthReportStatus(); // Refresh status after closing modal
    if (selectedYear) {
      loadPaginatedReports(selectedYear); // Refresh the table as well
    }
  };

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    statsLoadedRef.current = false;
    await loadStatsAndYears();
    await loadCurrentMonthReportStatus();
    if (selectedYear) {
      await loadPaginatedReports(selectedYear);
    }
    setRefreshing(false);
  }, [loadStatsAndYears, loadCurrentMonthReportStatus, loadPaginatedReports, selectedYear]);

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ gap: spacing.lg }}>
          {/* Summary Card - now with reportStatus prop */}
          <SummaryCard
            onOpenMonthlyReport={() => handleOpenMonthlyReport('add')}
            reportStatus={currentMonthReportStatus}
          />

          {/* Year Filter */}
          <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <FilterSelectInput
                placeholder="Select Year"
                options={statsCache.availableYears}
                value={selectedYear}
                onSelect={handleYearChange}
              />
            </View>
            <View style={{ marginTop: spacing.md }}>
              <DownloadButton
                iconSize={40}
                text={`Export all ${selectedYear} reports`}
                onClick={handleDownload}
              />
            </View>
          </View>

          {/* Stats Section */}
          <View style={{ gap: spacing.md }}>
            <StatsCard
              titleText="Flagged Reports"
              statsText={formatReadableNumber(statsCache.flaggedCount)}
              withPercentage={false}
              isRed={true}
            />
            <StatsCard
              titleText="Missing Reports"
              statsText={formatReadableNumber(statsCache.missingCount)}
              withPercentage={false}
              isDefault={true}
            />
          </View>

          {/* Status Filter */}
          <View style={{ width: '100%' }}>
            <ReportFilterNav activeFilter={selectedStatus} onFilterChange={handleStatusChange} />
          </View>

          {/* Reports Table */}
          <View style={{ width: '100%' }}>
            {loading ? (
              <View style={{ height: 200, position: 'relative' }}>
                <LoadingOverlay message="Loading reports..." />
              </View>
            ) : reportData.length === 0 ? (
              <View>
                <AEReportsTable reports={reportData} isAE={true} onOpenMonthlyReport={handleOpenMonthlyReport} />
                <NoResultsText />
              </View>
            ) : (
              <View style={{ gap: spacing.lg }}>
                <AEReportsTable reports={reportData} isAE={true} onOpenMonthlyReport={handleOpenMonthlyReport} />
                <View style={{ alignItems: 'center', width: '100%' }}>
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

      {/* Error Snackbar */}
      <MainSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        severity="error"
        onClose={() => setErrorSnackbar({ open: false, message: '' })}
      />
    </>
  );
}