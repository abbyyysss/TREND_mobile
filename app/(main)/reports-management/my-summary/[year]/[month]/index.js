import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';
import { useReportFilter, ReportFilterProvider } from '@/context/ReportFilterContext';
import { useTheme } from '@/assets/theme/ThemeContext';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import BackToRouteButton from '@/components/button/BackToRouteButton';
import DownloadButton from '@/components/button/DownloadButton';
import ReportSummaryTable from '@/components/table/ReportSummaryTable';
import GuestTypeSummaryTable from '@/components/table/GuestTypeSummaryTable';
import DailyBreakdownSummaryTable from '@/components/table/DailyBreakdownSummaryTable';
import ReportSummaryFilterNav from '@/components/navigation/ReportSummaryFilterNav';
import { fetchMergedReports } from '@/services/ReportService';
import MonthlyReportService from '@/services/ReportService';
import { convertMonthToNumber } from '@/utils/dateUtils';
import CustomPagination from '@/components/pagination/Pagination';

const Loading = () => <LoadingOverlay message="Loading reports management..." />;

function SummarySwitch({
  reports,
  dailyBreakdown,
  dailyCount,
  dailyPage,
  rowsPerPage,
  setRowsPerPage,
  handleDailyPageChange,
}) {
  const { activeFilter } = useReportFilter();
  const { spacing } = useTheme();

  switch (activeFilter) {
    case 'Guest Nights':
      return <GuestTypeSummaryTable reports={reports} />;

    case 'Guest Check-ins':
      return <GuestTypeSummaryTable reports={reports} isCheckIn={true} />;

    case 'Daily Breakdown':
      const totalPages = Math.ceil(dailyCount / rowsPerPage);

      return (
        <View style={[styles.summaryContainer, { gap: spacing.lg }]}>
          <DailyBreakdownSummaryTable data={dailyBreakdown} />

          {dailyBreakdown.length !== 0 && (
            <CustomPagination
              count={totalPages}
              page={dailyPage}
              rowsPerPage={rowsPerPage}
              onChange={(_, value) => handleDailyPageChange(value)}
              onRowsPerPageChange={(newSize) => {
                setRowsPerPage(newSize);
                handleDailyPageChange(1);
              }}
            />
          )}
        </View>
      );

    default:
      return null;
  }
}

export default function MySummaryReport() {
  const { user, myProfileId, loading, role } = useAuth();
  const { month, year } = useLocalSearchParams();
  const { colors, typography, spacing, fonts } = useTheme();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const aeName = user?.user_profile?.establishment_name || 'My Report';

  const loadedRef = useRef(false);
  const requestInFlightRef = useRef(false);

  const today = new Date();
  const selectedYear = useMemo(() => year ?? today.getFullYear(), [year]);
  const selectedMonth = useMemo(() => new Date(`${month} 1, 2000`).getMonth() + 1, [month]);

  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [dailyPage, setDailyPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDownload = async () => {
    try {
      const monthNumber = convertMonthToNumber(month);
      const period = `${year}-${monthNumber}-1`;

      const fileBlob = await MonthlyReportService.exportReports({
        period,
      });

      // Note: File download in React Native requires expo-file-system
      console.log('Download initiated for:', `${year}-${monthNumber} ${aeName} Tourism Report.xlsx`);
      // TODO: Implement native file download with expo-file-system
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadReports = async () => {
      setIsLoading(true);
      try {
        const { mapped } = await fetchMergedReports({
          date: `${selectedYear}-${selectedMonth}`,
        });
        setReports(mapped);

        const daily = await MonthlyReportService.fetchDailyBreakdown({
          year: selectedYear,
          month: selectedMonth,
          page: dailyPage,
          page_size: rowsPerPage,
        });

        setDailyBreakdown(daily.results);
        setDailyCount(daily.count);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [selectedYear, selectedMonth, user, dailyPage, rowsPerPage]);

  if (loading || isLoading) return <Loading />;
  if (!user) return null;

  const u = user?.user_profile;
  const reportMode = role === 'AE' ? u?.report_mode : null;

  const handleDailyPageChange = (newPage) => {
    const num = Number(newPage);
    if (!Number.isNaN(num) && num !== dailyPage) {
      setDailyPage(num);
    }
  };

  return (
    <ReportFilterProvider defaultValue="Daily Breakdown">
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: spacing.lg,
            paddingVertical: 30,
            gap: spacing.lg,
          },
        ]}
      >
        <View style={[styles.headerRow, { gap: spacing.sm }]}>
          <BackToRouteButton
            title={`Summary for the month of ${month} ${year}`}
            route="/reports-management"
          />
          <DownloadButton
            iconSize={40}
            text={`Export ${month} ${year} report`}
            onClick={handleDownload}
          />
        </View>

        <ReportSummaryTable reports={reports} />

        {reportMode === AEReportMode.DAILY ? (
          <>
            <View style={styles.filterContainer}>
              <ReportSummaryFilterNav />
            </View>
            <View style={styles.switchContainer}>
              <SummarySwitch
                reports={reports}
                dailyBreakdown={dailyBreakdown}
                dailyCount={dailyCount}
                dailyPage={dailyPage}
                rowsPerPage={rowsPerPage}
                handleDailyPageChange={handleDailyPageChange}
                setRowsPerPage={setRowsPerPage}
              />
            </View>
          </>
        ) : (
          <>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontFamily: fonts.gotham,
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.weight.bold,
                },
              ]}
            >
              Guest arrivals/check-ins by Nationality/Country of Residence breakdown
            </Text>
            <GuestTypeSummaryTable reports={reports} isCheckIn={true} />
          </>
        )}
      </ScrollView>
    </ReportFilterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  switchContainer: {
    width: '100%',
  },
  summaryContainer: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 8,
  },
});