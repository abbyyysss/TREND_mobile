import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MainSelectInput from '@/components/input/MainSelectInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';

export default function GuestLogSetup() {
  const router = useRouter();
  const [frequency, setFrequency] = useState('');

  const frequencyOptions = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'municipal-office', label: 'Municipal Office' },
    { value: 'provincial-office', label: 'Provincial Office' },
    { value: 'regional-office', label: 'Regional Office' },
  ];

  return (
    <View style={styles.container}>
      <MainSelectInput 
        label="Preferred Logging Frequency"
        value={frequency}
        onChange={setFrequency}
        options={frequencyOptions}
        variant="standard"
        helperText="This setting can be changed later."
      />
      <DefaultButton 
        onPress={() => router.push('/register/finishing-up')}
        title="Submit" 
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

