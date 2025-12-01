import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MainSelectInput from '@/components/input/MainSelectInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ReportingMode() {
  const router = useRouter();
  const { colors, fonts } = useTheme();

  const [frequency, setFrequency] = useState('');

  const frequencyOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  return (
    <View style={styles.container}>
      <MainSelectInput 
        label="Choose your preferred reporting mode"
        value={frequency}
        onChange={setFrequency}
        options={frequencyOptions}
        variant="standard"
        helperText="This setting can be changed later."
      />
      <DefaultButton 
        onPress={() => router.push('/register/finishing-up')}
        label="Submit" 
      />
      <BackButton 
        onPress={() => router.push('/register/star-rating')}
        label="Back"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    padding: 20,
  },
});

