// app/register/index.tsx
import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please re-type your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('YOUR_API_ENDPOINT/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store temporary registration data or token if needed
      // await AsyncStorage.setItem('tempRegToken', data.token);
      
      router.push('/register/establishment-information');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
      padding: 20,
      color: colors.text
    },
  });
  
  return (
    <View style={styles.container}>
      <MainTextInput
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        variant="standard"
        value={email}
        onChangeText={setEmail}
        error={!!errors.email}
        helperText={errors.email}
      />
      
      <MainPasswordInput
        label="Password"
        variant="standard"
        value={password}
        onChangeText={setPassword}
        error={!!errors.password}
        helperText={errors.password}
      />
      
      <MainPasswordInput
        label="Re-type Password"
        variant="standard"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
      
      <DefaultButton 
        onPress={handleNext}
        label={loading ? "Processing..." : "Next"}
        disabled={loading}
      />
      
      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
      />
    </View>
  );
}