import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { requestPasswordReset } from '@/services/AuthService';

export default function CheckEmailPage() {
  const router = useRouter();
  const { colors, fonts, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleResendLink = async () => {
    try {
      // Get the email from AsyncStorage
      const email = await AsyncStorage.getItem('reset_email');
      
      if (!email) {
        Alert.alert(
          'Warning',
          'No email found. Please go back and enter your email again.',
          [{ text: 'OK' }]
        );
        return;
      }

      setLoading(true);
      const res = await requestPasswordReset(email);
      
      Alert.alert(
        'Success',
        res.detail || 'Reset link resent successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert(
        'Error',
        'Failed to resend. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <MaterialIcons 
          name="mark-email-unread" 
          size={80} 
          color={colors.text} 
          style={styles.emailIcon} 
        />
        
        <View style={styles.textSection}>
          <LoginTitle style={styles.title}>
            CHECK YOUR EMAIL
          </LoginTitle>
          <LoginDescription 
            style={{ color: colors.textSecondary }}
            text="We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam or junk folder."
          />
        </View>

        <View style={styles.resendSection}>
          <Text style={[styles.resendText, { color: colors.textSecondary, fontFamily: fonts.gotham }]}>
            Didn't receive the email?
          </Text>
          <TouchableOpacity 
            onPress={handleResendLink}
            disabled={loading}
          >
            <Text style={[
              styles.resendLink, 
              { color: colors.primary }, 
              { fontFamily: fonts.gotham },
              loading && { opacity: 0.5 }
            ]}>
              {loading ? 'Resending...' : 'Resend link'}
            </Text>
          </TouchableOpacity>
        </View>

        <BackButton
          onPress={handleBackToLogin}
          label="Back to Login"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    marginTop: 10,
    padding: 28,
    flexGrow: 1,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  emailIcon: {
    marginBottom: 20,
  },
  textSection: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 8,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    marginBottom: 4,
  },
  resendLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});