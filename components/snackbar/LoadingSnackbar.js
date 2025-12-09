import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingText from '../loading/LoadingText';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function LoadingSnackbar({ open, message = "Processing..." }) {
  const { colors, isDark, fonts } = useTheme();

  const backgroundColor = isDark ? colors.surface : colors.secondary;
  const textColor = isDark ? colors.text : colors.text;
  const iconColor = colors.primary;

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
                <LoadingText
                  text={message}
                  textColor={textColor}
                  style={{ fontFamily: fonts.gotham }}
                />
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
    elevation: 8,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 12 },
  textContainer: { flex: 1 },
});
