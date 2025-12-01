import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { validateResetToken, confirmPasswordReset } from '@/services/AuthService';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { colors, fonts, isDark } = useTheme();
  const { uidb64, token } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  // Check token validity on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await validateResetToken(uidb64, token);
        if (res.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          Alert.alert('Error', 'Invalid or expired link.');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setTokenValid(false);
        Alert.alert('Error', 'Invalid or expired link.');
      }
    };
    
    if (uidb64 && token) {
      checkToken();
    }
  }, [uidb64, token]);

  const handlePasswordReset = async () => {
    // Reset field errors
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Validation
    if (!newPassword) {
      setNewPasswordError('Please enter your new password.');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        uidb64, 
        token, 
        new_password: newPassword, 
        confirm_new_password: confirmPassword 
      };
      
      const res = await confirmPasswordReset(payload);

      if (res.error) {
        Alert.alert('Error', res.error);
      } else {
        Alert.alert(
          'Success',
          'Password updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/forgot-password/success'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to reset password.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    container: {
      padding: 28,
      flexGrow: 1,
    },
    headerSection: {
      width: '100%',
      marginBottom: 20,
    },
    title: {
      fontSize: 20.5,
      textAlign: 'center',
      marginBottom: 8,
    },
    inputSection: {
      width: '100%',
      gap: 20,
      marginBottom: 40,
    },
    buttonSection: {
      width: '100%',
      gap: 20,
    },
    continueButton: {
      marginBottom: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 14,
      fontFamily: fonts.gotham,
      color: colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: fonts.gotham,
      color: colors.error || '#ef4444',
      marginBottom: 20,
    },
  });

  // Show loading while validating token
  if (tokenValid === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Validating link...</Text>
      </View>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          This password reset link is invalid or has expired.
        </Text>
        <BackButton
          onPress={handleBackToLogin}
          label="Back to Login"
        />
      </View>
    );
  }

  // Show password reset form if token is valid
  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerSection}>
        <LoginTitle style={styles.title}>
          CREATE NEW PASSWORD
        </LoginTitle>
        <LoginDescription 
          style={{ color: colors.textSecondary, fontFamily: fonts.gotham }}
          text="Create a new password for your account."
        />
      </View>

      <View style={styles.inputSection}>
        <MainPasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          error={newPasswordError}
          helperText={newPasswordError}
        />
        <MainPasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          error={confirmPasswordError}
          helperText={confirmPasswordError}
        />
      </View>

      <View style={styles.buttonSection}>
        <DefaultButton
          label={loading ? 'Processing...' : 'Continue'}
          onPress={handlePasswordReset}
          loading={loading}
          disabled={loading}
          style={styles.continueButton}
        />
        <BackButton
          onPress={handleBackToLogin}
          label="Back to Login"
        />
      </View>
    </ScrollView>
  );
}