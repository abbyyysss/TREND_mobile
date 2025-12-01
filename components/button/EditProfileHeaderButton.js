// EditProfileHeaderButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export default function EditProfileHeaderButton({ text, onClick }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[
        styles.headerText,
        isDark && styles.headerTextDark
      ]}>
        {text}
      </Text>
      <TouchableOpacity
        onPress={onClick}
        activeOpacity={0.7}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#313638',
  },
  headerTextDark: {
    color: '#D5D6D7',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#D4AF37',
    fontWeight: '500',
  },
});