import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import DateInput from '@/components/input/DateInput';
import StatsCard from '@/components/card/StatsCard';
import GuestLogTable from '@/components/table/GuestLogTable';
import GuestLogModal from '@/components/modal/GuestLogModal';
import DefaultButton from '@/components/button/DefaultButton';
import Pagination from '@/components/pagination/Pagination';
import GuestLogService from '@/services/GuestLogService';
import NoResultsText from '@/components/text/NoResultsText';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import NotificationModal from '@/components/modal/NotificationModal';
import LoadingSnackbar from '@/components/snackbar/LoadingSnackbar';
import { formatDate } from '@/utils/dateUtils';
import { useTheme } from '@/assets/theme/ThemeContext';


export default function GuestLog() {
  const { colors, fonts, spacing } = useTheme();
  const { user, role } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedRow, setSelectedRow] = useState(null);

  const titleTextSize = 13;
  const statsTextSize = 32;

  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState({
    checkInGuests: 0,
    roomsAvailable: 0,
    roomsOccupied: 0,
    guestNights: 0,
  });
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filter, setFilter] = useState({
    mode: 'daily',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  const handleDelete = async (logId) => {
    try {
      setSnackbarOpen(true);

      await GuestLogService.deleteGuestLog(logId);
      await loadData(page, rowsPerPage, filter);

      setNotifMessage('Guest log deleted successfully!');
      setNotifOpen(true);
    } catch (error) {
      console.error('Error deleting guest log:', error);

      setNotifMessage('Failed to delete guest log. Please try again.');
      setNotifOpen(true);
    } finally {
      setSnackbarOpen(false);
      setConfirmOpen(false);
    }
  };

  const loadData = useCallback(
    async (pageNum = page, pageSize = rowsPerPage, activeFilter = filter) => {
      try {
        setLoading(true);

        const [logs, kpiData] = await Promise.all([
          GuestLogService.fetchGuestLogs(
            pageNum,
            pageSize,
            activeFilter.mode,
            activeFilter.date
          ),
          GuestLogService.fetchCheckinKPIs(
            activeFilter.mode,
            activeFilter.date
          ),
        ]);

        console.log('CHECK-IN KPIs FROM SERVICE:', kpiData);

        setData(logs.results);
        setTotalCount(logs.count);

        setKpis({
          checkInGuests: kpiData.checkInGuests ?? 0,
          roomsAvailable: kpiData.roomsAvailable ?? 0,
          roomsOccupied: kpiData.roomsOccupied ?? 0,
          guestNights: kpiData.guestNights ?? 0,
        });
      } catch (error) {
        console.error('Error loading guest logs + KPIs:', error);

        setData([]);
        setTotalCount(0);

        setKpis({
          checkInGuests: 0,
          roomsAvailable: 0,
          roomsOccupied: 0,
          guestNights: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, filter]
  );

  // Re-fetch when filter changes
  useEffect(() => {
    loadData(1, rowsPerPage, filter);
    setPage(1);
  }, [filter, rowsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
    loadData(value, rowsPerPage);
  };

  const handleRowsPerPageChange = (newSize) => {
    setRowsPerPage(newSize);
    setPage(1);
    loadData(1, newSize);
  };

  const openGuestLogModal = async (mode, rowId = null) => {
    setModalMode(mode);
    setSelectedRow(null);

    if (rowId) {
      try {
        const fullData = await GuestLogService.fetchGuestLogById(rowId);
        setSelectedRow(fullData);
      } catch (error) {
        console.error('Error fetching guest log details:', error);
      }
    }

    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const getFilterDisplayDate = () => {
    if (!filter.date) return '';

    const d = new Date(filter.date);

    switch (filter.mode) {
      case 'daily':
        return formatDate(d); // e.g., "Nov 20, 2025"
      case 'monthly':
        return d.toLocaleString('default', { month: 'long', year: 'numeric' });
      // e.g., "November 2025"
      case 'yearly':
        return d.getFullYear(); // e.g., "2025"
      default:
        return formatDate(d);
    }
  };

  const filterDisplayDate = getFilterDisplayDate();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.innerContainer, { gap: spacing.lg }]}>
          {/* Date Filter */}
          <View style={styles.dateInputWrapper}>
            <DateInput onFilterChange={setFilter} initialFilter={filter} />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatsCard
              titleText="No. of Rooms Available"
              statsText={kpis.roomsAvailable}
              titleTextSize={titleTextSize}
              statsTextSize={statsTextSize}
              isIncreasing={true}
              withPercentage={false}
              helperText={`For ${filterDisplayDate}`}
            />
            <StatsCard
              titleText="No. of Guest Check In"
              statsText={kpis.checkInGuests}
              titleTextSize={titleTextSize}
              statsTextSize={statsTextSize}
              isIncreasing={true}
              withPercentage={false}
              helperText={`For ${filterDisplayDate}`}
            />
            <StatsCard
              titleText="No. of Guest Nights"
              statsText={kpis.guestNights}
              titleTextSize={titleTextSize}
              statsTextSize={statsTextSize}
              isIncreasing={true}
              withPercentage={false}
              helperText={`For ${filterDisplayDate}`}
            />
            <StatsCard
              titleText="No. of Rooms Occupied"
              statsText={kpis.roomsOccupied}
              titleTextSize={titleTextSize}
              statsTextSize={statsTextSize}
              isIncreasing={true}
              withPercentage={false}
              helperText={`For ${filterDisplayDate}`}
            />
          </View>

          {/* Create Button */}
          <View style={styles.buttonWrapper}>
            <DefaultButton
              label="+ Create Guest Log"
              fontSize={13}
              paddingVertical={7}
              paddingHorizontal={10}
              fullWidth={false}
              onPress={() => openGuestLogModal('add')}
            />
          </View>

          {/* Table or Loading/Empty State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingOverlay message="Loading..." />
            </View>
          ) : data.length === 0 ? (
            <NoResultsText />
          ) : (
            <>
              <View style={styles.tableWrapper}>
                <GuestLogTable
                  openGuestLogModal={openGuestLogModal}
                  data={data}
                  loading={loading}
                  onDelete={(id) => {
                    setDeleteId(id);
                    setConfirmOpen(true);
                  }}
                />
              </View>

              <View style={styles.paginationWrapper}>
                <Pagination
                  count={Math.ceil(totalCount / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Guest Log Modal */}
      <GuestLogModal
        open={modalOpen}
        mode={modalMode}
        rowData={selectedRow}
        onClose={handleClose}
        refreshLogs={loadData}
        user={user}
        role={role}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        label="Delete Guest Log"
        description="Are you sure you want to delete this guest log?"
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
        onConfirm={() => handleDelete(deleteId)}
        onClose={() => setConfirmOpen(false)}
      />

      {/* Notification Modal */}
      <NotificationModal
        open={notifOpen}
        label={notifMessage.includes('Failed') ? 'Error' : 'Success'}
        description={notifMessage}
        onClose={() => setNotifOpen(false)}
      />

      {/* Loading Snackbar */}
      <LoadingSnackbar open={snackbarOpen} message="Processing..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  dateInputWrapper: {
    flexDirection: 'row',
  },
  statsGrid: {
    width: '100%',
    gap: 20,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'flex-start',
  },
  loadingContainer: {
    position: 'relative',
    height: 200,
  },
  tableWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  paginationWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});