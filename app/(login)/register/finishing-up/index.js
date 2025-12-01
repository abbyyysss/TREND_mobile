import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';


export default function FinishingUp() {
  const router = useRouter();
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text, fontFamily: fonts.gotham }]}>
        Click any step number in the progress bar above to go back and check your entries. 
        If everything is correct, click submit.
      </Text>
      <DefaultButton 
        onPress={() => router.push('/register/success')}
        label="Next" 
      />
      <BackButton 
        onPress={() => router.push('/register/reporting-mode')}
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
    lineHeight: 26,
  },
});

