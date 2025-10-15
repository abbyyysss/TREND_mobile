import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  StatusBar,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import BackButton from '@/components/button/BackButton';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/forgot-password/success/page');
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.push('/login/page');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require('@/public/assets/images/LoginPage/LTP-tiles2.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>☀️</Text>
            </View>

            <View style={styles.headerSection}>
              <LoginTitle style={styles.title}>CREATE NEW PASSWORD</LoginTitle>
              <LoginDescription style={styles.description}
                text="Create a new password for your account.">
              </LoginDescription>
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
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    fontSize: 19.5,
    textAlign: 'center',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
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