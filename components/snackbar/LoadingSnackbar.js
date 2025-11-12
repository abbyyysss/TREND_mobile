import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  useColorScheme,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingText from '../loading/LoadingText';

export default function LoadingSnackbar({ open, message = "Processing..." }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#1f2937' : '#f3f4f6';
  const textColor = isDark ? '#e5e7eb' : '#111827';
  const iconColor = '#2196F3'; // info blue color

  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.snackbarContainer}>
          <View style={[styles.snackbar, { backgroundColor }]}>
            <View style={styles.alertContent}>
              <Ionicons 
                name="information-circle" 
                size={24} 
                color={iconColor}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <LoadingText text={message} textColor={textColor} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  snackbarContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  snackbar: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 300,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
});