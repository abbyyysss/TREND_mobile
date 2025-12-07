import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { extractFileInfo } from '@/utils/extractFileInfo';
import { BASE_URL } from '@/services/Constants';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainDateInput from '../input/MainDateInput';
import DefaultButton from '../button/DefaultButton';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import NotificationModal from './NotificationModal';
import LoadingText from '../loading/LoadingText';
import MainSnackbar from '../snackbar/MainSnackbar';
import { useAuth } from '@/context/AuthContext';
import { updateCurrentUser } from '@/services/AuthService';

export default function EditAccreditationModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser } = useAuth();
  const profile = user?.user_profile || {};

  // ✅ States
  const [controlNumber, setControlNumber] = useState(profile.accreditation_control_number || '');
  const [expiryDate, setExpiryDate] = useState(profile.accreditation_expiry || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fileInputRef = useRef(null);
  const [deleteAccreditation, setDeleteAccreditation] = useState(false);

  // ✅ Snackbar queue
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

  useEffect(() => {
    const loadExistingFile = async () => {
      if (!profile?.accreditation_certificate) return;

      try {
        const fileUrl = `${BASE_URL}${profile.accreditation_certificate}`;
        const fileInfo = await extractFileInfo(fileUrl);

        const response = await fetch(fileUrl);
        const blob = await response.blob();

        const file = new File([blob], fileInfo.name, { type: fileInfo.type });

        console.log(fileInfo.size);

        setUploadedFile({
          file,
          name: fileInfo.name,
          size: Number(fileInfo.size) || blob.size,
          type: fileInfo.type,
          url: fileUrl,
          isExisting: true,
        });
      } catch (err) {
        console.error('❌ Failed to load existing accreditation certificate:', err);
      }
    };

    if (open) loadExistingFile();
  }, [open, profile]);

  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // ✅ File handlers
  const handleClickUploadArea = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target?.files?.[0] || e;
    if (file) setUploadedFile(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) setUploadedFile(file);
  };
  const handleDragOver = (e) => e.preventDefault();

  // ✅ Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!controlNumber.trim()) newErrors.controlNumber = 'Control number is required.';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required.';

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save handler
  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('accreditation_control_number', controlNumber);
      formData.append('accreditation_expiry', expiryDate);
      if (uploadedFile) {
        formData.append('accreditation_certificate', uploadedFile);
      } else if (deleteAccreditation) {
        formData.append('accreditation_certificate', '');
      }

      console.log('🧾 Accreditation update payload:', Object.fromEntries(formData.entries()));

      const res = await updateCurrentUser(formData);
      console.log('✅ Accreditation update success:', res);

      setUser((prev) => ({
        ...prev,
        user_profile: res.user_profile,
      }));

      setShowSuccessModal(true);
      setDeleteAccreditation(false);
    } catch (error) {
      const errData = error.response?.data;
      console.error('❌ Accreditation update failed:', errData || error);

      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
        });
      } else {
        showSnackbar('Failed to update accreditation details. Please try again.', 'error');
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
    statusContainer: {
      width: '100%',
    },
    statusTitle: {
      fontSize: 17,
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.medium,
      color: isDark ? '#d5d6d7' : '#313638',
      marginBottom: 4,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      color: '#828282',
      fontSize: 15,
      fontFamily: fonts.gotham,
    },
    statusIcon: {
      marginLeft: 4,
    },
    uploadSection: {
      width: '100%',
      gap: 10,
    },
    uploadTitle: {
      fontSize: 17,
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.medium,
    },
    uploadTitleNormal: {
      color: isDark ? '#d5d6d7' : '#313638',
    },
    uploadTitleError: {
      color: isDark ? '#f87171' : '#dc2626',
    },
    requiredText: {
      color: isDark ? '#f87171' : '#dc2626',
    },
    uploadFileContainer: {
      width: '100%',
    },
    uploadButtonContainer: {
      width: '100%',
      paddingTop: 10,
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
              <PrimaryModalHeader onClose={onClose} label="Edit Accreditation" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Accreditation Details</Text>

                <View style={styles.formContainer}>
                  {/* Status */}
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusTitle}>Accreditation Status</Text>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusText}>
                        {profile.accreditation_status ? 'Accredited' : 'Not Accredited'}
                      </Text>
                      {profile.accreditation_status ? (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={18} 
                          color="#8DC641" 
                          style={styles.statusIcon}
                        />
                      ) : (
                        <Ionicons 
                          name="close-circle-outline" 
                          size={18} 
                          color="#C64141" 
                          style={styles.statusIcon}
                        />
                      )}
                    </View>
                  </View>

                  {/* Control Number */}
                  <MainTextInput
                    label="Control Number"
                    variant="outlined"
                    type="text"
                    value={controlNumber}
                    onChange={setControlNumber}
                    size="small"
                    shrink={true}
                    error={Boolean(errors.controlNumber)}
                    helperText={errors.controlNumber || ''}
                  />

                  {/* Expiry Date */}
                  <MainDateInput
                    label="Expiry Date"
                    variant="outlined"
                    size="small"
                    value={expiryDate}
                    onChange={setExpiryDate}
                    error={Boolean(errors.expiryDate)}
                    helperText={errors.expiryDate || ''}
                  />

                  {/* File Upload */}
                  <View style={styles.uploadSection}>
                    <Text 
                      style={[
                        styles.uploadTitle,
                        errors.accreditationCertificate ? styles.uploadTitleError : styles.uploadTitleNormal
                      ]}
                    >
                      Accreditation Certificate{' '}
                      {errors.accreditationCertificate && (
                        <Text style={styles.requiredText}>(required)</Text>
                      )}
                    </Text>

                    {uploadedFile && (
                      <View style={styles.uploadFileContainer}>
                        <UploadFileCard 
                          file={uploadedFile} 
                          onClose={() => {
                            setUploadedFile(null);
                            setDeleteAccreditation(true);
                          }} 
                        />
                      </View>
                    )}

                    <View style={styles.uploadButtonContainer}>
                      <UploadButton
                        label="Click to upload or drag and drop your certificate"
                        onClick={handleClickUploadArea}
                        onDrop={handleDrop}
                        isFile={true}
                        onDragOver={handleDragOver}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        styles={{
                          backgroundColor: isDark ? '#1C1C1C' : '#F3F3F3',
                          paddingVertical: 20,
                          paddingHorizontal: 10,
                          width: '100%',
                        }}
                        withHelperText={true}
                      />
                    </View>
                  </View>

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

      {/* ✅ Success Modal */}
      <NotificationModal
        open={showSuccessModal}
        label="ACCREDITATION STATUS UPDATED SUCCESSFULLY"
        description="Your accreditation status has been successfully updated."
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />

      {/* Snackbar */}
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