import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';

export default function CheckEmailPage() {
  const router = useRouter();

  const handleResendLink = () => {
    console.log('Resending email...');
    router.push('/forgot-password/change-password/page');
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

            <View style={styles.contentContainer}>
              <MaterialIcons name="mark-email-unread" size={80} color="#000" style={styles.emailIcon} />
              
              <View style={styles.textSection}>
                <LoginTitle style={styles.title}>CHECK YOUR EMAIL</LoginTitle>
                <LoginDescription style={styles.description}
                  text="We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam or junk folder.">
                </LoginDescription>
              </View>

              <View style={styles.resendSection}>
                <Text style={styles.resendText}>Didn't receive the email?</Text>
                <TouchableOpacity onPress={handleResendLink}>
                  <Text style={styles.resendLink} >Resend link</Text>
                </TouchableOpacity>
              </View>

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
    color: '#000',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  resendLink: {
    fontSize: 14,
    color: '#01ADED',
    textDecorationLine: 'underline',
  },
});