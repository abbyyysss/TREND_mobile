import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
// import { extractFileInfo } from '@/utils/extractFileInfo';
// import { BASE_URL } from '@/services/constants';
// import { useAuth } from '@/context/authContext';
// import { updateCurrentUser } from '@/services/authService';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainSelectInput from '../input/MainSelectInput';
import MainDateInput from '../input/MainDateInput';
import DefaultButton from '../button/DefaultButton';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import NotificationModal from './NotificationModal';
import LoadingText from '../loading/LoadingText';
import MainSnackbar from '../snackbar/MainSnackbar';

export default function EditStarRatingModal({ open, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const { user, setUser } = useAuth();
  // const profile = user?.user_profile || {};

  // Mock data for UI testing
  const profile = {
    star_rating: '4',
    star_rating_expiry: '2025-12-31',
    star_rating_certificate: null,
  };

  const [starRating, setStarRating] = useState(profile.star_rating || '');
  const [expiryDate, setExpiryDate] = useState(profile.star_rating_expiry || '');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteStarRating, setDeleteStarRating] = useState(null);

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

  // Load existing file (commented out for UI testing)
  // useEffect(() => {
  //   const loadExistingFile = async () => {
  //     if (!profile?.star_rating_certificate) return;
  //     try {
  //       const fileUrl = `${BASE_URL}${profile.star_rating_certificate}`;
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

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const ratingOptions = [
    { value: '1', label: '1 Star' },
    { value: '2', label: '2 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '5', label: '5 Stars' },
  ];

  const validateInputs = () => {
    const newErrors = {};
    if (!starRating) newErrors.starRating = 'Star rating is required.';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required.';

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    // API call commented out for UI testing
    // try {
    //   setLoading(true);
    //   const formData = new FormData();
    //   formData.append('star_rating', starRating);
    //   formData.append('star_rating_expiry', expiryDate);
    //   if (uploadedFile) {
    //     formData.append('star_rating_certificate', uploadedFile);
    //   } else if (deleteStarRating) {
    //     formData.append('star_rating_certificate', '');
    //   }
    //   const res = await updateCurrentUser(formData);
    //   setUser((prev) => ({
    //     ...prev,
    //     user_profile: res.user_profile,
    //   }));
    //   setShowSuccessModal(true);
    //   setDeleteStarRating(false);
    // } catch (error) {
    //   const errData = error.response?.data;
    //   console.error('❌ Star rating update failed:', errData || error);
    //   const backendErrors = {};
    //   if (errData && typeof errData === 'object') {
    //     Object.entries(errData).forEach(([field, messages]) => {
    //       const msg = Array.isArray(messages) ? messages[0] : String(messages);
    //       backendErrors[field] = msg;
    //       showSnackbar(`${field.replaceAll('_', ' ')}: ${msg}`, 'error');
    //     });
    //   } else {
    //     showSnackbar('Failed to update star rating details. Please try again.', 'error');
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
            <PrimaryModalHeader onClose={onClose} label="Edit Star Rating" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.content}>
                <Text style={styles.title}>Star Rating Details</Text>

                <View style={styles.formContainer}>
                  {/* Star Rating */}
                  <MainSelectInput
                    label="Star Rating"
                    value={starRating}
                    onChange={setStarRating}
                    options={ratingOptions}
                    error={Boolean(errors.starRating)}
                    helperText={errors.starRating || ''}
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
                        errors.starRatingCertificate && styles.errorText,
                      ]}
                    >
                      Star Rating Certificate{' '}
                      {errors.starRatingCertificate && (
                        <Text style={styles.errorText}>(required)</Text>
                      )}
                    </Text>

                    {uploadedFile && (
                      <UploadFileCard
                        file={uploadedFile}
                        onClose={() => {
                          setUploadedFile(null);
                          setDeleteStarRating(true);
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
        label="STAR RATING UPDATED SUCCESSFULLY"
        description="Your star rating has been successfully updated."
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
          // window.location.reload(); // commented out for mobile
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