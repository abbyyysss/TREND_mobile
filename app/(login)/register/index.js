import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainPasswordInput from '@/components/input/MainPasswordInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function Register() {
  const router = useRouter();
  const { colors, fonts } = useTheme();

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
      />
      
      <MainPasswordInput
        label="Password"
        variant="standard"
      />
      
      <MainPasswordInput
        label="Re-type Password"
        variant="standard"
      />
      
      <DefaultButton 
        onPress={() => router.push('/register/establishment-information')}
        label="Next"
      />
      
      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
      />
    </View>
  );
}

