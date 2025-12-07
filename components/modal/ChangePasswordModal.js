import { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { changePassword } from '@/services/AuthService';
import SecondaryModalHeader from '@/components/header/SecondaryModalHeader';
import DefaultButton from '@/components/button/DefaultButton';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import NotificationModal from '@/components/modal/NotificationModal';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
import LoadingText from '@/components/loading/LoadingText';

export default function ChangePasswordModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius } = useTheme();

  // Form fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field errors
  const [errors, setErrors] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // Snackbar queue
  const [snackQueue, setSnackQueue] = useState([]);
  const [currentSnack, setCurrentSnack] = useState(null);

  const showSnackbar = (message, severity = 'error') => {
    const id = Date.now();
    setSnackQueue((prev) => [...prev, { id, message, severity }]);
  };

  useEffect(() => {
    if (!currentSnack && snackQueue.length > 0) {
      const [next, ...rest] = snackQueue;
      setCurrentSnack(next);
      setSnackQueue(rest);
    }
  }, [snackQueue, currentSnack]);

  const handleCloseSnackbar = () => {
    setCurrentSnack(null);
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!oldPassword.trim()) validationErrors.old_password = 'Old password is required.';
    if (!newPassword.trim()) validationErrors.new_password = 'New password is required.';
    else if (newPassword.length < 8) validationErrors.new_password = 'Must be at least 8 characters.';
    if (!confirmPassword.trim()) validationErrors.confirm_password = 'Please confirm your new password.';
    else if (confirmPassword !== newPassword)
      validationErrors.confirm_password = 'Passwords do not match.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((msg) => showSnackbar(msg, 'error'));
      return;
    }

    setErrors({});
    try {
      setLoading(true);
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      console.log('🔒 Password update payload:', payload);
      const res = await changePassword(payload);
      console.log('✅ Password update success:', res);

      // Clear input fields on success
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Show success modal
      setShowNotificationModal(true);
    } catch (err) {
      const errData = err.response?.data;
      console.error('❌ Password update failed:', errData || err);

      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, msg]) => {
          const message = Array.isArray(msg) ? msg[0] : msg;
          backendErrors[field] = message;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${message}`, 'error');
        });
      } else {
        showSnackbar('Failed to change password. Please try again.', 'error');
      }
      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      onClose();
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      width: '90%',
      maxWidth: 400,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
    contentWrapper: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    bodyContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      gap: spacing.xl,
      alignItems: 'center',
    },
    inputsContainer: {
      width: '100%',
      gap: spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
      paddingHorizontal: spacing.md,
    },
    buttonWrapper: {
      flex: 1,
    },
  });

  return (
    <>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.contentWrapper}>
              <SecondaryModalHeader onClose={handleClose} label="CHANGE PASSWORD" />

              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.bodyContainer}>
                  <View style={styles.inputsContainer}>
                    <MainPasswordInput
                      label="Enter your old password"
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      error={errors.old_password}
                      editable={!loading}
                    />
                    <MainPasswordInput
                      label="Enter your new password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      error={errors.new_password}
                      editable={!loading}
                    />
                    <MainPasswordInput
                      label="Reconfirm new password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      error={errors.confirm_password}
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={loading ? <LoadingText text="SAVING..." /> : 'SAVE CHANGES'}
                        onPress={handleSubmit}
                        disabled={loading}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label="CANCEL"
                        onPress={handleClose}
                        isRed={true}
                        disabled={loading}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <NotificationModal
        open={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          onClose();
        }}
        label="PASSWORD CHANGE SUCCESSFUL"
        description="Your password has been changed successfully."
      />

      {/* Error Snackbar */}
      {currentSnack && (
        <MainSnackbar
          key={currentSnack.id}
          open={true}
          message={currentSnack.message}
          severity={currentSnack.severity}
          onClose={handleCloseSnackbar}
          duration={4000}
        />
      )}
    </>
  );
}