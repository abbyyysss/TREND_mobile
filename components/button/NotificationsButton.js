import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useColorScheme,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  { id: '1', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', isRead: true },
  { id: '2', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', isRead: true },
  { id: '3', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', isRead: true },
  { id: '4', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', isRead: true },
  { id: '5', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', isRead: true },
  { id: '6', description: 'no lorem ipsum no lorem ipsum no lorem ipsum no lorem ipsum', isRead: false },
  { id: '7', description: 'no lorem ipsum no lorem ipsum no lorem ipsum no lorem ipsum', isRead: false },
  { id: '8', description: 'no lorem ipsum no lorem ipsum no lorem ipsum no lorem ipsum', isRead: false },
  { id: '9', description: 'no lorem ipsum no lorem ipsum no lorem ipsum no lorem ipsum', isRead: false },
  { id: '10', description: 'no lorem ipsum no lorem ipsum no lorem ipsum no lorem ipsum', isRead: false },
];

export default function NotificationsButton() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <>
      <TouchableOpacity 
        onPress={() => setOpen(true)}
        style={styles.iconButton}
      >
        <View style={styles.badgeContainer}>
          <Ionicons
            name="notifications-outline"
            size={28}
            color={isDark ? '#e5e7eb' : '#313638'}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
        >
          <Pressable 
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#0B0B0B' : '#F4F4F4' }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={[
                  styles.title,
                  { color: isDark ? '#ffffff' : '#000000' }
                ]}>
                  Notifications
                </Text>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={[
                    styles.moreIcon,
                    { color: isDark ? '#ffffff' : '#000000' }
                  ]}>
                    ••
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  onPress={() => setFilter('all')}
                  style={styles.filterButton}
                >
                  <Text style={[
                    styles.filterText,
                    filter === 'all' 
                      ? styles.filterTextActive 
                      : { color: isDark ? '#ffffff' : '#000000' }
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setFilter('unread')}
                  style={styles.filterButton}
                >
                  <Text style={[
                    styles.filterText,
                    filter === 'unread' 
                      ? styles.filterTextActive 
                      : { color: isDark ? '#ffffff' : '#000000' }
                  ]}>
                    Unread
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications List */}
            <ScrollView 
              style={styles.listContainer}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
            >
              {filteredNotifications.length === 0 ? (
                <Text style={styles.emptyText}>No notifications</Text>
              ) : (
                filteredNotifications.map((notif) => (
                  <View
                    key={notif.id}
                    style={[
                      styles.notificationCard,
                      { backgroundColor: isDark ? '#000000' : '#ffffff' }
                    ]}
                  >
                    <Text style={[
                      styles.notificationTitle,
                      { color: isDark ? '#d2d2d2' : '#1e1e1e' }
                    ]}>
                      Notification
                    </Text>
                    <Text 
                      style={styles.notificationDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {notif.description}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 350,
    height: 500,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    padding: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingLeft: 15,
    gap: 15,
    paddingVertical: 5,
  },
  filterButton: {
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 17,
  },
  filterTextActive: {
    color: '#D4AF37',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 20,
  },
  notificationCard: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#757575',
  },
});