import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import MainTextInput from '@/components/input/MainTextInput';
import MainSelectInput from '@/components/input/MainSelectInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import LoginTitle from '@/components/text/LoginTitle';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function EstablishmentInformation() {
  const router = useRouter();
  const { colors, fonts } = useTheme();

  const [lguCode, setLguCode] = useState('');
  const [anotherCode, setAnotherCode] = useState('');
  const [type, setType] = useState('');
  const [numRooms, setNumRooms] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const typeOptions = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'municipal-office', label: 'Municipal Office' },
    { value: 'provincial-office', label: 'Provincial Office' },
    { value: 'regional-office', label: 'Regional Office' },
  ];

  const handleNext = () => {
    router.push('/register/contact-address');
  };

  const handleBack = () => {
    router.push('/login');
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      <MainTextInput 
        label="LGU assign AE ID code"
        value={lguCode}
        onChangeText={setLguCode}
      />

      <MainTextInput 
          label="Establishment Name"
          value={lguCode}
          onChangeText={setLguCode}
        />

      <MainTextInput 
          label="Business Name"
          value={lguCode}
          onChangeText={setLguCode}
        />

      <MainSelectInput 
        label="Type of accommodation"
        value={type}
        onChange={setType}
        options={typeOptions}
      />

      <MainTextInput 
        label="No. of rooms"
        value={numRooms}
        onChangeText={setNumRooms}
        keyboardType="numeric"
      />

      <MainTextInput 
        label="No. of male employees"
        value={numEmployees}
        onChangeText={setNumEmployees}
        keyboardType="numeric"
      />

      <MainTextInput 
        label="No. of female employees"
        value={numEmployees}
        onChangeText={setNumEmployees}
        keyboardType="numeric"
      />

      <View style={styles.proofSection}>
        <Text style={[styles.proofTitle, { color: colors.text, fontFamily: fonts.gotham }]}>
          Proof of business
        </Text>
        <Text style={[styles.proofDescription,{ color: colors.textSecondary, fontFamily: fonts.gotham }]}>
          DTI permit, SEC registration, LGU permits, Mayor's permit. Either one of those options are valid. Only one document should be submitted
        </Text>
      </View>

      <UploadButton 
        label="Click to upload or drag and drop."
        onFileSelect={handleFileSelect}
        accept="image/*"
        isFile={true}
        withHelperText={true}
      />

      {uploadedFile && (
        <UploadFileCard 
          file={uploadedFile} 
          onClose={() => setUploadedFile(null)} 
        />
      )}

      <DefaultButton 
        onPress={handleNext}
        label="Next" 
        style={styles.nextButton}
      />

      <BackButton 
        onPress={handleBack}
        label="Back"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 28,
    flexGrow: 1,
    gap: 15,
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFF',
  },
  proofSection: {
    marginBottom: 8,
  },
  proofTitle: {
    color: '#1e1e1e',
    fontSize: 18,
    marginBottom: 4,
  },
  proofTitleDark: {
    color: '#d2d2d2',
  },
  proofDescription: {
    color: '#828282',
    fontSize: 14,
    lineHeight: 20,
  },
  proofDescriptionDark: {
    color: '#999',
  },
  nextButton: {
    marginTop: 8,
  },
});