import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import MainTextInput from '@/components/input/MainTextInput';
import MainDateInput from '@/components/input/MainDateInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import RegisterCheckInput from '@/components/input/AccreditedCheckInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';

export default function Accreditation() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, updateFormData, formErrors, setErrors, clearErrors } = useAERegistration();

  const handleAccreditationToggle = (isChecked) => {
    updateFormData({
      is_dot_accredited: isChecked,
      // Reset fields if unchecked
      ...(isChecked ? {} : {
        accreditation_control_number: '',
        accreditation_expiry: '',
        accreditation_certificate: null,
      }),
    });
    setErrors({});
  };

  const handleFileSelect = async () => {
    try {
      // First, ask user to choose between image or document
      Alert.alert(
        'Select File Type',
        'Choose the type of file you want to upload',
        [
          {
            text: 'Image',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow access to your photos to upload files.');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              });

              if (!result.canceled && result.assets[0]) {
                updateFormData({
                  accreditation_certificate: {
                    uri: result.assets[0].uri,
                    name: result.assets[0].fileName || 'accreditation-certificate.jpg',
                    type: result.assets[0].type || 'image/jpeg',
                    size: result.assets[0].fileSize,
                  }
                });
              }
            }
          },
          {
            text: 'PDF',
            onPress: async () => {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
              });

              if (result.type === 'success' || !result.canceled) {
                const file = result.assets ? result.assets[0] : result;
                updateFormData({
                  accreditation_certificate: {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/pdf',
                    size: file.size,
                  }
                });
              }
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.is_dot_accredited) {
      if (!formData.accreditation_control_number?.trim()) {
        newErrors.accreditation_control_number = 'Control number is required';
      }
      if (!formData.accreditation_expiry?.trim()) {
        newErrors.accreditation_expiry = 'Expiry date is required';
      }
      if (!formData.accreditation_certificate) {
        newErrors.accreditation_certificate = 'Certificate file is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    clearErrors();
    router.push('/register/star-rating');
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    container: {
      padding: 20,
      gap: 15,
    },
    uploadTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: fonts.gotham,
      color: formErrors.accreditation_certificate ? '#dc2626' : colors.text,
    },
    requiredTag: {
      fontSize: 14,
      color: '#dc2626',
    },
  });

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <RegisterCheckInput
        text="Is your establishment DOT accredited?"
        checked={formData.is_dot_accredited || false}
        onChange={handleAccreditationToggle}
      />

      {formData.is_dot_accredited && (
        <>
          <MainTextInput
            label="Control number"
            value={formData.accreditation_control_number || ''}
            onChangeText={(value) => updateFormData({ accreditation_control_number: value })}
            error={!!formErrors.accreditation_control_number}
            helperText={formErrors.accreditation_control_number}
          />

          <MainDateInput
            label="Expiry date"
            value={formData.accreditation_expiry || ''}
            onChange={(value) => updateFormData({ accreditation_expiry: value })}
            error={!!formErrors.accreditation_expiry}
            helperText={formErrors.accreditation_expiry}
          />

          <Text style={styles.uploadTitle}>
            Upload accreditation certificate{' '}
            {formErrors.accreditation_certificate && (
              <Text style={styles.requiredTag}>(required)</Text>
            )}
          </Text>

          <UploadButton
            label="Click to upload or drag and drop."
            onPress={handleFileSelect}
            isFile={true}
            withHelperText={true}
          />

          {formData.accreditation_certificate && (
            <UploadFileCard
              file={formData.accreditation_certificate}
              onClose={() => updateFormData({ accreditation_certificate: null })}
            />
          )}
        </>
      )}

      <DefaultButton
        onPress={handleNext}
        label="Next"
      />

      <BackButton
        onPress={() => router.push('/register/contact-address')}
        label="Back"
        hasBg={true}
        hasPadding={true}
      />

      <BackButton
        onPress={() => router.push('/login')}
        isArrow={false}
        label="Back to Login"
      />
    </ScrollView>
  );
}