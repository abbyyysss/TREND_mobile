import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';
import { fetchMergedReports } from '@/services/ReportService';
import { useTheme } from '@/assets/theme/ThemeContext';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import BackToRouteButton from '@/components/button/BackToRouteButton';
import DownloadButton from '@/components/button/DownloadButton';
import ReportSummaryTable from '@/components/table/ReportSummaryTable';
import GuestTypeSummaryTable from '@/components/table/GuestTypeSummaryTable';
import DailyBreakdownSummaryTable from '@/components/table/DailyBreakdownSummaryTable';
import ReportSummaryFilterNav from '@/components/navigation/ReportSummaryFilterNav';
import { ReportFilterProvider, useReportFilter } from '@/context/ReportFilterContext';
import MonthlyReportService from '@/services/ReportService';
import CustomPagination from '@/components/pagination/Pagination';
import { convertMonthToNumber } from '@/utils/dateUtils';

const Loading = () => <LoadingOverlay message="Loading reports management..." />;

function SummarySwitch({
  reports,
  dailyBreakdown,
  dailyCount,
  dailyPage,
  rowsPerPage,
  setRowsPerPage,
  handleDailyPageChange,
  aeId,
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
        <View style={[styles.switchContainer, { gap: spacing.lg }]}>
          <DailyBreakdownSummaryTable data={dailyBreakdown} aeId={aeId} />

          {dailyBreakdown.length > 0 && (
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

export default function ReportsManagementMonth() {
  const { user, loading } = useAuth();
  const { id, month, year } = useLocalSearchParams();
  const { colors, typography, spacing, fonts } = useTheme();

  const [reports, setReports] = useState([]);
  const [aeName, setAeName] = useState('Establishment');
  const [fetching, setFetching] = useState(true);
  const [reportMode, setReportMode] = useState(null);

  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [dailyPage, setDailyPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDailyPageChange = (value) => {
    const num = Number(value);
    if (!Number.isNaN(num) && num !== dailyPage) {
      setDailyPage(num);
    }
  };

  const handleDownload = async () => {
    try {
      const monthNumber = convertMonthToNumber(month);
      const period = `${year}-${monthNumber}-1`;

      const fileBlob = await MonthlyReportService.exportReports({
        period,
        aeid: id,
      });

      // Note: File download in React Native requires expo-file-system or react-native-fs
      console.log('Download initiated for:', `${year}-${monthNumber} ${aeName} Tourism Report.xlsx`);
      // TODO: Implement native file download with expo-file-system
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const loadReports = useCallback(async () => {
    setFetching(true);

    try {
      const { mapped } = await fetchMergedReports({ id, year });
      const monthReports = mapped.filter((r) => r.month === month);
      setReports(monthReports);

      if (monthReports.length > 0) {
        setAeName(monthReports[0].aeName || 'Establishment');
        setReportMode(monthReports[0].reportMode || null);
      }

      const daily = await MonthlyReportService.fetchDailyBreakdown({
        aeid: id,
        year,
        month: convertMonthToNumber(month),
        page: dailyPage,
        page_size: rowsPerPage,
      });

      setDailyBreakdown(daily.results || []);
      setDailyCount(daily.count || 0);
    } catch (err) {
      console.error('Failed to fetch month reports:', err);
    } finally {
      setFetching(false);
    }
  }, [id, year, month, dailyPage, rowsPerPage]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (loading || fetching) return <Loading />;
  if (!user) return null;

  return (
    <ReportFilterProvider defaultValue="Daily Breakdown">
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
      >
        <View style={[styles.headerRow, { gap: spacing.sm }]}>
          <BackToRouteButton
            title={`${aeName}'s ${month} ${year} report`}
            route={`/reports-management/${id}/${year}`}
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

            <SummarySwitch
              reports={reports}
              dailyBreakdown={dailyBreakdown}
              dailyCount={dailyCount}
              dailyPage={dailyPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              handleDailyPageChange={handleDailyPageChange}
              aeId={id}
            />
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  switchContainer: {
    width: '100%',
  },
  filterContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    marginBottom: 8,
  },
});