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

export default function NotificationModal({ 
  open, 
  onClose, 
  label, 
  description 
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#d1d5db' : '#111827';
  const borderColor = '#DADADA';
  
  const isMdUp = width >= 768;
  const fontSize = isMdUp ? 15 : 13;
  const gap = isMdUp ? 30 : 20;
  const horizontalPadding = isMdUp ? 40 : 20;
  const buttonPaddingX = isMdUp ? 40 : 30;

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
            <Text style={[styles.description, { color: textColor }]}>
              {description}
            </Text>

            {/* Button */}
            <View style={{ paddingHorizontal: buttonPaddingX }}>
              <DefaultButton
                label="Okay"
                onPress={onClose}
                fullWidth={false}
                fontSize={fontSize}
              />
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
    fontSize: 15,
    lineHeight: 22,
  },
});