// FileCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function FileCard({ 
  fileName, 
  fileSize, 
  fileType,
  fileUrl,
  onView
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleView = () => {
    if (onView && fileUrl && fileName !== 'N/A') {
      onView();
    }
  };

  // Truncate filename if too long (keep extension visible)
  const truncateFileName = (name, maxLength = 25) => {
    if (!name || name === 'N/A' || name.length <= maxLength) return name;
    
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    
    return `${truncatedName}...${extension}`;
  };

  const isDisabled = !fileUrl || fileName === 'N/A';

  return (
    <View style={[
      styles.container, 
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.leftSection}>
        <MaterialCommunityIcons 
          name="file-pdf-box" 
          size={24} 
          color="#E5252A" 
        />
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.fileName, 
              isDark && styles.fileNameDark
            ]} 
            numberOfLines={1}
          >
            {truncateFileName(fileName)}
          </Text>
          <Text style={[
            styles.fileSize,
            isDark ? styles.fileSizeDark : styles.fileSizeLight
          ]}>
            {fileSize}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={handleView}
        disabled={isDisabled}
        style={[
          styles.viewButton,
          isDark && styles.viewButtonDark,
          isDisabled && styles.viewButtonDisabled
        ]}
        activeOpacity={0.7}
      >
        <Feather 
          name="eye" 
          size={18} 
          color={isDisabled ? '#999' : (isDark ? '#60A5FA' : '#2563EB')} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  fileNameDark: {
    color: '#FFF',
  },
  fileSize: {
    fontSize: 10,
    marginTop: 2,
  },
  fileSizeLight: {
    color: '#6B7280',
  },
  fileSizeDark: {
    color: '#9CA3AF',
  },
  viewButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewButtonDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  viewButtonDisabled: {
    opacity: 0.5,
  },
});