// ProfileNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ProfileNav({ myId, role }) {
  const { colors, isDark, typography, spacing, radius } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { id: routeId } = useLocalSearchParams();

  const id = (routeId ?? myId)?.toString();

  if (!id) return null;

  const isAE = role === 'AE';

  const navItems = [
    { label: 'Overview', href: `/profile/${id}` },
    ...(isAE
      ? [{ label: 'Inventory', href: `/profile/${id}/inventory` }]
      : []),
  ];

  const handlePress = (href) => {
    router.push(href);
  };

  return (
    <View style={styles.nav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <TouchableOpacity
            key={item.label}
            onPress={() => handlePress(item.href)}
            style={[
              styles.navItem,
              { paddingHorizontal: spacing.md },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navText,
                {
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.weight.medium,
                  color: isActive ? '#D4AF37' : colors.text,
                },
              ]}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.navBorder,
                {
                  backgroundColor: isActive ? '#D4AF37' : 'transparent',
                  borderRadius: radius.sm,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navItem: {
    paddingTop: 10,
    paddingBottom: 15,
    marginTop: 5,
  },
  navText: {
    // Dynamic styles applied inline
  },
  navBorder: {
    height: 3,
    marginTop: 5,
  },
});