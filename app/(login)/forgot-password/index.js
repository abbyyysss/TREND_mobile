import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  ScrollView,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = () => {
    setLoading(true);
    // Simulate password reset request
    setTimeout(() => {
      setLoading(false);
      console.log('Password reset requested for:', email);
      router.push('/(login)/forgot-password/check-email');
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.push('/(login)/login');
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title */}
      <LoginTitle style={[styles.title, isDark && styles.titleDark]}>
        FORGOT PASSWORD?
      </LoginTitle>

      {/* Subtitle */}
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Enter your email address to receive a password reset link.
      </Text>

      {/* Email Input */}
      <MainTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Request Button */}
      <DefaultButton
        label="Request Email Link"
        onPress={handleRequestReset}
        loading={loading}
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    marginTop: 50,
    padding: 28,
    flexGrow: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 23,
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  subtitleDark: {
    color: '#CCC',
  },
  requestButton: {
    marginBottom: 24,
    marginTop: 8,
  },
});

export default ForgotPasswordPage;