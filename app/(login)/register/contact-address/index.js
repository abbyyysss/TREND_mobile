import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainSelectInput from '@/components/input/MainSelectInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';

export default function ContactAddress() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [contactInfo, setContactInfo] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [cityMuni, setCityMuni] = useState('');
  const [barangay, setBarangay] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const provinceOptions = [
    { value: 'cebu', label: 'Cebu' },
    { value: 'bohol', label: 'Bohol' },
    { value: 'siquijor', label: 'Siquijor' },
    { value: 'negros-oriental', label: 'Negros Oriental' },
  ];

  const cityMuniOptions = [
    { value: 'cebu-city', label: 'Cebu City' },
    { value: 'toledo-city', label: 'Toledo City' },
    { value: 'lapu-lapu', label: 'Lapu-Lapu' },
    { value: 'balamban', label: 'Balamban' },
  ];

  const barangayOptions = [
    { value: 'calamba', label: 'Calamba' },
    { value: 'das', label: 'DAS' },
    { value: 'pajac', label: 'Pajac' },
    { value: 'cantuod', label: 'Cantuod' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MainTextInput
        label="Contact information"
        value={contactInfo}
        onChangeText={setContactInfo}
      />

      <MainTextInput
        label="Contact person"
        value={contactPerson}
        onChangeText={setContactPerson}
      />

      <MainTextInput
        label="Contact number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <MainTextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
      />

      <MainSelectInput
        label="Province"
        value={province}
        onChange={setProvince}
        options={provinceOptions}
      />

      <MainSelectInput
        label="City/Municipality"
        value={cityMuni}
        onChange={setCityMuni}
        options={cityMuniOptions}
      />

      <MainSelectInput
        label="Barangay"
        value={barangay}
        onChange={setBarangay}
        options={barangayOptions}
      />

      <MainTextInput
        label="Street address"
        value={streetAddress}
        onChangeText={setStreetAddress}
      />

      <DefaultButton
        onPress={() => router.push('/register/accreditation')}
        title="Next"
      />

      <BackButton
        onPress={() => router.push('/register/establishment-information')}
        label="Back"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 15,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'System',
  },
});