import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingText = ({ text = 'Loading...', style, textStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" color="#FFF" />
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default LoadingText;