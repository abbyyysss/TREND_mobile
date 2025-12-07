import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import ChangePasswordModal from './ChangePasswordModal';
import NoResultsText from '../text/NoResultsText';
import MainSnackbar from '../snackbar/MainSnackbar';
import AddEditRoomTypeModal from './AddEditRoomTypeModal';
import LoadingOverlay from '../loading/LoadingOverlay';
import { useAuth } from '@/context/AuthContext';
import { getAERoomTypes, deleteAERoomType } from '@/services/RoomTypeService';
import { getCurrentUser } from '@/services/AuthService';

export default function EditRoomTypeModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser } = useAuth();

  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  // Unified modal close handler
  const handleCloseModal = async () => {
    try {
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    } finally {
      onClose?.();
    }
  };

  // Fetch AE room types on open
  useEffect(() => {
    if (!open) return;

    const fetchRoomTypes = async () => {
      setLoading(true);
      try {
        const data = await getAERoomTypes();
        setRoomTypes(data || []);
      } catch (error) {
        console.error('Failed to fetch AE room types:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load room types.',
          severity: 'error',
        });
        setRoomTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, [open]);

  // Delete room type
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteAERoomType(id);
      setRoomTypes((prev) => prev.filter((r) => r.id !== id));

      // Refresh global user
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);

      setOpenNotificationModal(true);
    } catch (error) {
      console.error('Failed to delete room type:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to delete room type.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: '#DADADA',
      maxWidth: 650,
      width: '90%',
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
    scrollContent: {
      flexGrow: 1,
    },
    headerContainer: {
      width: '100%',
    },
    bodyContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.lg,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: typography.fontSize.xl,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.semibold,
    },
    addButton: {
      padding: spacing.xs,
    },
    listContainer: {
      width: '100%',
      paddingHorizontal: '5%',
      gap: spacing.sm,
    },
    loadingContainer: {
      paddingVertical: spacing.lg,
    },
    roomTypeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#C0BFBF',
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
    },
    roomTypeName: {
      flex: 0.3,
      fontSize: typography.fontSize.sm,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
    },
    roomTypeCapacity: {
      flex: 0.2,
      fontSize: typography.fontSize.sm,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
    },
    capacityValue: {
      color: '#757575',
    },
    actionsContainer: {
      flex: 0.3,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.xs,
    },
    iconButton: {
      padding: spacing.xs,
    },
    backButtonContainer: {
      alignItems: 'center',
      marginTop: spacing.md,
    },
  });

  return (
    <>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <PrimaryModalHeader onClose={handleCloseModal} label="Edit Room Types" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>Room Types</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setModalMode('add');
                      setSelectedRoomType(null);
                      setOpenAddEditModal(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle" size={24} color="#7CB530" />
                  </TouchableOpacity>
                </View>

                {/* Table List */}
                <View style={styles.listContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <LoadingOverlay message="" />
                    </View>
                  ) : roomTypes.length === 0 ? (
                    <NoResultsText isGap={false} text="No room types yet." />
                  ) : (
                    roomTypes.map((data) => (
                      <View key={data.id} style={styles.roomTypeCard}>
                        <Text style={styles.roomTypeName}>{data.room_name}</Text>
                        <Text style={styles.roomTypeCapacity}>
                          Min: <Text style={styles.capacityValue}>{data.min}</Text>
                        </Text>
                        <Text style={styles.roomTypeCapacity}>
                          Max: <Text style={styles.capacityValue}>{data.max}</Text>
                        </Text>
                        <View style={styles.actionsContainer}>
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => handleDelete(data.id)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash" size={18} color="#EF1A25" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {
                              setModalMode('edit');
                              setSelectedRoomType(data);
                              setOpenAddEditModal(true);
                            }}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="edit" size={18} color="#D4AF37" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                {/* Back Button */}
                <View style={styles.backButtonContainer}>
                  <DefaultButton
                    label="BACK"
                    isRed={true}
                    isTransparent={true}
                    onPress={handleCloseModal}
                    fontSize={13}
                    paddingVertical={7}
                    paddingHorizontal={10}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Modal */}
      <AddEditRoomTypeModal
        open={openAddEditModal}
        onClose={() => setOpenAddEditModal(false)}
        mode={modalMode}
        roomType={selectedRoomType}
        onSuccess={(savedRoomType) => {
          setRoomTypes((prev) => {
            if (modalMode === 'add') return [...prev, savedRoomType];
            return prev.map((r) =>
              r.id === savedRoomType.id ? savedRoomType : r
            );
          });
        }}
      />

      {/* Delete Success */}
      <NotificationModal
        open={openNotificationModal}
        label="SUCCESS"
        description="Room type deleted successfully."
        onClose={() => setOpenNotificationModal(false)}
      />

      {/* Change Password */}
      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />

      {/* Snackbar */}
      <MainSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}