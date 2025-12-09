import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/assets/theme/ThemeContext';
import { AEReportMode, BASE_URL, FILE_URL } from '@/services/Constants';
import { useProfileRoute } from '@/context/ProfileRouteContext';
import EditIconButton from '@/components/button/EditIconButton';
import { extractFileInfo } from '@/utils/extractFileInfo';
import FileCard from '@/components/card/FileCard';
import EditAccountInfoModal from '@/components/modal/EditAccountInfoModal';
import EditReportModeModal from '@/components/modal/EditReportModeModal';
import EditAEInfoModal from '@/components/modal/EditAEInfoModal';
import EditContactAddressModal from '@/components/modal/EditContactAddressModal';
import EditAccreditationModal from '@/components/modal/EditAccreditationModal';
import EditStarRatingModal from '@/components/modal/EditStarRatingModal';
import { formatAEType } from '@/utils/aeTypes';
import { formatDate } from '@/utils/dateUtils';

export default function ProfileOverview() {
  const { colors, spacing, typography, fonts, radius } = useTheme();
  
  const { viewed, loading } = useProfileRoute();
  const { user: me } = useAuth();
  const myProfileId = me?.user_profile?.id ?? null;
  const isMine = viewed?.user_profile?.id ? String(viewed.user_profile.id) === String(myProfileId) : false;

  const profile = viewed?.user_profile || null;
  const account = profile?.user || null;
  const role = account?.role;

  const [openEditAccountInfoModal, setOpenEditAccountInfoModal] = useState(false);
  const [openEditReportModeModal, setOpenEditReportModeModal] = useState(false);
  const [openEditAEInfoModal, setOpenEditAEInfoModal] = useState(false);
  const [openEditContactAddressModal, setOpenEditContactAddressModal] = useState(false);
  const [openEditAccreditationModal, setOpenEditAccreditationModal] = useState(false);
  const [openEditStarRatingModal, setOpenEditStarRatingModal] = useState(false);

  const [attachments, setAttachments] = useState({
    proofOfBusiness: { name: 'N/A', type: null, size: 'N/A' },
    starRatingCert: { name: 'N/A', type: null, size: 'N/A' },
    accreditationCert: { name: 'N/A', type: null, size: 'N/A' },
  });

  const attachmentKeys = useMemo(() => [
    { key: 'proof_of_business', label: 'Proof of Business', stateKey: 'proofOfBusiness' },
    { key: 'star_rating_certificate', label: 'Star Rating Certificate', stateKey: 'starRatingCert' },
    { key: 'accreditation_certificate', label: 'Accreditation Certificate', stateKey: 'accreditationCert' },
  ], []);

  useEffect(() => {
    const fetchAllAttachments = async () => {
      const newAttachments = {};
      for (const { key, stateKey } of attachmentKeys) {
        newAttachments[stateKey] = await extractFileInfo(
          profile?.[key] ? `${FILE_URL}${profile[key]}` : null
        );
      }
      setAttachments(newAttachments);
    };

    if (profile) {
      fetchAllAttachments();
    }
  }, [profile, attachmentKeys]);

  const handleViewFile = (url) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `${FILE_URL}${url}`;
      Linking.openURL(fullUrl);
    }
  };

  const accountInfoDatas = [
    { id: '1', title: 'Email', data: account?.email || 'N/A' },
    { id: '2', title: 'Password', data: '**********' }
  ];

  const reportMode = profile?.report_mode;

  let officeInfoDatas = [];

  if (role === 'DOT') {
    officeInfoDatas = [
      { id: '1', title: 'Region', data: profile?.region || "N/A" },
    ];
  } else if (role === 'PROVINCE') {
    officeInfoDatas = [
      { id: '1', title: 'Province', data: profile?.province || "N/A" },
    ];
  } else if (role === 'CITYMUNICIPALITY') {
    officeInfoDatas = [
      { id: '1', title: 'Province', data: profile?.province || "N/A" },
      { id: '2', title: 'City/Municipality', data: profile?.city || "N/A" },
    ];
  }

  const reportModeDatas = [
    { id: '1', title: 'Current reporting mode', data: reportMode === AEReportMode.MONTHLY ? 'Monthly' : 'Daily' }
  ];

  const aeInfoDatas = [
    { id: '1', title: 'LGU assigned ID code', data: profile?.id_code || 'N/A' },
    { id: '2', title: 'Establishment name', data: profile?.establishment_name || 'N/A' },
    { id: '3', title: 'Business name', data: profile?.business_name || 'N/A' },
    { id: '4', title: 'Type of accommodation', data: formatAEType(profile?.type) || 'N/A' },
    { id: '5', title: 'No. of rooms', data: profile?.total_rooms || 'N/A' },
    { id: '6', title: 'No. of employees', data: profile?.female_employees + profile?.male_employees || 'N/A' },
    {
      id: '7',
      title: 'Attachment',
      data: attachments.proofOfBusiness.name,
      size: attachments.proofOfBusiness.size,
      isAttachment: true,
      attachmentType: attachments.proofOfBusiness.type,
      url: profile?.proof_of_business
    },
  ];

  const contactAddressDatas = [
    { id: '1', title: 'Contact person', data: profile?.contact_person || 'N/A' },
    { id: '2', title: 'Contact number', data: account?.contact_num || 'N/A' },
    {
      id: '3',
      title: 'Address',
      data: [
        profile?.street_address,
        profile?.barangay,
        profile?.city_municipality,
        profile?.province
      ]
        .filter((part) => part && part.trim() !== '')
        .join(', ') || 'N/A',
    },
  ];

  const accreditationDatas = [
    { id: '1', title: 'Accreditation status', data: profile?.accreditation_status === true ? 'Accredited' : 'Not accredited', isAccredited: profile?.accreditation_status },
    { id: '2', title: 'Control number', data: profile?.accreditation_control_number || 'N/A' },
    { id: '3', title: 'Expiry date', data: formatDate(profile?.accreditation_expiry) || 'N/A' },
    {
      id: '4',
      title: 'Accreditation Certificate',
      data: attachments.accreditationCert.name,
      size: attachments.accreditationCert.size,
      isAttachment: true,
      attachmentType: attachments.accreditationCert.type,
      url: profile?.accreditation_certificate,
    },
  ];

  const starRatingDatas = [
    {
      id: '1',
      title: 'Rating',
      data:
        profile?.star_rating == null
          ? 'N/A'
          : `${profile.star_rating} ${profile.star_rating === 1 ? 'star' : 'stars'}`,
    },
    { id: '2', title: 'Expiry date', data: formatDate(profile?.star_rating_expiry) },
    {
      id: '3',
      title: 'Star Rating Certificate',
      data: attachments.starRatingCert.name,
      size: attachments.starRatingCert.size,
      isAttachment: true,
      attachmentType: attachments.starRatingCert.type,
      url: profile?.star_rating_certificate
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: 10,
      paddingBottom: 25,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginBottom: 25,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    sectionTitleContainer: {
      flex: 1,
      paddingRight: spacing.xs,
    },
    sectionTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.weight.semibold,
      color: colors.text,
      fontFamily: fonts.gotham,
      lineHeight: typography.fontSize.lg * 1.3,
    },
    infoItem: {
      marginBottom: spacing.sm,
    },
    infoTitle: {
      fontSize: typography.fontSize.sm,
      color: colors.text,
      fontFamily: fonts.gotham,
      marginBottom: spacing.xs,
    },
    infoData: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
    },
    infoDataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIcon: {
      marginLeft: spacing.xs,
    },
    attachmentContainer: {
      paddingTop: spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starsContainer: {
      flexDirection: 'row',
      marginLeft: spacing.sm,
    },
    starIcon: {
      marginRight: 2,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.md,
      textAlign: 'center',
    },
  });

  const Section = ({ title, children, onEdit }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {isMine && onEdit && (
          <View style={styles.editIconContainer}>
            <EditIconButton onPress={onEdit} />
          </View>
        )}
      </View>
      {children}
    </View>
  );

  const InfoItem = ({ title, data, isAttachment, attachmentType, size, url, showIcon, isAccredited }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoTitle}>{title}</Text>
      {isAttachment ? (
        <View style={styles.attachmentContainer}>
          <FileCard
            fileName={data}
            fileSize={size}
            fileType={attachmentType}
            fileUrl={url}
            onView={() => handleViewFile(url)}
          />
        </View>
      ) : (
        <View style={styles.infoDataContainer}>
          <Text style={styles.infoData}>{data}</Text>
          {showIcon && (
            isAccredited ? (
              <MaterialCommunityIcons name="check-decagram" color="#8DC641" size={18} style={styles.statusIcon} />
            ) : (
              <MaterialCommunityIcons name="close-circle-outline" color="#EF4444" size={18} style={styles.statusIcon} />
            )
          )}
        </View>
      )}
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyText, { marginTop: spacing.md }]}>Loading profile...</Text>
      </View>
    );
  }

  // Empty state
  if (!viewed || !profile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Section title="Account Information" onEdit={() => setOpenEditAccountInfoModal(true)}>
        {accountInfoDatas.map((info) => (
          <InfoItem key={info.id} title={info.title} data={info.data} />
        ))}
      </Section>

      {role !== 'AE' && (
        <Section title="Office Information">
          {officeInfoDatas.map((info) => (
            <InfoItem key={info.id} title={info.title} data={info.data} />
          ))}
        </Section>
      )}

      {role === 'AE' && (<>
        <Section title="Report Mode" onEdit={() => setOpenEditReportModeModal(true)}>
          {reportModeDatas.map((info) => (
            <InfoItem key={info.id} title={info.title} data={info.data} />
          ))}
        </Section>

        <Section title="Establishment Information" onEdit={() => setOpenEditAEInfoModal(true)}>
          {aeInfoDatas.map((info) => (
            <InfoItem
              key={info.id}
              title={info.title}
              data={info.data}
              isAttachment={info.isAttachment}
              attachmentType={info.attachmentType}
              size={info.size}
              url={info.url}
            />
          ))}
        </Section>

        <Section title="Contact and Address" onEdit={() => setOpenEditContactAddressModal(true)}>
          {contactAddressDatas.map((info) => (
            <InfoItem key={info.id} title={info.title} data={info.data} />
          ))}
        </Section>

        <Section title="Accreditation" onEdit={() => setOpenEditAccreditationModal(true)}>
          {accreditationDatas.map((info) => (
            <InfoItem
              key={info.id}
              title={info.title}
              data={info.data}
              isAttachment={info.isAttachment}
              attachmentType={info.attachmentType}
              size={info.size}
              url={info.url}
              showIcon={info.title === 'Accreditation status'}
              isAccredited={info.isAccredited}
            />
          ))}
        </Section>

        <Section title="Star Rating" onEdit={() => setOpenEditStarRatingModal(true)}>
          {starRatingDatas.map((info) => (
            <View key={info.id} style={styles.infoItem}>
              <Text style={styles.infoTitle}>{info.title}</Text>
              {info.isAttachment ? (
                <View style={styles.attachmentContainer}>
                  <FileCard
                    fileName={info.data}
                    fileSize={info.size}
                    fileType={info.attachmentType}
                    fileUrl={info.url}
                    onView={() => handleViewFile(info.url)}
                  />
                </View>
              ) : info.title === "Rating" ? (
                <View style={styles.ratingContainer}>
                  <Text style={styles.infoData}>{info.data}</Text>
                  {profile?.star_rating >= 1 && profile?.star_rating <= 5 && (
                    <View style={styles.starsContainer}>
                      {Array.from({ length: profile.star_rating }).map((_, i) => (
                        <MaterialIcons key={i} name="star" color="#FACC15" size={16} style={styles.starIcon} />
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.infoData}>{info.data}</Text>
              )}
            </View>
          ))}
        </Section>
      </>)}

      <EditAccountInfoModal
        open={openEditAccountInfoModal}
        onClose={() => setOpenEditAccountInfoModal(false)}
      />
      <EditReportModeModal
        open={openEditReportModeModal}
        onClose={() => setOpenEditReportModeModal(false)}
      />
      <EditAEInfoModal
        open={openEditAEInfoModal}
        onClose={() => setOpenEditAEInfoModal(false)}
      />
      <EditContactAddressModal
        open={openEditContactAddressModal}
        onClose={() => setOpenEditContactAddressModal(false)}
      />
      <EditAccreditationModal
        open={openEditAccreditationModal}
        onClose={() => setOpenEditAccreditationModal(false)}
      />
      <EditStarRatingModal
        open={openEditStarRatingModal}
        onClose={() => setOpenEditStarRatingModal(false)}
      />
    </ScrollView>
  );
}