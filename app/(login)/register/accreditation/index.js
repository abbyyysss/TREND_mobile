import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import MainTextInput from '@/components/input/MainTextInput';
import MainDateInput from '@/components/input/MainDateInput';
import RegisterCheckInput from '@/components/input/RegisterCheckInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';

export default function Accreditation() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [controlNumber, setControlNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAccredited, setIsAccredited] = useState(false);

  const handleUploadFile = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos to upload files.');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedFile({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'certificate.jpg',
        type: result.assets[0].type || 'image/jpeg',
        size: result.assets[0].fileSize,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <RegisterCheckInput 
        text="Is your establishment DOT accredited?" 
        value={isAccredited}
        onChange={setIsAccredited}
      />
      
      <MainTextInput 
        label="Control number"
        variant="standard"
        value={controlNumber}
        onChangeText={setControlNumber}
      />
      
      <MainDateInput 
        label="Expiry date"
        variant="standard"
        value={expiryDate}
        onChange={setExpiryDate}
      />
      
      <Text style={[styles.heading, isDark && styles.headingDark]}>
        Upload accreditation certificate
      </Text>
      
      <UploadButton 
        label="Click to upload or drag and drop."
        onPress={handleUploadFile}
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
        onPress={() => router.push('/register/star-rating')}
        title="Next" 
      />
      
      <BackButton 
        onPress={() => router.push('/register/room-setup')}
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
    padding: 20,
    gap: 15,
  },
  heading: {
    color: '#1e1e1e',
    fontSize: 18,
    fontWeight: '600',
  },
  headingDark: {
    color: '#d2d2d2',
  },
});