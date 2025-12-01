import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import SecondaryModalHeader from '@/components/header/SecondaryModalHeader';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from '../modal/NotificationModal';
import UploadButton from '../button/UploadButton';
import UploadFileCard from '../card/UploadFileCard';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
// import { updateCurrentUser } from '@/services/authService';
// import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export function UploadPhotoModal({ open, onClose, label = 'PHOTO', description }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [snack, setSnack] = useState(null);

  const labelDesc = `UPLOAD ${label}`;

  const handleSelectPhoto = () => {
    // In real app, use expo-image-picker
    // const result = await ImagePicker.launchImageLibraryAsync({...});
    setUploadedFile({ name: 'sample-photo.jpg', size: 245678 });
  };

  const handleSave = async () => {
    if (!uploadedFile) {
      setSnack({ message: `Please select a ${label.toLowerCase()} to upload.`, severity: 'error' });
      return;
    }

    // ✅ Simulated success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowNotificationModal(true);
      setUploadedFile(null);
    }, 1500);

    /* 🔒 API CALL - COMMENTED OUT
    const formData = new FormData();
    const key = label?.toLowerCase().includes('cover') ? 'cover_photo' : 'profile_photo';
    formData.append(key, uploadedFile);

    try {
      setLoading(true);
      await updateCurrentUser(formData);
      setShowNotificationModal(true);
      setUploadedFile(null);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err);
      setSnack({ message: 'Failed to upload photo. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
    */
  };

  const handleNotifClose = () => {
    setShowNotificationModal(false);
    onClose();
    // In real app: setTimeout(() => { window.location.reload(); }, 500);
  };

  useEffect(() => {
    if (snack) {
      const timer = setTimeout(() => setSnack(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [snack]);

  return (
    <>
      <Modal visible={open} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{labelDesc}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
            >
              {/* Upload Area */}
              <TouchableOpacity style={styles.uploadArea} onPress={handleSelectPhoto}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
                <Text style={styles.uploadHelper}>PNG, JPG or JPEG (max. 5MB)</Text>
              </TouchableOpacity>

              {/* Uploaded File Card */}
              {uploadedFile && (
                <View style={styles.fileCard}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{uploadedFile.name}</Text>
                    <Text style={styles.fileSize}>
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setUploadedFile(null)}>
                    <Text style={styles.fileRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? 'SAVING...' : 'SAVE CHANGES'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      {showNotificationModal && (
        <Modal visible={showNotificationModal} animationType="fade" transparent={true}>
          <View style={styles.notificationOverlay}>
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>
                {`${label?.toUpperCase() || 'PHOTO'} CHANGE SUCCESSFUL`}
              </Text>
              <Text style={styles.notificationDescription}>
                {description || 'Your photo has been successfully changed.'}
              </Text>
              <TouchableOpacity style={styles.notificationButton} onPress={handleNotifClose}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Snackbar */}
      {snack && (
        <View style={[styles.snackbar, snack.severity === 'error' && styles.snackbarError]}>
          <Text style={styles.snackbarText}>{snack.message}</Text>
          <TouchableOpacity onPress={() => setSnack(null)}>
            <Text style={styles.snackbarClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}