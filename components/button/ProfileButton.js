import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { buildMediaUrl } from '@/utils/imageHelpers';
import { formatAEType } from '@/utils/aeTypes';

export default function ProfileButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  
  // Theme context
  const { colors, isDark, fonts } = useTheme();
  
  // Auth context
  const { user, logout, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <View style={styles.profileContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary, fontFamily: fonts.gotham }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // No user logged in
  if (!user) {
    return null;
  }

  // Extract user data
  const u = user?.user_profile;
  
  // Format establishment type
  const establishmentType = u?.type_display || formatAEType(u?.type) || 'AE';

  // Determine username - use establishment name or business name
  const username = u?.establishment_name || u?.business_name || user?.username || 'User';

  // Profile photo
  const profilePhoto = buildMediaUrl(u?.user?.profile_photo)
    ? { uri: buildMediaUrl(u?.user?.profile_photo) }
    : require('@/assets/images/Profile/default-profile-photo.png');

  const handleMenuClose = (action) => {
    setMenuOpen(false);

    if (action === 'logout') {
      logout();
      router.push('/login');
      return;
    }

    if (action === 'profile') {
      const myProfileId = user?.user_profile?.id;
      if (myProfileId) {
        // Navigate to profile with ID as query parameter
        router.push(`/profile/${myProfileId}`);
      } else {
        // Fallback if no profile ID
        console.warn('No profile ID found for user');
        router.push('/profile');
      }
    }
  };

  const isProfileActive = pathname?.startsWith('/profile');

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
        <Image source={profilePhoto} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text
            style={[styles.username, { color: colors.text, fontFamily: fonts.gotham }]}
            numberOfLines={1}
          >
            {username}
          </Text>
          <Text
            style={[styles.role, { color: colors.textSecondary, fontFamily: fonts.gotham }]}
            numberOfLines={1}
          >
            {establishmentType}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={menuOpen}
        animationType="none"
        transparent={true}
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                position: 'absolute',
                top: buttonLayout ? buttonLayout.y + buttonLayout.height : 0,
                right: 16,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.menuItem,
                isProfileActive && styles.menuItemActive,
              ]}
              onPress={() => handleMenuClose('profile')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconWrapper,
                { borderColor: isProfileActive ? '#000000' : colors.text }
              ]}>
                <Ionicons
                  name="person-outline"
                  size={11}
                  color={isProfileActive ? '#000000' : colors.text}
                />
              </View>
              <Text
                style={[
                  styles.menuText,
                  { color: isProfileActive ? '#000000' : colors.text , fontFamily: fonts.gotham },
                  isProfileActive && styles.menuTextActive,
                ]}
              >
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
                size={22}
                color={colors.text}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: colors.text, fontFamily: fonts.gotham }]}>
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
    fontSize: 12,
    fontWeight: '400',
  },
  role: {
    fontSize: 12,
    fontWeight: '400',
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
  },
  iconWrapper: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
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