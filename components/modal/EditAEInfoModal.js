import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { extractFileInfo } from '@/utils/extractFileInfo';
import { BASE_URL } from '@/services/Constants';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';
import NotificationModal from './NotificationModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from '@/context/AuthContext';
import { updateCurrentUser } from '@/services/AuthService';

export default function EditAEInfoModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser } = useAuth();

  const profile = user?.user_profile || {};

  // ✅ States
  const [idCode, setIdCode] = useState(profile.id_code || '');
  const [aeName, setAEName] = useState(profile.establishment_name || '');
  const [businessName, setBusinessName] = useState(profile.business_name || '');
  const [type, setType] = useState(profile.type || 'APARTMENT');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [deleteProof, setDeleteProof] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ Snackbar setup
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
      if (!profile?.proof_of_business) return;

      try {
        const fileUrl = `${BASE_URL}${profile.proof_of_business}`;
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
        console.error('❌ Failed to load existing proof of business:', err);
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
    if (!aeName.trim()) newErrors.aeName = 'Establishment name is required.';
    if (!businessName.trim()) newErrors.businessName = 'Business name is required.';

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

      formData.append('id_code', idCode);
      formData.append('establishment_name', aeName);
      formData.append('business_name', businessName);
      formData.append('type', type);
      if (uploadedFile) {
        formData.append('proof_of_business', uploadedFile);
      } else if (deleteProof) {
        formData.append('proof_of_business', '');
      }

      console.log('🧾 AE update payload:', Object.fromEntries(formData.entries()));

      const res = await updateCurrentUser(formData);
      console.log('✅ AE info update success:', res);

      setUser((prev) => ({
        ...prev,
        user_profile: res.user_profile,
      }));

      setShowSuccessModal(true);
      setDeleteProof(false);
    } catch (error) {
      const errData = error.response?.data;
      console.error('❌ AE info update failed:', errData || error);

      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
        });
      } else {
        showSnackbar('Failed to update AE information. Please try again.', 'error');
      }

      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => onClose();

  const typeOptions = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESORT', label: 'Resort' },
    { value: 'INN', label: 'Inn' },
    { value: 'BED_AND_BREAKFAST', label: 'Bed & Breakfast' },
  ];

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
              <PrimaryModalHeader onClose={onClose} label="Edit Establishment Info" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <Text style={styles.title}>Establishment Information</Text>

                <View style={styles.formContainer}>
                  {/* LGU Assigned ID Code */}
                  <MainTextInput
                    label="LGU Assigned ID Code"
                    variant="outlined"
                    type="text"
                    value={idCode}
                    onChange={setIdCode}
                    size="small"
                    shrink={true}
                    error={Boolean(errors.idCode)}
                    helperText={errors.idCode || ''}
                  />

                  {/* Establishment Name */}
                  <MainTextInput
                    label="Establishment Name"
                    variant="outlined"
                    type="text"
                    value={aeName}
                    onChange={setAEName}
                    size="small"
                    shrink={true}
                    error={Boolean(errors.aeName)}
                    helperText={errors.aeName || ''}
                  />

                  {/* Business Name */}
                  <MainTextInput
                    label="Business Name"
                    variant="outlined"
                    type="text"
                    value={businessName}
                    onChange={setBusinessName}
                    size="small"
                    shrink={true}
                    error={Boolean(errors.businessName)}
                    helperText={errors.businessName || ''}
                  />

                  {/* Type of Accommodation */}
                  <MainSelectInput
                    label="Type of Accommodation"
                    value={type}
                    size="small"
                    shrink={true}
                    onChange={setType}
                    options={typeOptions}
                    variant="outlined"
                  />

                  {/* File Upload */}
                  <View style={styles.uploadSection}>
                    <Text 
                      style={[
                        styles.uploadTitle,
                        errors.proofOfBusiness ? styles.uploadTitleError : styles.uploadTitleNormal
                      ]}
                    >
                      Proof of Business Certificate{' '}
                      {errors.proofOfBusiness && (
                        <Text style={styles.requiredText}>(required)</Text>
                      )}
                    </Text>

                    {uploadedFile && (
                      <View style={styles.uploadFileContainer}>
                        <UploadFileCard 
                          file={uploadedFile} 
                          onClose={() => {
                            setUploadedFile(null);
                            setDeleteProof(true);
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
          key={currentSnack.id}
          open={true}
          message={currentSnack.message}
          severity={currentSnack.severity}
          onClose={handleCloseSnackbar}
          duration={4000}
        />
      )}

      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />
    </>
  );
}