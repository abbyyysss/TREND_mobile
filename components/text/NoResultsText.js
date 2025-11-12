import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoResultsText({ text = "No results found.", isGap = true }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container,
      isGap && styles.containerWithGap
    ]}>
      <Ionicons 
        name="file-tray-outline" 
        size={48} 
        color={isDark ? '#D5D6D7' : '#313638'} 
      />
      <Text style={[
        styles.text,
        { color: isDark ? '#D5D6D7' : '#313638' }
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithGap: {
    paddingVertical: 40,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});