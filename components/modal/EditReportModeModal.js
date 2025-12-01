import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
// import { useAuth } from '@/context/authContext';
// import { updateCurrentUser } from '@/services/authService';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';

export default function EditReportModeModal({ open, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const { user, setUser, loading: authLoading } = useAuth();
  // const profile = user?.user_profile;

  // Mock data for UI testing
  const profile = {
    report_mode: 'DAILY',
  };

  const [type, setType] = useState(profile?.report_mode ?? 'DAILY');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({ report_mode: '' });

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

  // Update local state when user/profile changes
  useEffect(() => {
    setType(profile?.report_mode ?? 'DAILY');
  }, [profile?.report_mode]);

  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const typeOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'MONTHLY', label: 'Monthly' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!type) newErrors.report_mode = 'Reporting mode is required.';
    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validate()) return;

    // API call commented out
    // try {
    //   setLoading(true);
    //   const payload = { report_mode: type };
    //   const formData = new FormData();
    //   Object.entries(payload).forEach(([k, v]) => {
    //     if (v !== undefined && v !== null && v !== '') formData.append(k, v);
    //   });
    //   const res = await updateCurrentUser(formData);
    //   console.log('✅ Report mode update success:', res);
    //   if (res?.user_profile) {
    //     setUser((prev) => ({
    //       ...prev,
    //       user_profile: res.user_profile,
    //     }));
    //   }
    //   setShowSuccessModal(true);
    // } catch (err) {
    //   const errData = err.response?.data;
    //   console.error('❌ Report mode update failed:', errData || err);
    //   const backendErrors = {};
    //   if (errData && typeof errData === 'object') {
    //     Object.entries(errData).forEach(([field, messages]) => {
    //       const msg = Array.isArray(messages) ? messages[0] : String(messages);
    //       backendErrors[field] = msg;
    //       showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
    //     });
    //   } else {
    //     showSnackbar('Failed to update report mode. Please try again.', 'error');
    //   }
    //   setErrors(backendErrors);
    // } finally {
    //   setLoading(false);
    // }

    // Mock success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleCancel = () => onClose();

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const styles = createStyles(isDark);

  return (
    <>
      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <PrimaryModalHeader onClose={onClose} label="Edit Report Mode" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.content}>
                <View>
                  <Text style={styles.title}>Report Mode</Text>
                  <Text style={styles.note}>
                    Note: Changes to report mode will have to be approved by DOT first to be
                    implemented.
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <MainSelectInput
                    label="Report Mode"
                    value={type}
                    onChange={setType}
                    options={typeOptions}
                    error={Boolean(errors.report_mode)}
                    helperText={errors.report_mode || ''}
                  />

                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={loading ? <LoadingText text="SAVING..." /> : 'SAVE CHANGES'}
                        onPress={handleSaveChanges}
                        disabled={loading}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label="CANCEL"
                        onPress={handleCancel}
                        isRed={true}
                        disabled={loading}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notification modal for success */}
      <NotificationModal
        open={showSuccessModal}
        onClose={handleSuccessClose}
        label="REPORT MODE UPDATED SUCCESSFULLY"
        description="Your report mode has been submitted. Changes require DOT approval to take effect."
      />

      {/* Snackbar for errors only */}
      {currentSnack && (
        <MainSnackbar
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

const createStyles = (isDark) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxWidth: 650,
      maxHeight: '90%',
      backgroundColor: isDark ? '#000' : '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#DADADA',
      overflow: 'hidden',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: 20,
      gap: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#d5d6d7' : '#313638',
    },
    note: {
      fontSize: 14,
      color: '#828282',
      marginTop: 5,
    },
    formContainer: {
      gap: 20,
      paddingHorizontal: '10%',
    },
    buttonContainer: {
      flexDirection: 'column',
      gap: 10,
      paddingHorizontal: 20,
    },
    buttonWrapper: {
      flex: 1,
    },
  });