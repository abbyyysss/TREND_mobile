import { useState } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/assets/theme/ThemeContext';
import SecondaryModalHeader from '@/components/header/SecondaryModalHeader';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
import { updateCurrentUser } from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';

export default function UploadPhotoModal({ open, onClose, label, description }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { setUser } = useAuth();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [snack, setSnack] = useState(null);

  const labelDesc = `UPLOAD ${label}`;

  const handleClickUploadArea = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setSnack({ 
          message: 'Permission to access gallery is required!', 
          severity: 'error' 
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Convert to File object for FormData
        const file = {
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
        };
        setUploadedFile(file);
      }
    } catch (err) {
      console.error('❌ Image picker error:', err);
      setSnack({ 
        message: 'Failed to pick image. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleSave = async () => {
    if (!uploadedFile) {
      setSnack({ message: `Please select a ${label.toLowerCase()} to upload.`, severity: 'error' });
      return;
    }

    const formData = new FormData();
    const key = label?.toLowerCase().includes('cover') ? 'cover_photo' : 'profile_photo';
    formData.append(key, uploadedFile);

    try {
      setLoading(true);
      const res = await updateCurrentUser(formData);
      console.log('✅ Photo upload success:', res);

      // Update context with new user data
      setUser((prev) => ({
        ...prev,
        user_profile: res.user_profile,
      }));

      setShowNotificationModal(true);
      setUploadedFile(null);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err);
      setSnack({ message: 'Failed to upload photo. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotifClose = () => {
    setShowNotificationModal(false);
    onClose();
  };

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
      maxWidth: 500,
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
      paddingVertical: 30,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    uploadButtonContainer: {
      width: '100%',
    },
    fileCardContainer: {
      width: '100%',
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      gap: 15,
      paddingHorizontal: 20,
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
              <SecondaryModalHeader onClose={onClose} label={labelDesc} />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                {/* Upload Button */}
                <View style={styles.uploadButtonContainer}>
                  <UploadButton
                    label="Click to upload or drag and drop."
                    onPress={handleClickUploadArea}
                    isPhoto={true}
                    withHelperText={true}
                    styles={{
                      backgroundColor: isDark ? '#1C1C1C' : '#F3F3F3',
                      paddingVertical: 30,
                      paddingHorizontal: 10,
                      width: '100%',
                    }}
                  />
                </View>

                {/* File Card */}
                {uploadedFile && (
                  <View style={styles.fileCardContainer}>
                    <UploadFileCard 
                      file={uploadedFile} 
                      onClose={() => setUploadedFile(null)} 
                    />
                  </View>
                )}

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      label={loading ? 'SAVING...' : 'SAVE CHANGES'}
                      onPress={handleSave}
                      disabled={loading}
                      fontSize={11}
                      paddingVertical={7}
                      paddingHorizontal={10}
                      fullWidth={true}
                    />
                  </View>
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      label="CANCEL"
                      onPress={onClose}
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      <NotificationModal
        open={showNotificationModal}
        onClose={handleNotifClose}
        label={`${label?.toUpperCase() || 'PHOTO'} CHANGE SUCCESSFUL`}
        description={description || 'Your photo has been successfully changed.'}
      />

      {snack && (
        <MainSnackbar
          open={true}
          message={snack.message}
          severity={snack.severity}
          onClose={() => setSnack(null)}
          duration={4000}
        />
      )}
    </>
  );
}