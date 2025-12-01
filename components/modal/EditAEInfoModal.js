import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
// import { extractFileInfo } from '@/utils/extractFileInfo';
// import { BASE_URL } from '@/services/constants';
// import { useAuth } from '@/context/authContext';
// import { updateCurrentUser } from '@/services/authService';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';
import NotificationModal from '../modal/NotificationModal';

export default function EditAEInfoModal({ open, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const { user, setUser } = useAuth();
  // const profile = user?.user_profile || {};

  // Mock data for UI testing
  const profile = {
    id_code: 'LGU-2024-001',
    establishment_name: 'Grand Hotel',
    business_name: 'Grand Hospitality Inc.',
    type: 'HOTEL',
    proof_of_business: null,
  };

  const [idCode, setIdCode] = useState(profile.id_code || '');
  const [aeName, setAEName] = useState(profile.establishment_name || '');
  const [businessName, setBusinessName] = useState(profile.business_name || '');
  const [type, setType] = useState(profile.type || 'APARTMENT');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [deleteProof, setDeleteProof] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Snackbar setup
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
  //     if (!profile?.proof_of_business) return;
  //     try {
  //       const fileUrl = `${BASE_URL}${profile.proof_of_business}`;
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
  //       console.error("❌ Failed to load existing proof of business:", err);
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
    if (!aeName.trim()) newErrors.aeName = 'Establishment name is required.';
    if (!businessName.trim()) newErrors.businessName = 'Business name is required.';

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
    //   formData.append('id_code', idCode);
    //   formData.append('establishment_name', aeName);
    //   formData.append('business_name', businessName);
    //   formData.append('type', type);
    //   if (uploadedFile) {
    //     formData.append('proof_of_business', uploadedFile);
    //   } else if (deleteProof) {
    //     formData.append('proof_of_business', '');
    //   }
    //   const res = await updateCurrentUser(formData);
    //   setUser((prev) => ({
    //     ...prev,
    //     user_profile: res.user_profile,
    //   }));
    //   setShowSuccessModal(true);
    //   setDeleteProof(false);
    // } catch (error) {
    //   const errData = error.response?.data;
    //   console.error('❌ AE info update failed:', errData || error);
    //   const backendErrors = {};
    //   if (errData && typeof errData === 'object') {
    //     Object.entries(errData).forEach(([field, messages]) => {
    //       const msg = Array.isArray(messages) ? messages[0] : String(messages);
    //       backendErrors[field] = msg;
    //       showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
    //     });
    //   } else {
    //     showSnackbar('Failed to update AE information. Please try again.', 'error');
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

  const typeOptions = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESORT', label: 'Resort' },
    { value: 'INN', label: 'Inn' },
    { value: 'BED_AND_BREAKFAST', label: 'Bed & Breakfast' },
  ];

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
            <PrimaryModalHeader onClose={onClose} label="Edit Establishment Info" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.content}>
                <Text style={styles.title}>Establishment Information</Text>

                <View style={styles.formContainer}>
                  <MainTextInput
                    label="LGU Assigned ID Code"
                    value={idCode}
                    onChange={setIdCode}
                    error={Boolean(errors.idCode)}
                    helperText={errors.idCode || ''}
                  />

                  <MainTextInput
                    label="Establishment Name"
                    value={aeName}
                    onChange={setAEName}
                    error={Boolean(errors.aeName)}
                    helperText={errors.aeName || ''}
                  />

                  <MainTextInput
                    label="Business Name"
                    value={businessName}
                    onChange={setBusinessName}
                    error={Boolean(errors.businessName)}
                    helperText={errors.businessName || ''}
                  />

                  <MainSelectInput
                    label="Type of Accommodation"
                    value={type}
                    onChange={setType}
                    options={typeOptions}
                  />

                  {/* File Upload */}
                  <View style={styles.fileSection}>
                    <Text
                      style={[
                        styles.fileLabel,
                        errors.proofOfBusiness && styles.errorText,
                      ]}
                    >
                      Proof of Business Certificate{' '}
                      {errors.proofOfBusiness && (
                        <Text style={styles.errorText}>(required)</Text>
                      )}
                    </Text>

                    {uploadedFile && (
                      <UploadFileCard
                        file={uploadedFile}
                        onClose={() => {
                          setUploadedFile(null);
                          setDeleteProof(true);
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
        label="ESTABLISHMENT INFORMATION UPDATED SUCCESSFULLY"
        description="Your establishment information has been successfully updated."
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />

      {/* Snackbar for errors */}
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