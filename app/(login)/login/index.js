import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import LoginTitle from '@/components/text/LoginTitle';
import MainTextInput from '@/components/input/MainTextInput';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setServerError(null);

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { ok, data } = await login(email, password);

      if (ok) {
        // Login successful, router will be handled by auth state change
        router.replace('/dashboard');
      } else {
        // Login failed, show error
        setServerError(data?.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 28,
      backgroundColor: colors.background,
    },
    title: {
      marginBottom: 32,
      color: colors.text,
    },
    inputContainer: {
      marginBottom: 16,
    },
    errorText: {
      color: colors.error || '#ef4444',
      fontSize: 14,
      fontFamily: fonts.gotham,
      marginTop: 8,
      marginBottom: 16,
    },
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
      marginBottom: 32,
      marginTop: 8,
    },
    forgotPasswordText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontFamily: fonts.gotham,
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
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
      fontSize: 14,
    },
    registerLink: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: fonts.gotham,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });

  return (
    <View style={styles.container}>
      {/* Title */}
      <LoginTitle style={styles.title}>
        WELCOME BACK!
      </LoginTitle>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <MainTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!loading}
        />
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MainPasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="password"
          editable={!loading}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      {/* Server Error Message */}
      {serverError && (
        <Text style={styles.errorText}>{serverError}</Text>
      )}

      {/* Forgot Password */}
      <TouchableOpacity 
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.forgotPasswordText}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <DefaultButton
        label={loading ? "Logging in..." : "Log In"}
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.loginButton}
      />

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Not a member?
        </Text>
        <TouchableOpacity onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerLink}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;