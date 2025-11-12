import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  useColorScheme,
  Pressable,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const router = useRouter();

  // Mock user data for UI purposes
  const username = 'John Doe';
  const role = 'User';
  const profilePhoto = require('@/assets/images/Profile/default-profile-photo.png');

  const handleMenuClose = (action) => {
    setMenuOpen(false);
    
    if (action === 'logout') {
      router.push('/(login)/login');
      return;
    }

    if (action === 'profile') {
      if (pathname !== '/profile') {
        router.push('/(main)/profile');
      }
    }
  };

  const textColor = isDark ? '#d5d6d7' : '#313638';

  return (
    <>
      <TouchableOpacity 
        style={styles.profileContainer}
        onPress={() => setMenuOpen(true)}
        activeOpacity={0.7}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setButtonLayout(layout);
        }}
      >
        <Image
          source={profilePhoto}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text 
            style={[styles.username, { color: isDark ? '#e5e7eb' : '#313638' }]}
            numberOfLines={1}
          >
            {username}
          </Text>
          <Text 
            style={[styles.role, { color: isDark ? '#e5e7eb' : '#757575' }]}
            numberOfLines={1}
          >
            {role}
          </Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? '#e5e7eb' : '#313638'}
        />
      </TouchableOpacity>

      <Modal
        visible={menuOpen}
        animationType="none"
        transparent={true}
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <View 
            style={[
              styles.menuContainer,
              { 
                backgroundColor: isDark ? '#000000' : '#ffffff',
                position: 'absolute',
                top: buttonLayout ? buttonLayout.y + buttonLayout.height : 0,
                right: 16,
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.menuItem,
                pathname?.startsWith('/profile') && styles.menuItemActive
              ]}
              onPress={() => handleMenuClose('profile')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={textColor}
                style={styles.menuIcon}
              />
              <Text style={[
                styles.menuText,
                { color: textColor },
                pathname?.startsWith('/profile') && styles.menuTextActive
              ]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuClose('logout')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color={textColor}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: textColor }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#828282',
  },
  textContainer: {
    flex: 1,
    maxWidth: 100,
  },
  username: {
    fontSize: 14,
  },
  role: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 70,
    marginRight: 130,
  },
  menuContainer: {
    minWidth: 170,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    padding: 5,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
  },
  menuIcon: {
    width: 20,
  },
  menuText: {
    fontSize: 14,
  },
  menuTextActive: {
    fontWeight: 'bold',
  },
});