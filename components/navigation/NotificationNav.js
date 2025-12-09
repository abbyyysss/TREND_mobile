import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function NotificationNav({ activeFilter, onFilterChange }) {
  const { colors, fonts, typography, spacing } = useTheme();

  const navItems = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.sm,
        },
      ]}
    >
      {navItems.map((item) => {
        const isActive = activeFilter === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onFilterChange(item.value)}
            style={[
              styles.navButton,
              {
                paddingHorizontal: spacing.sm,
                paddingBottom: spacing.sm,
                borderBottomWidth: 3,
                borderBottomColor: isActive ? '#D4AF37' : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.navText,
                {
                  color: isActive ? '#D4AF37' : colors.textSecondary,
                  fontFamily: fonts.gotham,
                  fontSize: typography.fontSize.md,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: 8,
  },
  navButton: {
    justifyContent: 'center',
  },
  navText: {},
});