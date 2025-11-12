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

export default function EstablishmentInformation() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    router.push('/(login)/register/contact-address');
  };

  const handleBack = () => {
    router.push('/(login)');
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
        label="LGU assign AE ID code"
        value={anotherCode}
        onChangeText={setAnotherCode}
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
        label="No. of employees"
        value={numEmployees}
        onChangeText={setNumEmployees}
        keyboardType="numeric"
      />

      <View style={styles.proofSection}>
        <Text style={[styles.proofTitle, isDark && styles.proofTitleDark]}>
          Proof of business
        </Text>
        <Text style={[styles.proofDescription, isDark && styles.proofDescriptionDark]}>
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