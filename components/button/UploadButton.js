import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function UploadButton({
  label,
  onFileSelect,
  isFile = false,
  isPhoto = false,
  withHelperText = false,
  accept = 'all', // 'image', 'pdf', 'all'
  style,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    text: isDark ? '#d2d2d2' : '#1e1e1e',
    border: isDark ? '#fff' : '#000',
    hoverBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  const handlePress = async () => {
    try {
      if (isPhoto) {
        // Request camera roll permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
          const file = result.assets[0];
          onFileSelect?.({
            uri: file.uri,
            name: file.fileName || `photo_${Date.now()}.jpg`,
            type: file.type || 'image/jpeg',
            size: file.fileSize,
          });
        }
      } else {
        // Document picker for files
        let documentTypes = ['*/*'];
        
        if (accept === 'pdf') {
          documentTypes = ['application/pdf'];
        } else if (accept === 'image') {
          documentTypes = ['image/*'];
        } else if (accept !== 'all') {
          // Custom accept types
          documentTypes = accept.split(',').map(t => t.trim());
        }

        const result = await DocumentPicker.getDocumentAsync({
          type: documentTypes,
          copyToCacheDirectory: true,
        });

        if (result.type === 'success' || result.assets?.[0]) {
          const file = result.assets?.[0] || result;
          onFileSelect?.({
            uri: file.uri,
            name: file.name,
            type: file.mimeType || file.type,
            size: file.size,
          });
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
      alert('Failed to pick file. Please try again.');
    }
  };

  const iconName = isFile ? 'cloud-upload-outline' : 'cloud-upload';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: colors.border },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name={iconName} size={60} color={colors.text} />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {withHelperText && (
        <Text style={[styles.helperText, { color: colors.text }]}>
          PDF, JPG, PNG
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F3',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    gap: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'System',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'System',
  },
});