import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image,
  Text,
  ScrollView,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';

export default function PasswordSuccessPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/LoginPage/pw-success.webp')}
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection}>
          <LoginTitle style={[styles.title, isDark && styles.titleDark]}>
            PASSWORD UPDATED!
          </LoginTitle>
          <LoginDescription 
            style={[styles.description, isDark && styles.descriptionDark]}
            text="You can now log in with your new password."
          />
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
    marginTop: 50,
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
  imageContainer: {
    marginBottom: 25,
  },
  successImage: {
    width: 100,
    height: 100,
  },
  textSection: {
    width: '100%',
    marginBottom: 40,
  },
  title: {
    fontSize: 23,
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
    color: '#666',
  },
  descriptionDark: {
    color: '#CCC',
  },
});