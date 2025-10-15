import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  StatusBar,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';
import { push } from 'expo-router/build/global-state/routing';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = () => {
    setLoading(true);
    // Simulate password reset request
    setTimeout(() => {
      setLoading(false);
      console.log('Password reset requested for:', email);
      push('/forgot-password/check-email/page');
    }, 2000);
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
        {/* Blur overlay */}
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Sun Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>☀️</Text>
            </View>

            {/* Title */}
            <LoginTitle style={styles.title}>FORGOT PASSWORD?</LoginTitle>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
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
              title="Request Email Link"
              onPress={handleRequestReset}
              loading={loading}
              style={styles.requestButton}
            />

            <BackButton 
                onClick={()=> handleBackToLogin()}
                label="Back to Login"
                />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

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
  title: {
    fontSize: 23,
    marginBottom: 16,
    color: '#000',
    alignText: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  requestButton: {
    marginBottom: 24,
    marginTop: 8,
  },
  backContainer: {
    alignItems: 'center',
  },
  backText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ForgotPasswordPage;