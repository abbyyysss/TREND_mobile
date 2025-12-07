import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import SecondaryModalHeader from '@/components/header/SecondaryModalHeader';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ConfirmationModal({
  open,
  onClose,
  label,
  description,
  onConfirm,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
}) {
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const { colors, spacing, typography, radius, isDark } = useTheme();

  const handleSaveChanges = () => {
    // Optionally do validation here
    setOpenNotificationModal(true); // Open the notification modal
  };

  return (
    <>
      <Modal
        visible={open}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#000' : '#fff',
                borderColor: '#DADADA',
                borderRadius: radius.xl,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalInner}>
              {/* Header */}
              <View style={styles.stickyHeader}>
                <SecondaryModalHeader onClose={onClose} label={label} />
              </View>

              {/* Content */}
              <View
                style={[
                  styles.contentContainer,
                  {
                    gap: spacing.lg,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xl,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      color: isDark ? '#d1d5db' : '#111827',
                      fontSize: typography.fontSize.sm,
                    },
                  ]}
                >
                  {description}
                </Text>
                <View style={[styles.buttonRow, { gap: spacing.sm, paddingHorizontal: spacing.md }]}>
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      classProps="text-[13px] md:text-[15px] py-[5px]"
                      label={confirmButtonLabel}
                      onClick={() => {
                        onConfirm(); // <- parent decides what happens here
                        onClose();
                      }}
                    />
                  </View>
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      classProps="text-[13px] md:text-[15px] py-[5px]"
                      label={cancelButtonLabel}
                      onClick={onClose}
                      isRed={true}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalInner: {
    width: '100%',
  },
  stickyHeader: {
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  descriptionText: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: 150,
  },
});