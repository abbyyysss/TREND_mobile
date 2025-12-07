import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import EmployeeSexChart from '@/components/chart/EmployeeSexChart';
import { useProfileRoute } from '@/context/ProfileRouteContext';
import EditIconButton from '@/components/button/EditIconButton';
import RoomTypeTable from '@/components/table/RoomTypeTable';
import EditInventoryModal from '@/components/modal/EditInventoryModal';
import EditRoomTypeModal from '@/components/modal/EditRoomTypeModal';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function ProfileInventory() {
  const { colors, spacing, typography, fonts, radius } = useTheme();
  const { viewed, isMine, loading } = useProfileRoute();

  const profile = viewed?.user_profile || null;
  const account = profile?.user || null;
  const isAE = account?.role === 'AE';

  const totalRooms = profile?.total_rooms || 0;
  const availableRooms = profile?.available_rooms || 0;
  const male = profile?.male_employees ?? null;
  const female = profile?.female_employees ?? null;

  const roomTypes = profile?.room_types || [];

  const totalEmployees =
    (typeof male === 'number' ? male : 0) +
    (typeof female === 'number' ? female : 0);

  const [openEditRoomTypeModal, setOpenRoomTypeModal] = useState(false);
  const [openEditInventoryModal, setOpenEditInventoryModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.xl,
    },
    section: {
      backgroundColor: colors.surface, 
      borderRadius: radius.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      gap: spacing.lg,
    },
    editButtonContainer: {
      alignItems: 'flex-end',
      width: '100%',
    },
    cardsContainer: {
      gap: spacing.lg,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.xl,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: typography.fontSize.lg,
      color: colors.foreground,
      fontFamily: fonts.gotham,
      marginBottom: spacing.xs,
    },
    cardValue: {
      fontSize: 50,
      color: colors.foreground,
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.bold,
    },
    loadingValue: {
      fontSize: 50,
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
    },
    chartContainer: {
      width: '100%',
      minHeight: 200,
    },
    chartPlaceholder: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
      textAlign: 'center',
      paddingVertical: spacing.xl,
    },
    roomTypesSection: {
      gap: spacing.lg,
      width: '100%',
      marginBottom: spacing.xl,
    },
    roomTypesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 2,
      borderBottomColor: '#DADADA',
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.sm,
    },
    roomTypesTitle: {
      fontSize: typography.fontSize.xl,
      color: colors.foreground,
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.semibold,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <View style={styles.editButtonContainer}>
              {isMine && <EditIconButton onPress={() => setOpenEditInventoryModal(true)} />}
            </View>

            <View style={styles.cardsContainer}>
              {/* Summary cards */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>No. of employees</Text>
                {loading ? (
                  <Text style={styles.loadingValue}>…</Text>
                ) : (
                  <Text style={styles.cardValue}>
                    {isAE ? formatReadableNumber(totalEmployees) : '—'}
                  </Text>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>No. of total rooms</Text>
                {loading ? (
                  <Text style={styles.loadingValue}>…</Text>
                ) : (
                  <Text style={styles.cardValue}>
                    {formatReadableNumber(totalRooms) ?? '—'}
                  </Text>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Available rooms this month</Text>
                {loading ? (
                  <Text style={styles.loadingValue}>…</Text>
                ) : (
                  <Text style={styles.cardValue}>
                    {formatReadableNumber(availableRooms) ?? '—'}
                  </Text>
                )}
              </View>

              {/* Chart */}
              <View style={styles.chartContainer}>
                {isAE ? (
                  <EmployeeSexChart
                    male={typeof male === 'number' ? male : 0}
                    female={typeof female === 'number' ? female : 0}
                    loading={!!loading}
                  />
                ) : (
                  <Text style={styles.chartPlaceholder}>
                    {loading ? 'Loading…' : 'No employee breakdown for this profile.'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.roomTypesSection}>
            <View style={styles.roomTypesHeader}>
              <Text style={styles.roomTypesTitle}>Room types</Text>
              {isMine && <EditIconButton onPress={() => setOpenRoomTypeModal(true)} />}
            </View>
            <RoomTypeTable roomTypes={roomTypes} />
          </View>
        </View>
      </ScrollView>

      <EditInventoryModal
        open={openEditInventoryModal}
        onClose={() => setOpenEditInventoryModal(false)}
      />
      <EditRoomTypeModal
        open={openEditRoomTypeModal}
        onClose={() => setOpenRoomTypeModal(false)}
      />
    </View>
  );
}