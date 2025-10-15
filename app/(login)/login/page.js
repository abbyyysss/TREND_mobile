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
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';
import MainPasswordInput from '@/components/input/MainPasswordInput';

const LoginPage = () => {
   const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      console.log('Login attempted with:', { email, password });
      router.push('/(main)/dashboard/page');
    }, 2000);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
     router.push('../forgot-password/page');
  };

  const handleRegister = () => {
    console.log('Register clicked');
    router.push('../register/page');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require('@/public/assets/images/LoginPage/LTP-tiles2.webp')} // Replace with your image path
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
            <LoginTitle style={styles.title}>WELCOME BACK!</LoginTitle>

            {/* Email Input */}
            <MainTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Password Input */}
            <MainPasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="password"
            />

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <DefaultButton
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Not a member?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Register Now</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 32,
    color: '#000',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#333',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#4A9EFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginPage;