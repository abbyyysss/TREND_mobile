import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UploadFileCard({ file, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-outline" size={24} color="#8BC340" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, isDark && styles.fileNameDark]} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={[styles.fileSize, isDark && styles.fileSizeDark]}>
          {formatFileSize(file.size)}
        </Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  iconContainer: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: 2,
  },
  fileNameDark: {
    color: '#d2d2d2',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  fileSizeDark: {
    color: '#888',
  },
  closeButton: {
    padding: 4,
  },
});