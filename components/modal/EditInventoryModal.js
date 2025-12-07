import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import DefaultButton from '../button/DefaultButton';
import MainSnackbar from '../snackbar/MainSnackbar';
import NotificationModal from './NotificationModal';
import LoadingText from '../loading/LoadingText';
import { useAuth } from '@/context/AuthContext';
import { updateCurrentUser, getCurrentUser } from '@/services/AuthService';

export default function EditInventoryModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser } = useAuth();
  const profile = user?.user_profile;

  // State
  const [totalRooms, setTotalRooms] = useState('');
  const [availableRooms, setAvailableRooms] = useState('');
  const [maleEmployees, setMaleEmployees] = useState('');
  const [femaleEmployees, setFemaleEmployees] = useState('');

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const [errors, setErrors] = useState({
    totalRooms: '',
    availableRooms: '',
    maleEmployees: '',
    femaleEmployees: '',
  });
  const [openNotifModal, setOpenNotifModal] = useState(false);

  // Preload current values when modal opens
  useEffect(() => {
    if (!profile || !open) return;
    setTotalRooms(profile.total_rooms || '');
    setAvailableRooms(profile.available_rooms ?? '');
    setMaleEmployees(profile.male_employees || '');
    setFemaleEmployees(profile.female_employees || '');
  }, [profile, open]);

  // Save handler
  const handleSaveChanges = async () => {
    const newErrors = {
      totalRooms: '',
      availableRooms: '',
      maleEmployees: '',
      femaleEmployees: '',
    };

    let hasError = false;

    if (!totalRooms) {
      newErrors.totalRooms = 'Total Rooms is required';
      hasError = true;
    }

    if (!availableRooms) {
      newErrors.availableRooms = 'Available Rooms is required';
      hasError = true;
    } else if (Number(availableRooms) > Number(totalRooms)) {
      newErrors.availableRooms = 'Cannot exceed total rooms';
      hasError = true;
    }

    if (!maleEmployees) {
      newErrors.maleEmployees = 'Required';
      hasError = true;
    }

    if (!femaleEmployees) {
      newErrors.femaleEmployees = 'Required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Proceed with API call
    try {
      setLoading(true);

      const payload = {
        total_rooms: totalRooms,
        available_rooms: availableRooms,
        male_employees: maleEmployees,
        female_employees: femaleEmployees,
      };

      await updateCurrentUser(payload);
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      setOpenNotifModal(true);
    } catch (error) {
      console.error('Error updating inventory:', error);
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => onClose();

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
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 20,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.semibold,
      marginBottom: 20,
    },
    formContainer: {
      width: '100%',
      paddingHorizontal: '5%',
      gap: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      gap: 15,
      paddingHorizontal: 20,
      marginTop: 10,
    },
    buttonWrapper: {
      flex: 1,
    },
  });

  return (
    <>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <PrimaryModalHeader onClose={onClose} label="Edit Inventory" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Inventory Information</Text>

                <View style={styles.formContainer}>
                  {/* Total Rooms */}
                  <MainTextInput
                    label="Total Rooms"
                    variant="outlined"
                    type="number"
                    value={totalRooms}
                    onChange={setTotalRooms}
                    size="small"
                    shrink={true}
                    error={!!errors.totalRooms}
                    helperText={errors.totalRooms}
                  />

                  {/* Available Rooms */}
                  <MainTextInput
                    label="Available Rooms"
                    variant="outlined"
                    type="number"
                    value={availableRooms}
                    onChange={setAvailableRooms}
                    size="small"
                    shrink={true}
                    error={!!errors.availableRooms}
                    helperText={errors.availableRooms}
                  />

                  {/* Male Employees */}
                  <MainTextInput
                    label="Male Employees"
                    variant="outlined"
                    type="number"
                    value={maleEmployees}
                    onChange={setMaleEmployees}
                    size="small"
                    shrink={true}
                    error={!!errors.maleEmployees}
                    helperText={errors.maleEmployees}
                  />

                  {/* Female Employees */}
                  <MainTextInput
                    label="Female Employees"
                    variant="outlined"
                    type="number"
                    value={femaleEmployees}
                    onChange={setFemaleEmployees}
                    size="small"
                    shrink={true}
                    error={!!errors.femaleEmployees}
                    helperText={errors.femaleEmployees}
                  />

                  {/* Buttons */}
                  <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={loading ? <LoadingText text="SAVING..." /> : 'SAVE CHANGES'}
                        onPress={handleSaveChanges}
                        disabled={loading}
                        fontSize={13}
                        paddingVertical={7}
                        paddingHorizontal={10}
                        fullWidth={true}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label="CANCEL"
                        onPress={handleCancel}
                        isRed={true}
                        disabled={loading}
                        fontSize={13}
                        paddingVertical={7}
                        paddingHorizontal={10}
                        fullWidth={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <MainSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      <NotificationModal
        open={openNotifModal}
        label="INVENTORY UPDATED SUCCESSFULLY"
        description="Your inventory has been successfully updated."
        onClose={() => {
          setOpenNotifModal(false);
          onClose();
        }}
      />
    </>
  );
}