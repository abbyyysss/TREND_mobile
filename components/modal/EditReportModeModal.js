import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';
import { useAuth } from '@/context/AuthContext';
import { updateCurrentUser } from '@/services/AuthService';

export default function EditReportModeModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser, loading: authLoading } = useAuth();
  const profile = user?.user_profile;

  // initialize from context profile if available
  const [type, setType] = useState(profile?.report_mode ?? 'DAILY');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // input errors
  const [errors, setErrors] = useState({ report_mode: '' });

  // Snackbar queue (errors only)
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

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setCurrentSnack(null);
  };

  // update local state when user/profile changes (keeps modal in sync)
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

    try {
      setLoading(true);
      const payload = { report_mode: type };
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') formData.append(k, v);
      });

      const res = await updateCurrentUser(formData);
      console.log('✅ Report mode update success:', res);

      // update auth context so UI updates without reload
      if (res?.user_profile) {
        setUser((prev) => ({
          ...prev,
          user_profile: res.user_profile,
        }));
      }

      setShowSuccessModal(true);
    } catch (err) {
      const errData = err.response?.data;
      console.error('❌ Report mode update failed:', errData || err);

      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
        });
      } else {
        showSnackbar('Failed to update report mode. Please try again.', 'error');
      }
      setErrors(backendErrors);
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
    titleContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.semibold,
      marginBottom: 4,
    },
    note: {
      fontSize: 14,
      color: '#828282',
      fontFamily: fonts.gotham,
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
              <PrimaryModalHeader onClose={onClose} label="Edit Report Mode" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Report Mode</Text>
                  <Text style={styles.note}>
                    Note: Changes to report mode will have to be approved by DOT first to be implemented.
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  {/* Report Mode Select */}
                  <MainSelectInput
                    label="Report Mode"
                    value={type}
                    size="small"
                    shrink={true}
                    onChange={setType}
                    options={typeOptions}
                    variant="outlined"
                    error={Boolean(errors.report_mode)}
                    helperText={errors.report_mode || ''}
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

      {/* Notification modal for success */}
      <NotificationModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        label="REPORT MODE UPDATED SUCCESSFULLY"
        description="Your report mode has been submitted. Changes require DOT approval to take effect."
      />

      {/* Snackbar for errors only (queue) */}
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