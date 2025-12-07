// FileCard.js - React Native (Auto-width based on filename)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function FileCard({ 
  fileName, 
  fileSize, 
  fileType,
  fileUrl,
  onView
}) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();

  const handleView = () => {
    if (onView && fileUrl && fileName !== 'N/A') {
      onView();
    }
  };

  // Truncate filename if too long (keep extension visible)
  const truncateFileName = (name, maxLength = 30) => {
    if (!name || name === 'N/A' || name.length <= maxLength) return name;
    
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    
    return `${truncatedName}...${extension}`;
  };

  const isDisabled = !fileUrl || fileName === 'N/A';

  // Get file icon based on type
  const getFileIcon = () => {
    if (!fileType) return 'file-pdf-box';
    
    if (fileType.includes('pdf')) return 'file-pdf-box';
    if (fileType.includes('image')) return 'file-image';
    if (fileType.includes('word') || fileType.includes('document')) return 'file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'file-excel';
    return 'file-pdf-box';
  };

  const displayName = truncateFileName(fileName);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'flex-start', // Makes container width fit content
      borderWidth: 1,
      borderColor: '#9CA3AF',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: radius.sm,
      paddingHorizontal: 15,
      paddingVertical: 10,
      shadowColor: '#9CA3AF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
      minHeight: 56,
      maxWidth: '100%', // Prevents overflow
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 8,
      flexShrink: 1, // Allows content to shrink if needed
    },
    iconWrapper: {
      width: 28,
      height: 28,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    textContainer: {
      justifyContent: 'center',
      flexShrink: 1, // Allows text to shrink if needed
    },
    fileName: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
      fontFamily: fonts.gotham,
      lineHeight: 16,
    },
    fileSize: {
      fontSize: 10,
      color: isDark ? '#9CA3AF' : '#6B7280',
      fontFamily: fonts.gotham,
      marginTop: 2,
      lineHeight: 14,
    },
    viewButton: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(239, 246, 255, 0.5)',
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginLeft: 8,
    },
    viewButtonDisabled: {
      opacity: 0.5,
      backgroundColor: 'transparent',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons 
            name={getFileIcon()} 
            size={24} 
            color="#E5252A" 
          />
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={styles.fileName}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {displayName}
          </Text>
          <Text style={styles.fileSize} numberOfLines={1}>
            {fileSize}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={handleView}
        disabled={isDisabled}
        style={[
          styles.viewButton,
          isDisabled && styles.viewButtonDisabled
        ]}
        activeOpacity={0.7}
      >
        <Feather 
          name="eye" 
          size={18} 
          color={isDisabled ? '#999999' : (isDark ? '#60A5FA' : '#2563EB')} 
        />
      </TouchableOpacity>
    </View>
  );
}