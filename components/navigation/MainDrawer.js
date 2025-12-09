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
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';

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
  const { user, loading, role } = useAuth();

  const handleNavigate = (href) => {
    setDrawerOpen(false);
    router.push(href);
  };

  if (loading || !user) return null;

  // Get user profile
  const u = user?.user_profile;

  // For AE role, get the report mode
  const reportMode = role === 'AE' ? u?.report_mode : null;

  // Filter navigation items based on report mode
  const visibleItems = navItems.filter(item => {
    // If AE is MONTHLY, exclude Guest Log
    if (reportMode === AEReportMode.MONTHLY && item.href === '/guest-log') {
      return false;
    }
    return true;
  });

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
              {visibleItems.map((item) => {
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
                    <Image
                      source={item.icon}
                      style={[
                        styles.navIcon,
                        { tintColor: isActive ? '#000000' : colors.text,  }
                      ]}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.navText,
                        { 
                          color: isActive ? '#000000' : colors.text,
                          fontFamily: fonts.gotham
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
    backgroundColor: '#D4AF37',
  },
  navIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  navText: {
    fontSize: 14,
  },
});