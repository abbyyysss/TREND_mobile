import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';

export default function FinishingUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.text, isDark && styles.textDark]}>
        Click any step number in the progress bar above to go back and check your entries. 
        If everything is correct, click submit.
      </Text>
      <DefaultButton 
        onPress={() => router.push('/register/success')}
        title="Next" 
      />
      <BackButton 
        onPress={() => router.push('/register/guest-log-setup')}
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
  text: {
    textAlign: 'center',
    fontSize: 17,
    color: '#313638',
    lineHeight: 26,
  },
  textDark: {
    color: '#d5d6d7',
  },
});

