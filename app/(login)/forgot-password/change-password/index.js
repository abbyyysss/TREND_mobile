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
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import BackButton from '@/components/button/BackButton';

export default function ChangePasswordPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/(login)/forgot-password/success');
    }, 1500);
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

      <View style={styles.headerSection}>
        <LoginTitle style={[styles.title, isDark && styles.titleDark]}>
          CREATE NEW PASSWORD
        </LoginTitle>
        <LoginDescription 
          style={[styles.description, isDark && styles.descriptionDark]}
          text="Create a new password for your account."
        />
      </View>

      <View style={styles.inputSection}>
        <MainPasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
        />
        <MainPasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonSection}>
        <DefaultButton
          title="Continue"
          onPress={handleContinue}
          loading={loading}
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 28,
    flexGrow: 1,
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  headerSection: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 20.5,
    textAlign: 'center',
    color: '#000',
    marginBottom: 8,
  },
  titleDark: {
    color: '#FFF',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  descriptionDark: {
    color: '#CCC',
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
});