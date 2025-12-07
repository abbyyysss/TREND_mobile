// app/register/establishment-information.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainSelectInput from '@/components/input/MainSelectInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';

export default function EstablishmentInformation() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, updateFormData, formErrors, setErrors, clearErrors } = useAERegistration();
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: 'MABUHAY_ACCOMMODATION', label: 'Mabuhay Accommodation' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESORT', label: 'Resort' },
    { value: 'GUEST_HOUSE', label: 'Guest House' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOSTEL', label: 'Hostel' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.establishment_name?.trim()) {
      newErrors.establishment_name = 'Establishment name is required';
    }
    if (!formData.business_name?.trim()) {
      newErrors.business_name = 'Business name is required';
    }
    if (!formData.type?.trim()) {
      newErrors.type = 'Type is required';
    }
    if (!formData.proof_of_business) {
      newErrors.proof_of_business = 'Proof of business is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const apiFormData = new FormData();
      apiFormData.append('id_code', formData.id_code || '');
      apiFormData.append('establishment_name', formData.establishment_name);
      apiFormData.append('business_name', formData.business_name);
      apiFormData.append('type', formData.type);
      apiFormData.append('total_rooms', formData.total_rooms || 0);
      apiFormData.append('male_employees', formData.male_employees || 0);
      apiFormData.append('female_employees', formData.female_employees || 0);
      
      // Append file
      if (formData.proof_of_business) {
        apiFormData.append('proof_of_business', {
          uri: formData.proof_of_business.uri,
          type: formData.proof_of_business.type || 'image/jpeg',
          name: formData.proof_of_business.name || 'proof_of_business.jpg',
        });
      }

      const response = await fetch('YOUR_API_ENDPOINT/registration/establishment-information', {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData - fetch will set it automatically
          'Authorization': `Bearer ${formData.tempToken || ''}`,
        },
        body: apiFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save establishment information');
      }

      // Update with any response data if needed
      if (data.establishment_id) {
        updateFormData({ establishment_id: data.establishment_id });
      }

      // Default numeric fields to 0 if blank
      updateFormData({
        total_rooms: formData.total_rooms || 0,
        male_employees: formData.male_employees || 0,
        female_employees: formData.female_employees || 0,
      });

      clearErrors();
      router.push('/register/contact-address');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
      setErrors({ 
        establishment_name: error.message || 'Failed to save information'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    updateFormData({ proof_of_business: file });
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    container: {
      padding: 28,
      flexGrow: 1,
      gap: 15,
    },
    proofSection: {
      marginBottom: 8,
    },
    proofTitle: {
      color: colors.text,
      fontSize: 18,
      marginBottom: 4,
      fontFamily: fonts.gotham,
    },
    proofDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: fonts.gotham,
    },
    nextButton: {
      marginTop: 8,
    },
    errorText: {
      color: '#ef4444',
      fontSize: 14,
      marginTop: 4,
      fontFamily: fonts.gotham,
    },
  });

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <MainTextInput 
        label="LGU assign AE ID code"
        value={formData.id_code || ''}
        onChangeText={(value) => updateFormData({ id_code: value })}
        editable={!loading}
      />

      <MainTextInput 
        label="Establishment Name"
        value={formData.establishment_name || ''}
        onChangeText={(value) => updateFormData({ establishment_name: value })}
        error={!!formErrors.establishment_name}
        helperText={formErrors.establishment_name}
        editable={!loading}
      />

      <MainTextInput 
        label="Business Name"
        value={formData.business_name || ''}
        onChangeText={(value) => updateFormData({ business_name: value })}
        error={!!formErrors.business_name}
        helperText={formErrors.business_name}
        editable={!loading}
      />

      <MainSelectInput 
        label="Type of accommodation"
        value={formData.type || ''}
        onChange={(value) => updateFormData({ type: value })}
        options={typeOptions}
        error={!!formErrors.type}
        helperText={formErrors.type}
        disabled={loading}
      />

      <MainTextInput 
        label="No. of rooms"
        value={String(formData.total_rooms ?? 0)}
        onChangeText={(value) => updateFormData({ 
          total_rooms: value === '' ? 0 : Number(value) 
        })}
        keyboardType="numeric"
        editable={!loading}
      />

      <MainTextInput 
        label="No. of male employees"
        value={String(formData.male_employees ?? 0)}
        onChangeText={(value) => updateFormData({ 
          male_employees: value === '' ? 0 : Number(value) 
        })}
        keyboardType="numeric"
        editable={!loading}
      />

      <MainTextInput 
        label="No. of female employees"
        value={String(formData.female_employees ?? 0)}
        onChangeText={(value) => updateFormData({ 
          female_employees: value === '' ? 0 : Number(value) 
        })}
        keyboardType="numeric"
        editable={!loading}
      />

      <View style={styles.proofSection}>
        <Text style={[
          styles.proofTitle,
          formErrors.proof_of_business && { color: '#ef4444' }
        ]}>
          Proof of business
          {formErrors.proof_of_business && ' (required)'}
        </Text>
        <Text style={styles.proofDescription}>
          DTI permit, SEC registration, LGU permits, Mayor's permit. Either one of those options are valid. Only one document should be submitted
        </Text>
      </View>

      <UploadButton 
        label="Click to upload or drag and drop."
        onFileSelect={handleFileSelect}
        accept="image/*"
        isFile={true}
        withHelperText={true}
        disabled={loading}
      />

      {formData.proof_of_business && (
        <UploadFileCard 
          file={formData.proof_of_business} 
          onClose={() => !loading && updateFormData({ proof_of_business: null })} 
        />
      )}

      <DefaultButton 
        onPress={handleNext}
        label={loading ? "Saving..." : "Next"}
        style={styles.nextButton}
        disabled={loading}
      />

      <BackButton
        onPress={() => router.push('/register')}
        label="Back"
        hasBg={true}
        hasPadding={true}
        disabled={loading}
      />

      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
        isArrow={false}
        disabled={loading}
      />
    </ScrollView>
  );
}