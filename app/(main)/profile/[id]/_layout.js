import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Slot } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/assets/theme/ThemeContext';
import { ProfileRouteProvider } from '@/context/ProfileRouteContext';
import ProfileNav from '@/components/navigation/ProfileNav';
import { getProfileById } from '@/services/ProfileService';
import { buildMediaUrl } from '@/utils/imageHelpers';
import CameraIconButton from '@/components/button/CameraIconButton';
import UploadPhotoModal from '@/components/modal/UploadPhotoModal';
import NoResultsText from '@/components/text/NoResultsText';

export default function ProfileLayout() {
  const { colors, spacing, typography, fonts, radius } = useTheme();
  const { id: routeProfileId } = useLocalSearchParams();
  const { user: me } = useAuth();

  const myProfileId = me?.user_profile?.id ?? null;
  const isMine = !!routeProfileId && !!myProfileId && String(routeProfileId) === String(myProfileId);

  const [viewed, setViewed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [uploadPhotoContext, setUploadPhotoContext] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!routeProfileId) {
        if (mounted) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      if (isMine && me) {
        if (!mounted) return;
        setViewed(me);
        setNotFound(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getProfileById(routeProfileId);
      if (!mounted) return;
      if (res?.ok && res?.data) {
        setViewed(res.data);
        setNotFound(false);
      } else {
        setViewed(null);
        setNotFound(true);
      }
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [routeProfileId, isMine, me]);

  const profile = viewed?.user_profile ?? null;
  const account = profile?.user ?? null;
  const role = account?.role;

  const profilePhoto =
    buildMediaUrl(profile?.user?.profile_photo) || require('@/assets/images/Profile/default-profile-photo.png');

  const coverPhoto =
    buildMediaUrl(profile?.user?.cover_photo) || require('@/assets/images/Profile/default-cover-photo.png');

  const displayName = useMemo(() => {
    if (loading) return 'Loading...';
    if (role === 'AE') return profile?.establishment_name || profile?.business_name || account?.username || 'Profile';
    return account?.username || 'Profile';
  }, [loading, role, profile, account]);

  const address =
    role === 'AE'
      ? [profile?.street_address, profile?.barangay, profile?.city_municipality, profile?.province]
          .filter(Boolean)
          .join(', ')
      : '';

  const isVerified = role !== 'AE' || profile?.accreditation_status === true;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerSection: {
      position: 'relative',
      height: 260, // Cover height + half of profile photo
    },
    coverImageContainer: {
      width: '100%',
      height: 200,
      backgroundColor: '#828282',
      position: 'relative',
    },
    coverImage: {
      width: '100%',
      height: '100%',
    },
    cameraButtonCover: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.sm,
      zIndex: 2,
    },
    profileImageContainer: {
      position: 'absolute',
      left: spacing.md,
      bottom: 0,
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colors.background,
      backgroundColor: colors.background,
      zIndex: 3,
    },
    profileImageWrapper: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    cameraButtonProfile: {
      position: 'absolute',
      bottom: 8,
      right: -5,
      zIndex: 4,
    },
    contentContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    nameText: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.weight.bold,
      color: colors.text,
      fontFamily: fonts.gotham,
    },
    verifiedIcon: {
      marginLeft: spacing.sm,
    },
    addressText: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
      marginBottom: spacing.md,
    },
    divider: {
      height: 2,
      backgroundColor: colors.border,
      marginVertical: -14,
    },
    childrenContainer: {
      paddingVertical: spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.container}>
        <NoResultsText text={`The user with ID ${routeProfileId} doesn't exist or is unavailable.`} />
      </View>
    );
  }

  return (
    <ProfileRouteProvider value={{ viewed, isMine, loading }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* Header Section - Contains Cover and Profile Photo */}
          <View style={styles.headerSection}>
            {/* Cover Photo */}
            <View style={styles.coverImageContainer}>
              <Image
                source={typeof coverPhoto === 'string' ? { uri: coverPhoto } : coverPhoto}
                style={styles.coverImage}
                resizeMode="cover"
              />
              {isMine && (
                <View style={styles.cameraButtonCover}>
                  <CameraIconButton onPress={() => setUploadPhotoContext('cover')} />
                </View>
              )}
            </View>

            {/* Profile Photo - Overlaps cover photo */}
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageWrapper}>
                <Image
                  source={typeof profilePhoto === 'string' ? { uri: profilePhoto } : profilePhoto}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
              {isMine && (
                <View style={styles.cameraButtonProfile}>
                  <CameraIconButton onPress={() => setUploadPhotoContext('profile')} />
                </View>
              )}
            </View>
          </View>

          {/* Profile Info */}
          <View style={styles.contentContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{displayName}</Text>
              {isVerified && (
                role === 'AE' ? (
                  <MaterialIcons
                    name="workspace-premium"
                    size={24}
                    color="#8DC641"
                    style={styles.verifiedIcon}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={24}
                    color="#8DC641"
                    style={styles.verifiedIcon}
                  />
                )
              )}
            </View>

            {role === 'AE' && !!address && (
              <Text style={styles.addressText}>{address}</Text>
            )}

            <ProfileNav myId={myProfileId} role={role} />

            <View style={styles.divider} />

            <View style={styles.childrenContainer}>
              <Slot />
            </View>
          </View>
        </ScrollView>

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
      </View>
    </ProfileRouteProvider>
  );
}