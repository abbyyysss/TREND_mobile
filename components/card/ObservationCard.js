import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function ObservationCard({ 
  message = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam earum, exercitationem quaerat voluptate voluptatibus ab voluptatum reiciendis similique incidunt quos iure magni quas consequuntur odio totam. Nisi officiis assumenda labore?" 
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Notes and Observations
      </Text>
      <Text style={[styles.message, isDark && styles.messageDark]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#9ca3af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 16,
    color: '#313638',
    marginBottom: 10,
  },
  titleDark: {
    color: '#d5d6d7',
  },
  message: {
    fontSize: 14,
    color: '#313638',
    lineHeight: 20,
  },
  messageDark: {
    color: '#d5d6d7',
  },
});
