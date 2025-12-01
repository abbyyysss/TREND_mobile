import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryModalHeader from '@/components/header/PrimaryModalHeader';
import EditProfileHeaderButton from '@/components/button/EditProfileHeaderButton';
// import EditProfileInfoModal from './EditAccountInfoModal';
// import UploadPhotoModal from './UploadPhotoModal';
// import { useAuth } from '@/context/authContext';
// import { buildMediaUrl } from '@/utils/imageHelpers';

const { height } = Dimensions.get('window');

export default function EditProfileModal({
  open,
  onClose,
  profile,
  account,
  role,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // const { user, loading } = useAuth();

  const [openEditProfileInfoModal, setOpenEditProfileInfoModal] = useState(false);
  const [uploadPhotoContext, setUploadPhotoContext] = useState(null);

  // Mock data - replace with actual context
  const loading = false;
  const isAE = role === 'AE';

  // Mock profile and account data
  const mockProfile = {
    establishment_name: 'Grand Hotel',
    region: 'NCR',
    street_address: '123 Main St',
    barangay: 'Brgy. Sample',
    city_municipality: 'Quezon City',
    province: 'Metro Manila',
    accreditation_status: true,
    user: {
      profile_photo: undefined,
      cover_photo: undefined,
    },
  };

  const mockAccount = {
    username: 'grandhotel',
    contact_num: '+63 912 345 6789',
    email: 'contact@grandhotel.com',
  };

  const currentProfile = profile || mockProfile;
  const currentAccount = account || mockAccount;

  const profilePhoto = currentProfile.user?.profile_photo || null;
  const coverPhoto = currentProfile.user?.cover_photo || null;

  const name = isAE
    ? currentProfile.establishment_name ||
      currentProfile.business_name ||
      currentAccount.username ||
      '—'
    : `DOT ${currentProfile.region || ''}`.trim() || currentAccount.username || '—';

  const type = isAE ? 'Accommodation Establishment' : 'Regional Office';
  const contact = currentAccount.contact_num || '—';
  const email = currentAccount.email || '—';
  const address = isAE
    ? [
        currentProfile.street_address,
        currentProfile.barangay,
        currentProfile.city_municipality,
        currentProfile.province,
      ]
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
            data: currentProfile.accreditation_status
              ? 'Accredited'
              : 'Unaccredited',
            isAccreditation: true,
            isAccredited: !!currentProfile.accreditation_status,
          },
        ]
      : []),
    { id: '4', title: 'Contact Number', data: loading ? 'Loading…' : contact },
    { id: '5', title: 'Email', data: loading ? 'Loading…' : email },
    ...(isAE ? [{ id: '6', title: 'Address', data: loading ? 'Loading…' : address }] : []),
    { id: '7', title: 'Password', data: loading ? 'Loading…' : '********' },
  ];

  return (
    <>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: isDark ? '#000' : '#fff',
                borderColor: '#DADADA',
              },
            ]}
          >
            <PrimaryModalHeader onClose={onClose} label="Edit Profile" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Photos Section */}
              <View style={styles.photoSection}>
                <EditProfileHeaderButton
                  text="Profile Picture"
                  onPress={() => setUploadPhotoContext('profile')}
                />
                <View style={styles.profilePhotoContainer}>
                  {profilePhoto ? (
                    <Image
                      source={{ uri: profilePhoto }}
                      style={styles.profilePhoto}
                    />
                  ) : (
                    <View
                      style={[
                        styles.profilePhoto,
                        styles.placeholderPhoto,
                        { backgroundColor: isDark ? '#333' : '#e5e7eb' },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={60}
                        color={isDark ? '#666' : '#9ca3af'}
                      />
                    </View>
                  )}
                </View>

                <EditProfileHeaderButton
                  text="Cover Photo"
                  onPress={() => setUploadPhotoContext('cover')}
                />
                <View style={styles.coverPhotoContainer}>
                  {coverPhoto ? (
                    <Image
                      source={{ uri: coverPhoto }}
                      style={styles.coverPhoto}
                    />
                  ) : (
                    <View
                      style={[
                        styles.coverPhoto,
                        styles.placeholderPhoto,
                        { backgroundColor: isDark ? '#333' : '#e5e7eb' },
                      ]}
                    >
                      <Ionicons
                        name="image"
                        size={40}
                        color={isDark ? '#666' : '#9ca3af'}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Info Section */}
              <View
                style={[
                  styles.infoSection,
                  { borderTopColor: '#D9D9D9' },
                ]}
              >
                <EditProfileHeaderButton
                  text="User Information"
                  onPress={() => setOpenEditProfileInfoModal(true)}
                />

                <View style={styles.infoList}>
                  {infos.map((info) => {
                    const isAccreditation = info.isAccreditation === true;

                    return (
                      <View key={info.id} style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{info.title}</Text>
                        <View style={styles.infoValueContainer}>
                          <Text
                            style={[
                              styles.infoValue,
                              { color: isDark ? '#d5d6d7' : '#313638' },
                            ]}
                          >
                            {info.data}
                          </Text>
                          {isAccreditation &&
                            (info.isAccredited ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color="#8DC641"
                              />
                            ) : (
                              <Ionicons
                                name="close-circle"
                                size={18}
                                color="#EF4444"
                              />
                            ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Info Modal - commented out until implemented */}
      {/*
      <EditProfileInfoModal
        open={openEditProfileInfoModal}
        onClose={() => setOpenEditProfileInfoModal(false)}
      />
      */}

      {/* Upload Photo Modal - commented out until implemented */}
      {/*
      <UploadPhotoModal
        open={!!uploadPhotoContext}
        onClose={() => setUploadPhotoContext(null)}
        label={uploadPhotoContext === 'profile' ? 'PROFILE PHOTO' : 'COVER PHOTO'}
        description={
          uploadPhotoContext === 'profile'
            ? 'Profile photo changed successfully.'
            : 'Cover photo changed successfully.'
        }
      />
      */}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.95,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  photoSection: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20,
  },
  profilePhotoContainer: {
    marginBottom: 40,
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  coverPhotoContainer: {
    width: '90%',
    marginBottom: 40,
  },
  coverPhoto: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  placeholderPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  infoList: {
    gap: 15,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#828282',
    width: 100,
    flexShrink: 0,
  },
  infoValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 13,
    flex: 1,
  },
});