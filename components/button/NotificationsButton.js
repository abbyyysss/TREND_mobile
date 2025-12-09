import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/assets/theme/ThemeContext';
import NotificationNav from '@/components/navigation/NotificationNav';
import NotificationMenuNav from '@/components/navigation/NotificationMenuNav';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
import { ACCESS_TOKEN } from '@/services/Constants';
import {
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  bulkMarkAsRead,
  deleteNotifications,
  createAutoReconnectSocket,
} from '@/services/NotificationService';

export default function NotificationButton() {
  const { colors, fonts, isDark, radius, spacing, typography } = useTheme();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [buttonLayout, setButtonLayout] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') =>
    setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleMenuOpen = (id) => {
    setMenuOpenId(id);
    setMenuVisible(true);
  };

  const handleMenuClose = async (action) => {
    if (!menuOpenId) {
      setMenuVisible(false);
      return;
    }
    try {
      if (action === 'markRead') {
        await markNotificationAsRead(menuOpenId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === menuOpenId ? { ...n, is_read: true } : n))
        );
        showSnackbar('Notification marked as read.', 'success');
      } else if (action === 'markUnread') {
        await markNotificationAsUnread(menuOpenId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === menuOpenId ? { ...n, is_read: false } : n))
        );
        showSnackbar('Notification marked as unread.', 'info');
      } else if (action === 'delete') {
        try {
          await deleteNotifications(menuOpenId);
          setNotifications((prev) => prev.filter((n) => n.id !== menuOpenId));
          showSnackbar('Notification deleted.', 'success');
        } catch (err) {
          console.error('Failed to delete notification:', err);
          showSnackbar('Failed to delete notification.', 'error');
        }
      }
    } catch (error) {
      console.error('Notification action failed:', error);
      showSnackbar('Action failed. Try again.', 'error');
    } finally {
      setMenuVisible(false);
      setMenuOpenId(null);
    }
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!unreadIds.length) {
      showSnackbar('No unread notifications.', 'info');
      return;
    }
    try {
      await bulkMarkAsRead(unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      showSnackbar('All notifications marked as read.', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to mark all as read.', 'error');
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    let socketCleanup;
    let pollInterval;
    let mounted = true;

    const initNotifications = async () => {
      await fetchNotifications();

      const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (!token) return;

      if (socketCleanup) socketCleanup();

      console.log('🔌 Initializing WebSocket...');
      socketCleanup = createAutoReconnectSocket(
        token,
        (data) => {
          if (!mounted) return;
          setNotifications((prev) => {
            if (prev.some((n) => n.id === data.id)) return prev;
            return [data, ...prev];
          });
          showSnackbar('New notification received', 'info');
        },
        (err) => console.error('❌ [WebSocket] Error:', err)
      );
    };

    initNotifications();

    pollInterval = setInterval(fetchNotifications, 120000);

    return () => {
      mounted = false;
      if (socketCleanup) socketCleanup();
      clearInterval(pollInterval);
    };
  }, []);

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <TouchableOpacity 
        onPress={handleToggle} 
        style={styles.iconButton}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setButtonLayout(layout);
        }}
      >
        <View>
          <Ionicons
            name="notifications-outline"
            size={28}
            color={isDark ? '#e5e7eb' : '#313638'}
          />
          {unreadCount > 0 && (
            <View
              style={[
                styles.badge,
                { 
                  backgroundColor: '#EF1A25',
                  borderRadius: radius.full,
                }
              ]}
            >
              <Text style={[styles.badgeText, { fontFamily: fonts.gotham }]}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={[
              styles.notificationPanel,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: radius.lg,
                position: 'absolute',
                top: buttonLayout ? buttonLayout.y + buttonLayout.height - 18 : 0,
                right: 4,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View
              style={[
                styles.header,
                { 
                  backgroundColor: colors.card,
                  borderBottomColor: colors.border,
                  paddingHorizontal: spacing.lg,
                  paddingTop: spacing.md,
                }
              ]}
            >
              <View style={styles.headerTop}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text,
                      fontFamily: fonts.gotham,
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.weight.semibold,
                    },
                  ]}
                >
                  Notifications
                </Text>
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text
                    style={[
                      styles.markAllText,
                      {
                        color: colors.text,
                        fontFamily: fonts.gotham,
                        fontSize: typography.fontSize.sm,
                      },
                    ]}
                  >
                    Mark all as read
                  </Text>
                </TouchableOpacity>
              </View>

              <NotificationNav
                activeFilter={filter}
                onFilterChange={setFilter}
              />
            </View>

            {/* Notification List */}
            <ScrollView
              style={[styles.scrollView, { backgroundColor: colors.card }]}
              contentContainerStyle={styles.scrollContent}
            >
              {filteredNotifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.gotham,
                        fontSize: typography.fontSize.md,
                      },
                    ]}
                  >
                    No notifications
                  </Text>
                </View>
              ) : (
                filteredNotifications.map((notif) => (
                  <View
                    key={notif.id}
                    style={[
                      styles.notificationItem,
                      {
                        backgroundColor: notif.is_read
                          ? colors.card
                          : isDark
                          ? '#1F2937'
                          : '#F3F4F6',
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.notificationHeader}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          {
                            color: colors.text,
                            fontFamily: fonts.gotham,
                            fontSize: typography.fontSize.md,
                            fontWeight: typography.weight.semibold,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {notif.header || 'Notification'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleMenuOpen(notif.id)}
                        style={styles.menuButton}
                      >
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={20}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.notificationMessage,
                        {
                          color: colors.text,
                          fontFamily: fonts.gotham,
                          fontSize: typography.fontSize.sm,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {notif.message || 'No message available'}
                    </Text>
                    <Text
                      style={[
                        styles.notificationDate,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.gotham,
                          fontSize: typography.fontSize.xs,
                        },
                      ]}
                    >
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleString()
                        : '—'}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <NotificationMenuNav
        visible={menuVisible}
        onClose={handleMenuClose}
        isRead={
          menuOpenId
            ? notifications.find((n) => n.id === menuOpenId)?.is_read
            : false
        }
      />

      <MainSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  notificationPanel: {
    width: 300,
    height: 400,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {},
  markAllText: {
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 5,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    flex: 1,
  },
  menuButton: {
    padding: 4,
  },
  notificationMessage: {},
  notificationDate: {},
});