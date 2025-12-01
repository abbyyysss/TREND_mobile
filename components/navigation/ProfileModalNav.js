// ProfileModalNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export default function ProfileModalNav({ activeTab, onTabChange }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navItems = [
    { label: 'Overview', key: 'overview' },
    { label: 'Inventory', key: 'inventory' },
  ];

  return (
    <View style={styles.nav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => onTabChange(item.key)}
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
    paddingBottom: 10,
    marginTop: 5,
  },
  navText: {
    fontSize: 17,
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