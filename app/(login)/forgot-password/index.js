import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';
import { useTheme } from '@/assets/theme/ThemeContext';
import { requestPasswordReset } from '@/services/AuthService';

const ForgotPassword = () => {
  const router = useRouter();
  const { colors, fonts, isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    // Clear inline error
    setEmailError('');

    // Basic validation
    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await requestPasswordReset(email);

      // Save email in AsyncStorage for use in Check Email page
      await AsyncStorage.setItem('reset_email', email);

      // Show success alert
      Alert.alert(
        'Success',
        res.detail || 'Password reset link sent successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/forgot-password/check-email'),
          },
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      const msg = error.response?.data?.error || 'Something went wrong. Please try again.';
      
      // Show error alert
      Alert.alert('Error', msg);
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
      marginTop: 50,
      padding: 28,
      flexGrow: 1,
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 20,
      fontFamily: fonts.gotham,
      color: colors.textSecondary,
    },
    requestButton: {
      marginBottom: 24,
      marginTop: 8,
    },
  });

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title */}
      <LoginTitle>
        FORGOT PASSWORD?
      </LoginTitle>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter your email address to receive a password reset link.
      </Text>

      {/* Email Input */}
      <MainTextInput
        label="Email"
        value={email}
        onChange={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={emailError}
        helperText={emailError}
      />

      {/* Request Button */}
      <DefaultButton
        label={loading ? 'Sending...' : 'Request Email Link'}
        onPress={handleRequestReset}
        loading={loading}
        disabled={loading}
        style={styles.requestButton}
      />

      {/* Back Button */}
      <BackButton 
        onPress={handleBackToLogin}
        label="Back to Login"
      />
    </ScrollView>
  );
};

export default ForgotPassword;