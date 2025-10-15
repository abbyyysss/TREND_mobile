import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { usePathname } from 'expo-router';
import DarkModeToggle from '@/components/darkMode/DarkModeToggle';
import MainDrawer from '@/components/navigation/MainDrawer';
import NotificationsButton from '@/components/button/NotificationsButton';
import ProfileButton from '@/components/button/ProfileButton';

export default function MainHeader() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Guest Log', href: '/guest-log' },
    { label: 'Reports Management', href: '/reports-management' },
    { label: 'Profile', href: '/profile' },
  ];

  const currentNav = navItems.find(item => pathname?.startsWith(item.href));
  const pageTitle = currentNav ? currentNav.label.toUpperCase() : 'TREND';

  return (
    <View style={[styles.container, { borderBottomColor: '#C0BFBF' }]}>
      <View style={styles.leftSection}>
        <MainDrawer />
        <Text 
          style={[
            styles.title,
            { color: isDark ? '#e5e7eb' : '#313638' }
          ]}
        >
          {pageTitle}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <DarkModeToggle />
        <NotificationsButton />
        <View style={styles.profileContainer}>
          <ProfileButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  profileContainer: {
    // Profile button visible on all screens in mobile
  },
});