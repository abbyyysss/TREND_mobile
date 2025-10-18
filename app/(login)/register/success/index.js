import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoginTitle from '@/components/text/LoginTitle';
import BackButton from '@/components/button/BackButton';

export default function RegistrationSuccess() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#8BC340" />
      </View>
      
      <View style={styles.textContainer}>
        <LoginTitle 
          text="REGISTRATION COMPLETE!" 
          textPos="center"
        />
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Thank you for registering. We will email you once your registration is approved.
        </Text>
      </View>
      
      <BackButton 
        onPress={() => router.push('/login')} 
        label="Back to Login" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 25,
  },
  textContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 30,
  },
  description: {
    color: '#313638',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  descriptionDark: {
    color: '#d5d6d7',
  },
});