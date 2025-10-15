import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';

const MainTextInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -20],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ['#666', '#000'],
    }),
    fontWeight: '500',
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ''}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    paddingTop: 20,
    position: 'relative',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    color: '#000',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});

export default MainTextInput;