import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function PasswordSuccessPage() {
  const router = useRouter();
  const { colors, fonts, isDark } = useTheme();

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
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/LoginPage/pw-success.webp')}
             style={[
              styles.successImage,
              isDark && { tintColor: colors.text }
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection}>
          <LoginTitle style={styles.title}>
            PASSWORD UPDATED!
          </LoginTitle>
          <LoginDescription 
            style={{ color: colors.textSecondary }}
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
    marginBottom: 8,
  },
});