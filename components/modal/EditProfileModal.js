import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import PrimaryModalHeader from '@/components/header/PrimaryModalHeader';
import EditProfileHeaderButton from '../button/EditProfileHeaderButton';
import EditProfileInfoModal from './EditAccountInfoModal';
import UploadPhotoModal from './UploadPhotoModal';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/assets/theme/ThemeContext';
import { buildMediaUrl } from '@/utils/imageHelpers';

export default function EditProfileModal({ open, onClose, profile, account, role }) {
  const [openEditProfileInfoModal, setOpenEditProfileInfoModal] = useState(false);
  const [uploadPhotoContext, setUploadPhotoContext] = useState(null);
  const { colors, spacing, typography, radius, isDark } = useTheme();

  const { user, loading } = useAuth();
  const isAE = role === 'AE';

  const profilePhoto =
    buildMediaUrl(profile?.user?.profile_photo) || require('@/assets/Profile/default-profile-photo.png');
  
  const coverPhoto =
    buildMediaUrl(profile?.user?.cover_photo) || require('@/assets/Profile/default-cover-photo.png');

  const name = isAE
    ? profile?.establishment_name || profile?.business_name || account?.username || '—'
    : `DOT ${profile?.region || ''}`.trim() || account?.username || '—';

  const type = isAE ? 'Accommodation Establishment' : 'Regional Office';
  const contact = account?.contact_num || '—';
  const email = account?.email || '—';
  const address = isAE
    ? [profile?.street_address, profile?.barangay, profile?.city_municipality, profile?.province]
        .filter(Boolean)
        .join(', ')
    : '—';

  const infos = [
    { id: '1', title: 'Name', data: loading ? 'Loading…' : name },
    { id: '2', title: 'Type', data: loading ? 'Loading…' : type },
    ...(isAE
      ? [
          {
            id: '3',
            title: 'Accreditation Status',
            data: profile?.accreditation_status ? 'Accredited' : 'Unaccredited',
            _isAccreditation: true,
            _isAccredited: !!profile?.accreditation_status,
          },
        ]
      : []),
    { id: '4', title: 'Contact Number', data: loading ? 'Loading…' : contact },
    { id: '5', title: 'Email', data: loading ? 'Loading…' : email },
    ...(isAE 
      ? [
        { id: '6', title: 'Address', data: loading ? 'Loading…' : address },
      ]
      : []),
    { id: '7', title: 'Password', data: loading ? 'Loading…' : '********' },
  ];

  return (
    <>
      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: radius.xl,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalInner}>
              {/* Sticky Header */}
              <View style={styles.stickyHeader}>
                <PrimaryModalHeader onClose={onClose} label="Edit Profile" />
              </View>

              {/* Scrollable content */}
              <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
              >
                {/* Photos Section */}
                <View style={[styles.photosSection, { paddingVertical: spacing.lg }]}>
                  <View style={[styles.photoContainer, { gap: spacing.md }]}>
                    <EditProfileHeaderButton
                      text="Profile Picture"
                      onClick={() => setUploadPhotoContext('profile')}
                    />
                    <Image
                      source={typeof profilePhoto === 'string' ? { uri: profilePhoto } : profilePhoto}
                      style={[
                        styles.profilePhoto,
                        { 
                          borderColor: colors.border,
                          marginBottom: spacing.xl,
                        },
                      ]}
                    />
                    <EditProfileHeaderButton
                      text="Cover Photo"
                      onClick={() => setUploadPhotoContext('cover')}
                    />
                    <Image
                      source={typeof coverPhoto === 'string' ? { uri: coverPhoto } : coverPhoto}
                      style={[
                        styles.coverPhoto,
                        { 
                          borderColor: colors.border,
                          marginBottom: spacing.xl,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Info Section */}
                <View
                  style={[
                    styles.infoSection,
                    {
                      borderTopColor: colors.border,
                      paddingTop: spacing.sm,
                      paddingBottom: spacing.xl,
                      paddingHorizontal: spacing.md,
                    },
                  ]}
                >
                  <EditProfileHeaderButton
                    text="User Information"
                    onClick={() => setOpenEditProfileInfoModal(true)}
                  />
                  {infos.map((info) => {
                    const isAccreditation = info._isAccreditation === true;

                    return (
                      <View
                        key={info.id}
                        style={[
                          styles.infoRow,
                          { 
                            paddingTop: spacing.sm,
                            gap: spacing.md,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.infoLabel,
                            {
                              color: '#828282',
                              fontSize: typography.fontSize.sm,
                            },
                          ]}
                        >
                          {info.title}
                        </Text>
                        <View style={styles.infoValueContainer}>
                          <Text
                            style={[
                              styles.infoValue,
                              { 
                                color: isDark ? '#d5d6d7' : '#313638',
                                fontSize: typography.fontSize.sm,
                              },
                            ]}
                          >
                            {info.data}
                          </Text>
                          {isAccreditation &&
                            (info._isAccredited ? (
                              <Text style={{ color: '#8DC641', fontSize: 16 }}>✓</Text>
                            ) : (
                              <Text style={{ color: '#EF4444', fontSize: 16 }}>✗</Text>
                            ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <EditProfileInfoModal
        open={openEditProfileInfoModal}
        onClose={() => setOpenEditProfileInfoModal(false)}
      />

      <UploadPhotoModal
        open={!!uploadPhotoContext}
        onClose={() => setUploadPhotoContext(null)}
        label={uploadPhotoContext === 'profile' ? 'PROFILE PHOTO' : 'COVER PHOTO'}
        description={
          uploadPhotoContext === 'profile'
            ? 'Profile photo changed succesfully.'
            : 'Cover photo changed successfully.'
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '95%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalInner: {
    flex: 1,
  },
  stickyHeader: {
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  photosSection: {
    width: '100%',
    paddingHorizontal: 10,
  },
  photoContainer: {
    alignItems: 'center',
  },
  profilePhoto: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 2,
  },
  coverPhoto: {
    height: 140,
    width: '90%',
    borderRadius: 8,
    borderWidth: 2,
  },
  infoSection: {
    width: '100%',
    borderTopWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 100,
    flexShrink: 0,
  },
  infoValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  infoValue: {
    flex: 1,
  },
});