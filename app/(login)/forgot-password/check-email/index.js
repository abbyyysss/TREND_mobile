import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';

export default function CheckEmailPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleResendLink = () => {
    console.log('Resending email...');
    router.push('/(login)/forgot-password/change-password');
  };

  const handleBackToLogin = () => {
    router.push('/(login)/login');
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
          color={isDark ? '#FFF' : '#000'} 
          style={styles.emailIcon} 
        />
        
        <View style={styles.textSection}>
          <LoginTitle style={[styles.title, isDark && styles.titleDark]}>
            CHECK YOUR EMAIL
          </LoginTitle>
          <LoginDescription 
            style={[styles.description, isDark && styles.descriptionDark]}
            text="We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam or junk folder."
          />
        </View>

        <View style={styles.resendSection}>
          <Text style={[styles.resendText, isDark && styles.resendTextDark]}>
            Didn't receive the email?
          </Text>
          <TouchableOpacity onPress={handleResendLink}>
            <Text style={styles.resendLink}>Resend link</Text>
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
  titleDark: {
    color: '#FFF',
  },
  description: {
    textAlign: 'center',
    color: '#666',
  },
  descriptionDark: {
    color: '#CCC',
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
  resendTextDark: {
    color: '#999',
  },
  resendLink: {
    fontSize: 14,
    color: '#01ADED',
    textDecorationLine: 'underline',
  },
});