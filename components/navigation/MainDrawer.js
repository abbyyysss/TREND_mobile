import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileButton from '@/components/button/ProfileButton';
import NavIcon from '@/components/icon/NavIcon';
import { useTheme } from '@/assets/theme/ThemeContext';

const navItems = [
  { 
    label: 'Dashboard', 
    icon: require('@/assets/images/NavIcons/dashboard.webp'), 
    href: '/dashboard' 
  },
  { 
    label: 'Guest Log', 
    icon: require('@/assets/images/NavIcons/guestLog.png'), 
    href: '/guest-log' 
  },
  { 
    label: 'Reports Management', 
    icon: require('@/assets/images/NavIcons/reportsMgmt.png'), 
    href: '/reports-management' 
  },
];

export default function MainDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { colors, isDark, fonts } = useTheme();

  const handleNavigate = (href) => {
    setDrawerOpen(false);
    router.push(href);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setDrawerOpen(true)}
        style={styles.menuButton}
      >
        <Ionicons 
          name="menu" 
          size={28} 
          color={colors.text} 
        />
      </TouchableOpacity>

      <Modal
        visible={drawerOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setDrawerOpen(false)}
        >
          <Pressable 
            style={[
              styles.drawerContainer,
              { backgroundColor: colors.surface }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={[
              styles.drawerHeader,
              { backgroundColor: colors.surface, borderBottomColor: colors.border }
            ]}>
              <Image
                source={require('@/assets/images/TREND/trend.webp')}
                style={styles.logo}
                resizeMode="contain"
              />
              <TouchableOpacity 
                onPress={() => setDrawerOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons 
                  name="close" 
                  size={28} 
                  color={colors.text} 
                />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={[
              styles.profileSection,
              { backgroundColor: colors.surface }
            ]}>
              <ProfileButton />
            </View>

            {/* Navigation Items */}
            <ScrollView 
              style={styles.navList}
              showsVerticalScrollIndicator={false}
            >
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => handleNavigate(item.href)}
                    style={[
                      styles.navItem,
                      isActive && styles.navItemActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <NavIcon
                      source={item.icon}
                      alt={item.label}
                      size={30}
                      style={styles.navIconSpacing}
                    />
                    <Text
                      style={[
                        styles.navText,
                        { 
                          color: colors.text,
                          fontFamily: fonts.body 
                        },
                        isActive && styles.navTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: 250,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  logo: {
    width: 120,
    height: 65,
  },
  closeButton: {
    padding: 4,
  },
  profileSection: {
    paddingVertical: 8,
  },
  navList: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#D4AF37', // Gold/yellow color like in your screenshot
  },
  navIconSpacing: {
    marginRight: 12,
  },
  navText: {
    fontSize: 14,
  },
  navTextActive: {
    fontWeight: 'bold',
    color: '#000000', // Dark text on gold background
  },
});