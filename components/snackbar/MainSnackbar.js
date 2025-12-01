// MainSnackbar.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function MainSnackbar({
  open,
  message,
  severity = 'info',
  duration = 4000,
  onClose = () => {},
  position = 'bottom-right', // 'top-center', 'bottom-center', 'bottom-right', etc.
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [open]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!open && fadeAnim._value === 0) return null;

  const severityColors = {
    success: isDark ? '#2E7D32' : '#4CAF50',
    error: isDark ? '#C62828' : '#F44336',
    warning: isDark ? '#ED6C02' : '#FF9800',
    info: isDark ? '#0288D1' : '#2196F3',
  };

  const severityIcons = {
    success: 'checkcircle',
    error: 'closecircle',
    warning: 'warning',
    info: 'infocirlce',
  };

  const positionStyles = {
    'top-center': { top: 50, alignSelf: 'center' },
    'top-right': { top: 50, right: 20 },
    'bottom-center': { bottom: 50, alignSelf: 'center' },
    'bottom-right': { bottom: 50, right: 20 },
    'bottom-left': { bottom: 50, left: 20 },
  };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyles[position],
        {
          backgroundColor: severityColors[severity],
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <AntDesign
        name={severityIcons[severity]}
        size={20}
        color="#FFFFFF"
        style={styles.icon}
      />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <AntDesign name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: Dimensions.get('window').width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});