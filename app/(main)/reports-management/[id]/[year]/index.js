import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchMergedReports, MonthlyReportService } from '@/services/ReportService';
import { useTheme } from '@/assets/theme/ThemeContext';
import StatsCard from '@/components/card/StatsCard';
import Pagination from '@/components/pagination/Pagination';
import ReportFilterNav from '@/components/navigation/ReportFilterNav';
import AEReportsTable from '@/components/table/AEReportsTable';
import BackToRouteButton from '@/components/button/BackToRouteButton';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import DownloadButton from '@/components/button/DownloadButton';

export default function ReportsManagementYear() {
  const { user } = useAuth();
  const { id, year } = useLocalSearchParams();
  const { colors, spacing } = useTheme();

  const [reportData, setReportData] = useState([]);
  const [aeName, setAeName] = useState('Establishment');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [flaggedCount, setFlaggedCount] = useState(0);
  const [missingCount, setMissingCount] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleDownload = async () => {
    try {
      const period = `${year}-12-1`;

      const fileBlob = await MonthlyReportService.exportReports({
        period,
        aeid: id,
      });

      // Note: File download in React Native requires expo-file-system
      console.log('Download initiated for:', `${year} ${aeName} Tourism Report.xlsx`);
      // TODO: Implement native file download with expo-file-system
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const tableParams = {
        id,
        year,
        page,
        page_size: rowsPerPage,
      };
      if (selectedStatus !== 'All') tableParams.status = selectedStatus;

      const { mapped, count } = await fetchMergedReports(tableParams);
      setReportData(mapped);
      setTotalCount(count);

      if (mapped.length > 0 && mapped[0].aeName) {
        setAeName(mapped[0].aeName);
      } else if (mapped.length === 0) {
        setAeName('No Reports Yet');
      } else {
        setAeName('Establishment');
      }

      const { mapped: allReports } = await fetchMergedReports({
        ...tableParams,
        page: 1,
        page_size: 9999,
      });
      setFlaggedCount(allReports.filter((r) => r.status?.toUpperCase() === 'FLAGGED').length);
      setMissingCount(allReports.filter((r) => r.status?.toUpperCase() === 'MISSING').length);
    } catch (err) {
      console.error('Failed to fetch year reports:', err);
    } finally {
      setLoading(false);
    }
  }, [id, year, page, rowsPerPage, selectedStatus]);

  useEffect(() => {
    if (id && year) loadReports();
  }, [id, year, loadReports]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
    >
      <View style={[styles.headerRow, { gap: spacing.sm }]}>
        <BackToRouteButton
          title={`${aeName}'s ${year} reports`}
          route={`/reports-management/${id}`}
        />
        <DownloadButton
          iconSize={40}
          text={`Export all ${year} reports`}
          onClick={handleDownload}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatsCard
          titleText="Flagged Reports"
          statsText={flaggedCount.toString()}
          isRed
        />
        <StatsCard
          titleText="Missing Reports"
          statsText={missingCount.toString()}
          isDefault
        />
      </View>

      <View style={styles.filterContainer}>
        <ReportFilterNav
          activeFilter={selectedStatus}
          onFilterChange={(filter) => {
            if (filter !== selectedStatus) {
              setSelectedStatus(filter);
              setPage(1);
            }
          }}
        />
      </View>

      <View style={styles.tableContainer}>
        {loading ? (
          <View style={styles.loadingWrapper}>
            <LoadingOverlay message="Loading year reports..." />
          </View>
        ) : reportData.length === 0 ? (
          <AEReportsTable reports={reportData} />
        ) : (
          <View style={[styles.tableWithPagination, { gap: spacing.lg }]}>
            <AEReportsTable reports={reportData} />
            <View style={styles.paginationWrapper}>
              <Pagination
                count={Math.max(1, Math.ceil(totalCount / rowsPerPage))}
                page={page}
                rowsPerPage={rowsPerPage}
                onChange={(e, value) => setPage(value)}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  filterContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  tableContainer: {
    width: '100%',
  },
  loadingWrapper: {
    height: 200,
  },
  tableWithPagination: {
    width: '100%',
  },
  paginationWrapper: {
    alignItems: 'center',
    width: '100%',
  },
});