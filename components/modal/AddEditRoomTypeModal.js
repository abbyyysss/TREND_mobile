import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import SecondaryModalHeader from '../header/SecondaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import DefaultButton from '../button/DefaultButton';
import MainSnackbar from '../snackbar/MainSnackbar';
import NotificationModal from './NotificationModal';
import LoadingText from '../loading/LoadingText';
import { useAuth } from '@/context/AuthContext';
import { addAERoomType, updateAERoomType } from '@/services/RoomTypeService';
import { getCurrentUser } from '@/services/AuthService';

export default function AddEditRoomTypeModal({
  open,
  onClose,
  mode = 'add',
  roomType,
  onSuccess,
}) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { setUser } = useAuth();

  const [name, setName] = useState('');
  const [minCap, setMinCap] = useState('');
  const [maxCap, setMaxCap] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', min: '', max: '' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const [openNotifModal, setOpenNotifModal] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && roomType) {
      setName(roomType.room_name || '');
      setMinCap(roomType.min || '');
      setMaxCap(roomType.max || '');
    } else {
      setName('');
      setMinCap('');
      setMaxCap('');
    }
    setErrors({ name: '', min: '', max: '' });
  }, [mode, roomType, open]);

  const handleSubmit = async () => {
    setErrors({ name: '', min: '', max: '' });

    // Required field validation
    if (!name || !minCap || !maxCap) {
      setErrors({
        name: !name ? 'Room name is required' : '',
        min: !minCap ? 'Minimum capacity required' : '',
        max: !maxCap ? 'Maximum capacity required' : '',
      });
      return;
    }

    // Convert to numbers for comparison
    const minValue = Number(minCap);
    const maxValue = Number(maxCap);

    // Check numeric validity
    if (isNaN(minValue) || isNaN(maxValue)) {
      setErrors({
        min: isNaN(minValue) ? 'Minimum must be a valid number' : '',
        max: isNaN(maxValue) ? 'Maximum must be a valid number' : '',
      });
      return;
    }

    // Check logical relation
    if (maxValue < minValue) {
      setErrors({
        max: 'Maximum capacity must not be smaller than minimum capacity',
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        room_name: name,
        min: minValue,
        max: maxValue,
      };

      let savedRoomType;
      if (mode === 'add') {
        savedRoomType = await addAERoomType(payload);
      } else {
        savedRoomType = await updateAERoomType(roomType.id, payload);
      }

      const updatedUser = await getCurrentUser();
      setUser(updatedUser);

      if (onSuccess) onSuccess(savedRoomType);

      setOpenNotifModal(true);
    } catch (error) {
      console.error('Error saving room type:', error);
      const respData = error.response?.data;

      if (respData) {
        const newErrors = { name: '', min: '', max: '' };
        if (respData.room_name) newErrors.name = respData.room_name.join(', ');
        if (respData.min) newErrors.min = respData.min.join(', ');
        if (respData.max) newErrors.max = respData.max.join(', ');
        setErrors(newErrors);

        if (!respData.room_name && !respData.min && !respData.max) {
          setSnackbar({
            open: true,
            message: 'Failed to save room type.',
            severity: 'error',
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Something went wrong. Please try again.',
          severity: 'error',
        });
      }
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
              <SecondaryModalHeader
                onClose={onClose}
                label={mode === 'add' ? 'ADD ROOM TYPE' : 'EDIT ROOM TYPE'}
              />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>
                  {mode === 'add' ? 'Add New Room Type' : 'Edit Room Type'}
                </Text>

                <View style={styles.formContainer}>
                  {/* Room Type Name */}
                  <MainTextInput
                    label="Room Type Name"
                    value={name}
                    onChange={setName}
                    size="small"
                    shrink={true}
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name}
                  />

                  {/* Minimum Capacity */}
                  <MainTextInput
                    label="Minimum Capacity"
                    type="number"
                    value={minCap}
                    onChange={setMinCap}
                    size="small"
                    shrink={true}
                    variant="outlined"
                    error={!!errors.min}
                    helperText={errors.min}
                  />

                  {/* Maximum Capacity */}
                  <MainTextInput
                    label="Maximum Capacity"
                    type="number"
                    value={maxCap}
                    onChange={setMaxCap}
                    size="small"
                    shrink={true}
                    variant="outlined"
                    error={!!errors.max}
                    helperText={errors.max}
                  />

                  {/* Buttons */}
                  <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={
                          loading ? (
                            <LoadingText
                              text={mode === 'add' ? 'ADDING...' : 'SAVING...'}
                            />
                          ) : mode === 'add'
                          ? 'ADD'
                          : 'SAVE CHANGES'
                        }
                        onPress={handleSubmit}
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
        label={
          mode === 'add'
            ? 'ROOM TYPE ADDED SUCCESSFULLY'
            : 'ROOM TYPE UPDATED SUCCESSFULLY'
        }
        description={
          mode === 'add'
            ? 'A new room type has been successfully added.'
            : 'The room type has been successfully updated.'
        }
        onClose={() => {
          setOpenNotifModal(false);
          onClose();
        }}
      />
    </>
  );
}