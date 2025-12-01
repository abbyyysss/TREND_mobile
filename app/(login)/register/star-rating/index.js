import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MainSelectInput from '@/components/input/MainSelectInput';
import MainDateInput from '@/components/input/MainDateInput';
import RegisterCheckInput from '@/components/input/RegisterCheckInput';
import UploadButton from '@/components/button/UploadButton';
import UploadFileCard from '@/components/card/UploadFileCard';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';


export default function StarRating() {
  const router = useRouter();
  const { colors, fonts } = useTheme();

  const [rating, setRating] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isStarRated, setIsStarRated] = useState(false);

  const ratingOptions = [
    { value: '1-star', label: '1 Star' },
    { value: '2-star', label: '2 Stars' },
    { value: '3-star', label: '3 Stars' },
    { value: '4-star', label: '4 Stars' },
    { value: '5-star', label: '5 Stars' },
  ];

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
        name: result.assets[0].fileName || 'star-certificate.jpg',
        type: result.assets[0].type || 'image/jpeg',
        size: result.assets[0].fileSize,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <RegisterCheckInput 
        text="Is your establishment officially star rated?" 
        value={isStarRated}
        onChange={setIsStarRated}
      />
      
      <MainSelectInput 
        label="Select star rating"
        value={rating}
        onChange={setRating}
        options={ratingOptions}
        variant="standard"
      />
      
      <MainDateInput 
        label="Expiry date"
        variant="standard"
        value={expiryDate}
        onChange={setExpiryDate}
      />
      
      <Text style={[styles.heading, {color: colors.text, fontFamily: fonts.gotham}]}>
        Upload star rating certificate
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
        onPress={() => router.push('/register/guest-log-setup')}
        label="Next" 
      />
      
      <BackButton 
        onPress={() => router.push('/register/accreditation')}
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