import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

const DarkModeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleToggle = () => {
    // Rotate and scale animation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
    
    toggleTheme();
  };
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <TouchableOpacity 
      style={styles.toggleButton}
      onPress={handleToggle}
      accessibilityLabel="Toggle theme mode"
      accessibilityHint="Switches between light and dark theme"
    >
      <Animated.View
        style={{
          transform: [{ rotate }, { scale: scaleAnim }],
        }}
      >
        <Ionicons 
          name={isDark ? 'moon' : 'sunny'} 
          size={28} 
          color={isDark ? '#facc15' : '#fcd34d'} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    padding: 10,
    borderRadius: 20,
  },
});

export default DarkModeToggle;