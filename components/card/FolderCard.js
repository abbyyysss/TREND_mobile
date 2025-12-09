import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function FolderCard({ id, year = 2025 }) {
  const router = useRouter();
  const { colors, fonts } = useTheme();

  const handlePress = () => {
    router.push(`/reports-management/${id}/${year}`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={require('@/assets/images/MainPage/folder.png')}
        style={styles.folderImage}
        resizeMode="contain"
      />
      <Text style={[styles.yearText, { color: colors.text, fontFamily: fonts.gotham }]}>
        {year}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 'auto',
  },
  folderImage: {
    width: 80,
    height: 80,
  },
  yearText: {
    fontSize: 14,
    marginTop: 4,
  },
});