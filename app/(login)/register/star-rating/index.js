import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import MainSelectInput from '@/components/input/MainSelectInput';
import MainDateInput from '@/components/input/MainDateInput';
import RegisterCheckInput from '@/components/input/RegisterCheckInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';

export default function StarRating() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, updateFormData, formErrors, setErrors, clearErrors } = useAERegistration();

  const ratingOptions = [
    { value: '1', label: '⭐' },
    { value: '2', label: '⭐⭐' },
    { value: '3', label: '⭐⭐⭐' },
    { value: '4', label: '⭐⭐⭐⭐' },
    { value: '5', label: '⭐⭐⭐⭐⭐' },
  ];

  const handleStarRatingToggle = (checked) => {
    updateFormData({
      is_star_rated: checked,
      ...(checked
        ? {}
        : {
            star_rating: '',
            star_rating_expiry: '',
            star_rating_certificate: null,
          }),
    });
    setErrors({});
  };

   const handleUploadFile = async () => {
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
                    name: result.assets[0].fileName || 'star-rating-certificate.jpg',
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

  const handleNext = () => {
    const newErrors = {};

    if (formData.is_star_rated) {
      if (!formData.star_rating?.trim())
        newErrors.star_rating = 'Star rating is required';
      if (!formData.star_rating_expiry?.trim())
        newErrors.star_rating_expiry = 'Expiry date is required';
      if (!formData.star_rating_certificate)
        newErrors.star_rating_certificate = 'Certificate file is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      clearErrors();
      router.push('/register/reporting-mode');
    }
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    container: {
      padding: 20,
      gap: 15,
    },
    heading: {
      fontSize: 18,
      fontWeight: '600',
      color: formErrors.star_rating_certificate ? '#dc2626' : colors.text,
      fontFamily: fonts.gotham,
    },
    requiredText: {
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
        text="Is your establishment officially star rated?" 
        value={formData.is_star_rated || false}
        onChange={handleStarRatingToggle}
      />
      
      {formData.is_star_rated && (
        <>
          <MainSelectInput 
            label="Select star rating"
            value={formData.star_rating || ''}
            onChange={(value) => updateFormData({ star_rating: value })}
            options={ratingOptions}
            variant="standard"
            error={!!formErrors.star_rating}
            helperText={formErrors.star_rating}
          />
          
          <MainDateInput 
            label="Expiry date"
            variant="standard"
            value={formData.star_rating_expiry || ''}
            onChange={(value) => updateFormData({ star_rating_expiry: value })}
            error={!!formErrors.star_rating_expiry}
            helperText={formErrors.star_rating_expiry}
          />
          
          <Text style={styles.heading}>
            Upload star rating certificate{' '}
            {formErrors.star_rating_certificate && (
              <Text style={styles.requiredText}>(required)</Text>
            )}
          </Text>
          
          <UploadButton 
            label="Click to upload or drag and drop."
            onPress={handleUploadFile}
            isFile={true}
            withHelperText={true}
          />

          {formData.star_rating_certificate && (
            <UploadFileCard 
              file={formData.star_rating_certificate} 
              onClose={() => updateFormData({ star_rating_certificate: null })} 
            />
          )}
        </>
      )}
      
      <DefaultButton 
        onPress={handleNext}
        label="Next" 
      />
      
      <BackButton 
        onPress={() => router.push('/register/accreditation')}
        label="Back"
        hasBg={true}
        hasPadding={true}
      />
      
      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
        isArrow={false}
      />
    </ScrollView>
  );
}