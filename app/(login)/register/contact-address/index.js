// app/register/contact-address.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainSelectInput from '@/components/input/MainSelectInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';

export default function ContactAddress() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, updateFormData, formErrors, setErrors, clearErrors } = useAERegistration();
  const [loading, setLoading] = useState(false);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityMuniOptions, setCityMuniOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);

  const REGION_CODE = "070000000"; // Region VII
  const DEFAULT_PROVINCE_CODE = "072200000"; // Cebu province default

  // Load provinces
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (formData.province_code) {
      loadCities(formData.province_code);
    }
  }, [formData.province_code]);

  // Load barangays when city changes
  useEffect(() => {
    if (formData.city_code) {
      loadBarangays(formData.city_code);
    }
  }, [formData.city_code]);

  const loadProvinces = async () => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT/locations/provinces?region_code=${REGION_CODE}`);
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to load provinces');

      const mapped = data.map(p => ({ value: p.code, label: p.name }));
      setProvinceOptions(mapped);

      // Restore or set default
      if (formData.province_code) {
        const saved = mapped.find(p => p.value === formData.province_code);
        if (saved) updateFormData({ province: saved.label });
      } else {
        const defaultProv = mapped.find(p => p.value === DEFAULT_PROVINCE_CODE);
        if (defaultProv) {
          updateFormData({
            province: defaultProv.label,
            province_code: defaultProv.value
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load provinces');
      console.error('Failed to load provinces:', error);
    }
  };

  const loadCities = async (provinceCode) => {
    try {
      const response = await fetch(
        `YOUR_API_ENDPOINT/locations/cities?region_code=${REGION_CODE}&province_code=${provinceCode}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to load cities');

      const mapped = data.map(c => ({ value: c.code, label: c.name }));
      setCityMuniOptions(mapped);

      if (formData.city_code) {
        const saved = mapped.find(c => c.value === formData.city_code);
        if (saved) updateFormData({ city_municipality: saved.label });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cities');
      console.error('Failed to load cities:', error);
    }
  };

  const loadBarangays = async (cityCode) => {
    try {
      const response = await fetch(
        `YOUR_API_ENDPOINT/locations/barangays?city_code=${cityCode}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to load barangays');

      const mapped = data.map(b => ({ value: b.code, label: b.name }));
      setBarangayOptions(mapped);

      if (formData.barangay_code) {
        const saved = mapped.find(b => b.value === formData.barangay_code);
        if (saved) updateFormData({ barangay: saved.label });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load barangays');
      console.error('Failed to load barangays:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contact_person?.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }
    if (!formData.contact_num?.trim()) {
      newErrors.contact_num = 'Contact number is required';
    } else if (!/^\d{11}$/.test(formData.contact_num)) {
      newErrors.contact_num = 'Contact number must be 11 digits';
    }
    if (!formData.province_code) {
      newErrors.province = 'Province is required';
    }
    if (!formData.city_code) {
      newErrors.city_municipality = 'City/Municipality is required';
    }
    if (!formData.barangay_code) {
      newErrors.barangay = 'Barangay is required';
    }
    if (!formData.street_address?.trim()) {
      newErrors.street_address = 'Street address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('YOUR_API_ENDPOINT/registration/contact-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${formData.tempToken || ''}`,
        },
        body: JSON.stringify({
          contact_person: formData.contact_person,
          contact_num: formData.contact_num,
          province: formData.province,
          province_code: formData.province_code,
          city_municipality: formData.city_municipality,
          city_code: formData.city_code,
          barangay: formData.barangay,
          barangay_code: formData.barangay_code,
          street_address: formData.street_address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save contact information');
      }

      clearErrors();
      router.push('/register/accreditation');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
      setErrors({ 
        contact_person: error.message || 'Failed to save information'
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 28,
      flexGrow: 1,
      gap: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: fonts.barabara,
      paddingTop: 10,
    },
  });

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Contact information</Text>

      <MainTextInput
        label="Contact person"
        value={formData.contact_person || ''}
        onChangeText={(value) => updateFormData({ contact_person: value })}
        error={!!formErrors.contact_person}
        helperText={formErrors.contact_person}
        editable={!loading}
      />

      <MainTextInput
        label="Contact number"
        value={formData.contact_num || ''}
        onChangeText={(value) => updateFormData({ contact_num: value })}
        keyboardType="numeric"
        error={!!formErrors.contact_num}
        helperText={formErrors.contact_num}
        editable={!loading}
      />

      <Text style={styles.sectionTitle}>Address</Text>

      <MainSelectInput
        label="Province"
        value={formData.province_code || ''}
        options={provinceOptions}
        error={!!formErrors.province}
        helperText={formErrors.province}
        disabled={loading}
        onChange={(code) => {
          const selected = provinceOptions.find(p => p.value === code);
          updateFormData({
            province: selected?.label || '',
            province_code: code,
            city_municipality: '',
            city_code: '',
            barangay: '',
            barangay_code: '',
          });
          setCityMuniOptions([]);
          setBarangayOptions([]);
        }}
      />

      <MainSelectInput
        label="City/Municipality"
        value={formData.city_code || ''}
        options={cityMuniOptions}
        disabled={!formData.province_code || loading}
        error={!!formErrors.city_municipality}
        helperText={formErrors.city_municipality}
        onChange={(code) => {
          const selected = cityMuniOptions.find(c => c.value === code);
          updateFormData({
            city_municipality: selected?.label || '',
            city_code: code,
            barangay: '',
            barangay_code: '',
          });
          setBarangayOptions([]);
        }}
      />

      <MainSelectInput
        label="Barangay"
        value={formData.barangay_code || ''}
        options={barangayOptions}
        disabled={!formData.city_code || loading}
        error={!!formErrors.barangay}
        helperText={formErrors.barangay}
        onChange={(code) => {
          const selected = barangayOptions.find(b => b.value === code);
          updateFormData({
            barangay: selected?.label || '',
            barangay_code: code,
          });
        }}
      />

      <MainTextInput
        label="Street address"
        value={formData.street_address || ''}
        onChangeText={(value) => updateFormData({ street_address: value })}
        error={!!formErrors.street_address}
        helperText={formErrors.street_address}
        editable={!loading}
      />

      <DefaultButton
        onPress={handleNext}
        label={loading ? "Saving..." : "Next"}
        disabled={loading}
      />

      <BackButton
        onPress={() => router.push('/register/establishment-information')}
        label="Back"
        hasBg={true}
        hasPadding={true}
        disabled={loading}
      />

      <BackButton
        onClick={() => router.push('/login')}
        label="Back to Login"
        isArrow={false}
      />
    </ScrollView>
  );
}