// ProfileNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';

export default function ProfileNav({ myId, role }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
              isActive && styles.navItemActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navText,
                isDark && styles.navTextDark,
                isActive && styles.navTextActive,
              ]}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.navBorder,
                isActive && styles.navBorderActive,
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
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    marginTop: 5,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#313638',
  },
  navTextDark: {
    color: '#D5D6D7',
  },
  navTextActive: {
    color: '#D4AF37',
  },
  navBorder: {
    height: 3,
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  navBorderActive: {
    backgroundColor: '#D4AF37',
  },
});