import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  ScrollView,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';
import MainPasswordInput from '@/components/input/MainPasswordInput';

const LoginPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      console.log('Login attempted with:', { email, password });
      router.push('/(main)/dashboard');
    }, 2000);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    router.push('../forgot-password');
  };

  const handleRegister = () => {
    console.log('Register clicked');
    router.push('../register');
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <LoginTitle style={[styles.title, isDark && styles.titleDark]}>
        WELCOME BACK!
      </LoginTitle>

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
        <Text style={[styles.forgotPasswordText, isDark && styles.forgotPasswordTextDark]}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <DefaultButton
        label="Log In"
        onPress={handleLogin}
        loading={loading}
        style={styles.loginButton}
      />

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={[styles.registerText, isDark && styles.registerTextDark]}>
          Not a member?
        </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 28,
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 8,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    marginBottom: 32,
    color: '#000',
  },
  titleDark: {
    color: '#FFF',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#333',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  forgotPasswordTextDark: {
    color: '#CCC',
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
  registerTextDark: {
    color: '#999',
  },
  registerLink: {
    color: '#4A9EFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;