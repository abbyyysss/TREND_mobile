import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';
import GuestLogModal from '@/components/modal/GuestLogModal';
import LoadingText from '@/components/loading/LoadingText';
import MonthlyReportService from '@/services/ReportService';
import GuestLogService from '@/services/GuestLogService';
import NoResultsText from '@/components//text/NoResultsText';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatTime } from '@/utils/dateUtils';

const { width } = Dimensions.get('window');

export default function OccupiedRoomsModal({ open, onClose, date, aeId }) {
  const { colors, spacing, typography, radius, isDark, fonts } = useTheme();
  const { user, myProfileId, loading, role } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

  const [roomsData, setRoomsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const openGuestLogModal = (mode = 'add') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };

  // ==========================
  // 🔥 FETCH OCCUPIED ROOMS
  // ==========================
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const params = {
          date: date,
          ...(role !== 'AE' && { aeid: aeId }), // ⬅️ add AE ID only if not AE
        };

        const res = await MonthlyReportService.fetchOccupiedRooms(params);

        console.log('📌 OCCUPIED ROOMS DATA FROM SERVICE:', res);

        setRoomsData(res?.rooms || []);
      } catch (error) {
        console.error('Error loading occupied rooms:', error);
        setRoomsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, date, aeId, role]);

  const handleOpenGuestLog = async (room) => {
    try {
      setIsLoading(true);

      const data = await GuestLogService.fetchGuestLogById(room.check_in_id);

      setSelectedRow(data); // full guest log details
      setModalMode('view');
      setModalOpen(true);
    } catch (error) {
      console.error('Error loading guest log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate number of columns based on screen width
  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : width >= 640 ? 2 : 1;
  const cardWidth = width / numColumns - spacing.lg * 2;

  return (
    <>
      <Modal visible={open} animationType="slide" transparent={false} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: spacing.lg,
            }}
          >
            {/* Title */}
            <View
              style={{
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xxl,
                  fontWeight: typography.weight.bold,
                  color: colors.text,
                  fontFamily: fonts.gotham,
                }}
              >
                Occupied Rooms
              </Text>
            </View>

            {isLoading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: spacing.xl,
                  fontFamily: fonts.gotham,
                }}
              >
                <LoadingText text="Loading..." />
              </View>
            ) : (
              <>
                {roomsData.length === 0 && <NoResultsText text="No occupied rooms" />}

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: spacing.md,
                    justifyContent: 'flex-start',
                  }}
                >
                  {roomsData.map((room, index) => (
                    <TouchableOpacity
                      key={room.check_in_id || index}
                      onPress={() => handleOpenGuestLog(room)}
                      style={{
                        width: cardWidth,
                        minWidth: 150,
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: spacing.lg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.card,
                      }}
                    >
                      <Ionicons name="bed" size={75} color={colors.text} />
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.weight.bold,
                          color: colors.text,
                          marginTop: spacing.sm,
                          fontFamily: fonts.gotham,
                        }}
                      >
                        Room {room.room_id}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.md,
                          color: colors.text,
                          marginTop: spacing.xs,
                          fontFamily: fonts.gotham,
                        }}
                      >
                        {room.room_type}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.textSecondary,
                          fontFamily: fonts.gotham,
                          marginTop: spacing.xs,
                          textAlign: 'center',
                        }}
                      >
                        {formatDate(room.check_in_date)} | {formatTime(room.check_in_at)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      <GuestLogModal
        open={modalOpen}
        mode="view"
        rowData={selectedRow}
        isOccupiedRooms={true}
        isTotalGuestsLabel={true}
        onClose={() => {
          setModalOpen(false);
          onCloseModal();
        }}
      />
    </>
  );
}