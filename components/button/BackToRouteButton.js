import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function BackToRouteButton({ title, route, type = 'button' }) {
  const router = useRouter();
  const { colors, fonts, spacing } = useTheme();

  const handlePress = () => {
    router.push(route);
  };

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.iconButton, { backgroundColor: colors.surface }]}
        activeOpacity={0.6}
      >
        <Ionicons 
          name="arrow-back" 
          size={20} 
          color={colors.text} 
        />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text, fontFamily: fonts.gotham }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
  },
});