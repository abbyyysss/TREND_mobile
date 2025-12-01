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
import SecondaryModalHeader from '..header/SecondaryModalHeader';
import DefaultButton from '../button/DefaultButton';
import MainPasswordInput from '../input/MainPasswordInput';
import NotificationModal from '../modal/NotificationModal';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
import LoadingText from '@/components/loading/LoadingText';
// import { changePassword } from '@/services/authService';

const { width } = Dimensions.get('window');

export default function ChangePasswordModal({ open, onClose }) {
  // 🧠 Form fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🧾 Field errors
  const [errors, setErrors] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Snackbar queue
  const [snackQueue, setSnackQueue] = useState([]);
  const [currentSnack, setCurrentSnack] = useState(null);

  const capitalizeWords = (str) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

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

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!oldPassword.trim()) validationErrors.old_password = 'Old password is required.';
    if (!newPassword.trim()) validationErrors.new_password = 'New password is required.';
    else if (newPassword.length < 8) validationErrors.new_password = 'Must be at least 8 characters.';
    if (!confirmPassword.trim()) validationErrors.confirm_password = 'Please confirm your new password.';
    else if (confirmPassword !== newPassword)
      validationErrors.confirm_password = 'Passwords do not match.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((msg) => showSnackbar(msg, 'error'));
      return;
    }

    setErrors({});
    
    // ✅ Simulated success - API call commented out
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowNotificationModal(true);
    }, 1500);

    /* 🔒 API CALL - COMMENTED OUT
    try {
      setLoading(true);
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      const res = await changePassword(payload);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowNotificationModal(true);
    } catch (err) {
      const errData = err.response?.data;
      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, msg]) => {
          const message = Array.isArray(msg) ? msg[0] : msg;
          backendErrors[field] = message;
          showSnackbar(`${capitalizeWords(field.replaceAll('_', ' '))}: ${message}`, 'error');
        });
      } else {
        showSnackbar('Failed to change password. Please try again.', 'error');
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
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>CHANGE PASSWORD</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Old Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter your old password</Text>
                <View style={[styles.inputWrapper, errors.old_password && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry={!showOldPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                    <Text style={styles.eyeIcon}>{showOldPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.old_password && <Text style={styles.errorText}>{errors.old_password}</Text>}
              </View>

              {/* New Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter your new password</Text>
                <View style={[styles.inputWrapper, errors.new_password && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.new_password && <Text style={styles.errorText}>{errors.new_password}</Text>}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reconfirm new password</Text>
                <View style={[styles.inputWrapper, errors.confirm_password && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password}</Text>}
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                  onPress={handleSubmit}
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
      {showNotificationModal && (
        <Modal visible={showNotificationModal} animationType="fade" transparent={true}>
          <View style={styles.notificationOverlay}>
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>PASSWORD CHANGE SUCCESSFUL</Text>
              <Text style={styles.notificationDescription}>
                Your password has been changed successfully.
              </Text>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => {
                  setShowNotificationModal(false);
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
    </>
  );
}