import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import SecondaryModalHeader from '@/components/header/SecondaryModalHeader';
import DefaultButton from '../button/DefaultButton';

export default function ConfirmationModal({ 
  open, 
  onClose, 
  label, 
  description, 
  onConfirm, 
  confirmButtonLabel = "Confirm", 
  cancelButtonLabel = "Cancel" 
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#d1d5db' : '#111827';
  const borderColor = '#DADADA';
  
  const isMdUp = width >= 768;
  const fontSize = isMdUp ? 17 : 15;
  const gap = isMdUp ? 30 : 20;
  const buttonGap = isMdUp ? 20 : 10;
  const horizontalPadding = isMdUp ? 20 : 5;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer,
          { 
            backgroundColor,
            borderColor,
          }
        ]}>
          {/* Header */}
          <SecondaryModalHeader onClose={onClose} label={label} />

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[
              styles.contentContainer,
              { 
                gap,
                paddingHorizontal: horizontalPadding,
              }
            ]}
          >
            <Text style={[styles.description, { color: textColor, fontSize }]}>
              {description}
            </Text>

            {/* Buttons */}
            <View style={[styles.buttonContainer, { gap: buttonGap }]}>
              <View style={styles.buttonWrapper}>
                <DefaultButton
                  label={confirmButtonLabel}
                  onPress={handleConfirm}
                  fontSize={fontSize}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <DefaultButton
                  label={cancelButtonLabel}
                  onPress={onClose}
                  isRed
                  fontSize={fontSize}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  scrollView: {
    maxHeight: '80%',
  },
  contentContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: 200,
  },
});