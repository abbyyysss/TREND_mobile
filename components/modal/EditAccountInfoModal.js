import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';

// Import your custom components
// import PrimaryModalHeader from '../header/PrimaryModalHeader';
// import MainTextInput from '../input/MainTextInput';
// import DisabledPasswordInput from '../input/DisabledPasswordInput';
// import DefaultButton from '../button/DefaultButton';
// import MainSnackbar from '../snackbar/MainSnackbar';
// import LoadingText from '../loading/LoadingText';
// import ChangePasswordModal from './ChangePasswordModal';
// import NotificationModal from '../modal/NotificationModal';
// import { useAuth } from '@/context/authContext';
// import { updateCurrentUser } from '@/services/authService';

const { width } = Dimensions.get('window');

export function EditAccountInfoModal({ open, onClose }) {
  // const { user, setUser } = useAuth(); // Commented out
  
  const [email, setEmail] = useState('user@example.com'); // Mock data
  const [password] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({ email: '' });
  
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
      setTimeout(() => setCurrentSnack(null), 4000);
    }
  }, [snackQueue, currentSnack]);

  const validateInputs = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email address.';

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    // ✅ Simulated success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500);

    /* 🔒 API CALL - COMMENTED OUT
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      const res = await updateCurrentUser(formData);
      setUser((prev) => ({ ...prev, user_profile: res.user_profile }));
      setShowSuccessModal(true);
    } catch (error) {
      const errData = error.response?.data;
      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${msg}`, 'error');
        });
      } else {
        showSnackbar('Failed to update email. Please try again.', 'error');
      }
      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <>
      <Modal visible={open} animationType="slide" transparent={true} onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContainer, styles.editAccountContainer]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Edit Account Info</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionTitle}>Account Information</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.inputWrapper, styles.textInputFull, errors.email && styles.inputError]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password (Disabled) */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.disabledInputWrapper}>
                  <Text style={styles.disabledInputText}>{password}</Text>
                  <TouchableOpacity onPress={() => setOpenChangePasswordModal(true)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                  onPress={handleSaveChanges}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? 'SAVING...' : 'SAVE CHANGES'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal visible={showSuccessModal} animationType="fade" transparent={true}>
          <View style={styles.notificationOverlay}>
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>ACCOUNT UPDATED SUCCESSFULLY</Text>
              <Text style={styles.notificationDescription}>
                Your account information has been successfully updated.
              </Text>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Snackbar */}
      {currentSnack && (
        <View style={[styles.snackbar, currentSnack.severity === 'error' && styles.snackbarError]}>
          <Text style={styles.snackbarText}>{currentSnack.message}</Text>
          <TouchableOpacity onPress={() => setCurrentSnack(null)}>
            <Text style={styles.snackbarClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />
    </>
  );
}
