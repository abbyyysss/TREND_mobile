import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// import { extractFileInfo } from '@/utils/extractFileInfo';
// import { BASE_URL } from '@/services/constants';
// import { useAuth } from '@/context/authContext';
// import { updateCurrentUser } from '@/services/authService';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainDateInput from '../input/MainDateInput';
import DefaultButton from '../button/DefaultButton';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';
import NotificationModal from './NotificationModal';

export default function EditAccreditationModal({ open, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const { user, setUser } = useAuth();
  // const profile = user?.user_profile || {};

  // Mock data for UI testing
  const profile = {
    accreditation_control_number: 'ACC-2024-001',
    accreditation_expiry: '2025-12-31',
    accreditation_certificate: null,
    accreditation_status: true,
  };

  const [controlNumber, setControlNumber] = useState(profile.accreditation_control_number || '');
  const [expiryDate, setExpiryDate] = useState(profile.accreditation_expiry || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteAccreditation, setDeleteAccreditation] = useState(false);

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

  // Load existing file (commented out)
  // useEffect(() => {
  //   const loadExistingFile = async () => {
  //     if (!profile?.accreditation_certificate) return;
  //     try {
  //       const fileUrl = `${BASE_URL}${profile.accreditation_certificate}`;
  //       const fileInfo = await extractFileInfo(fileUrl);
  //       const response = await fetch(fileUrl);
  //       const blob = await response.blob();
  //       const file = new File([blob], fileInfo.name, { type: fileInfo.type });
  //       setUploadedFile({
  //         file,
  //         name: fileInfo.name,
  //         size: Number(fileInfo.size) || blob.size,
  //         type: fileInfo.type,
  //         url: fileUrl,
  //         isExisting: true,
  //       });
  //     } catch (err) {
  //       console.error("❌ Failed to load existing file:", err);
  //     }
  //   };
  //   if (open) loadExistingFile();
  // }, [open, profile]);

  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!controlNumber.trim()) newErrors.controlNumber = 'Control number is required.';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required.';

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    // API call commented out
    // try {
    //   setLoading(true);
    //   const formData = new FormData();
    //   formData.append('accreditation_control_number', controlNumber);
    //   formData.append('accreditation_expiry', expiryDate);
    //   if (uploadedFile) {
    //     formData.append('accreditation_certificate', uploadedFile);
    //   } else if (deleteAccreditation) {
    //     formData.append('accreditation_certificate', '');
    //   }
    //   const res = await updateCurrentUser(formData);
    //   setUser((prev) => ({
    //     ...prev,
    //     user_profile: res.user_profile,
    //   }));
    //   setShowSuccessModal(true);
    //   setDeleteAccreditation(false);
    // } catch (error) {
    //   const errData = error.response?.data;
    //   console.error('❌ Accreditation update failed:', errData || error);
    //   const backendErrors = {};
    //   if (errData && typeof errData === 'object') {
    //     Object.entries(errData).forEach(([field, messages]) => {
    //       const msg = Array.isArray(messages) ? messages[0] : String(messages);
    //       backendErrors[field] = msg;
    //       showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
    //     });
    //   } else {
    //     showSnackbar('Failed to update accreditation details. Please try again.', 'error');
    //   }
    //   setErrors(backendErrors);
    // } finally {
    //   setLoading(false);
    // }

    // Mock success for UI testing
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleCancel = () => onClose();

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
            <PrimaryModalHeader onClose={onClose} label="Edit Accreditation" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.content}>
                <Text style={styles.title}>Accreditation Details</Text>

                <View style={styles.formContainer}>
                  {/* Status */}
                  <View style={styles.statusSection}>
                    <Text style={styles.statusLabel}>Accreditation Status</Text>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusText}>
                        {profile.accreditation_status ? 'Accredited' : 'Not Accredited'}
                      </Text>
                      <MaterialIcons
                        name={profile.accreditation_status ? 'verified' : 'cancel'}
                        size={20}
                        color={profile.accreditation_status ? '#8DC641' : '#C64141'}
                      />
                    </View>
                  </View>

                  {/* Control Number */}
                  <MainTextInput
                    label="Control Number"
                    value={controlNumber}
                    onChange={setControlNumber}
                    error={Boolean(errors.controlNumber)}
                    helperText={errors.controlNumber || ''}
                  />

                  {/* Expiry Date */}
                  <MainDateInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChange={setExpiryDate}
                    error={Boolean(errors.expiryDate)}
                    helperText={errors.expiryDate || ''}
                  />

                  {/* File Upload */}
                  <View style={styles.fileSection}>
                    <Text
                      style={[
                        styles.fileLabel,
                        errors.accreditationCertificate && styles.errorText,
                      ]}
                    >
                      Accreditation Certificate{' '}
                      {errors.accreditationCertificate && (
                        <Text style={styles.errorText}>(required)</Text>
                      )}
                    </Text>

                    {uploadedFile && (
                      <UploadFileCard
                        file={uploadedFile}
                        onClose={() => {
                          setUploadedFile(null);
                          setDeleteAccreditation(true);
                        }}
                      />
                    )}

                    <View style={styles.uploadButtonContainer}>
                      <UploadButton
                        label="Click to upload or drag and drop your certificate"
                        onFileSelect={handleFileSelect}
                        accept="image/*,application/pdf"
                        withHelperText={true}
                      />
                    </View>
                  </View>

                  {/* Buttons */}
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
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
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
    formContainer: {
      gap: 20,
      paddingHorizontal: '10%',
    },
    statusSection: {
      gap: 5,
    },
    statusLabel: {
      fontSize: 17,
      color: isDark ? '#d5d6d7' : '#313638',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    statusText: {
      fontSize: 14,
      color: '#828282',
    },
    fileSection: {
      gap: 10,
    },
    fileLabel: {
      fontSize: 17,
      color: isDark ? '#d5d6d7' : '#313638',
    },
    errorText: {
      color: '#C64141',
    },
    uploadButtonContainer: {
      paddingTop: 10,
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