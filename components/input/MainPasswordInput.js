import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// MainPasswordInput.js
const MainPasswordInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  style,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons 
            name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
            size={24} 
            color="#000" 
          />
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  iconButton: {
    padding: 4,
  },
});

export default MainPasswordInput;