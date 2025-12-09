import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function NotificationMenuNav({ visible, onClose, isRead }) {
  const { colors, fonts, isDark, radius, spacing, typography } = useTheme();

  const markAction = isRead ? 'markUnread' : 'markRead';
  const markLabel = isRead ? 'Mark as unread' : 'Mark as read';
  const markIconColor = isRead ? '#9CA3AF' : '#52C62D';

  const menuItems = [
    {
      label: markLabel,
      action: markAction,
      icon: 'checkmark',
      iconColor: markIconColor,
    },
    {
      label: 'Delete notification',
      action: 'delete',
      icon: 'trash',
      iconColor: '#E5252A',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose(null)}
    >
      <Pressable style={styles.overlay} onPress={() => onClose(null)}>
        <View
          style={[
            styles.menu,
            {
              backgroundColor: colors.card,
              borderColor: '#9CA3AF',
              borderRadius: radius.lg,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.menuItemWrapper,
                {
                  backgroundColor: colors.card,
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => onClose(item.action)}
                style={[
                  styles.menuItem,
                  {
                    borderRadius: radius.lg,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.iconColor}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color: colors.text,
                      fontFamily: fonts.gotham,
                      fontSize: typography.fontSize.sm,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    minWidth: 190,
    borderWidth: 1,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItemWrapper: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {},
});