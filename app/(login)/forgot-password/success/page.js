import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image,
  Text,
  StatusBar,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import LoginTitle from '@/components/text/LoginTitle';
import LoginDescription from '@/components/text/LoginDescription';
import BackButton from '@/components/button/BackButton';

export default function PasswordSuccessPage() {
  const router = useRouter();

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
              <View style={styles.imageContainer}>
                <Image
                  source={require('@/public/assets/images/LoginPage/pw-success.webp')}
                  style={styles.successImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.textSection}>
                <LoginTitle style={styles.title}>PASSWORD UPDATED!</LoginTitle>
                <LoginDescription style={styles.description}
                   text="You can now log in with your new password.">
                </LoginDescription>
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
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});
