import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FullUnderlineTitle from '../text/FullUnderlineTitle';
import DefaultButton from '../button/DefaultButton';
import MainSelectInput from '../input/MainSelectInput';
import MainTextInput from '../input/MainTextInput';
import InformationButton from '../button/InformationButton';
import ConfirmationModal from '../modal/ConfirmationModal';
import NotificationModal from '../modal/NotificationModal';
import LoadingText from '../loading/LoadingText';
import LoadingSnackbar from '../snackbar/LoadingSnackbar';
import MainSnackbar from '../snackbar/MainSnackbar';
import { useTheme } from '@/assets/theme/ThemeContext';
import GuestLogService from '@/services/GuestLogService';
import { formatDate } from '@/utils/dateUtils';

export default function GuestLogModal({ 
  open, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'view'
  rowData = null,
  refreshLogs,
  user,
  role,
}) {
  const { colors, isDark, fonts, spacing } = useTheme();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [roomTypes, setRoomTypes] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const [formData, setFormData] = useState({
    check_in_date: `${year}-${month}-${day}`,
    ae_profile: null,
    room_id: '',
    room_type: '',
    number_of_nights: '',
  });

  const [selectedNationality, setSelectedNationality] = useState('');
  const [nationalities, setNationalities] = useState([]);

  const [guestCounts, setGuestCounts] = useState({
    filipinoMale: '0',
    filipinoFemale: '0',
    foreignMale: '0',
    foreignFemale: '0',
    ofwMale: '0',
    ofwFemale: '0',
  });

  const [totalGuests, setTotalGuests] = useState(0);
  const [errors, setErrors] = useState({});
  
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });

  // Load room types and nationalities
  useEffect(() => {
    const loadData = async () => {
      if (open) {
        setIsLoadingData(true);
        try {
          const [roomTypesData, nationalitiesData] = await Promise.all([
            GuestLogService.getRoomTypes(role),
            GuestLogService.getNationalities(),
          ]);

          setRoomTypes(roomTypesData);
          setNationalityOptions(nationalitiesData.map((n) => n.country));
        } catch (error) {
          console.error('Error loading data:', error);
          setErrorSnackbar({
            open: true,
            message: 'Failed to load form data. Please try again.',
          });
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadData();
  }, [open, role]);

  // Load rowData when modal opens in edit/view mode
  useEffect(() => {
    if (open) {
      if ((mode === 'edit' || mode === 'view') && rowData) {
        const updatedGuestCounts = {
          filipinoMale: '0',
          filipinoFemale: '0',
          foreignMale: '0',
          foreignFemale: '0',
          ofwMale: '0',
          ofwFemale: '0',
        };

        const otherNationalities = [];

        (rowData.nationalities || []).forEach((nat) => {
          const nationalityValue = nat.nationality_name;

          if (nationalityValue === 'Philippines' || nationalityValue === 48) {
            if (nat.filipino_subcategory === 'Non-OFW') {
              updatedGuestCounts.filipinoMale = String(Number(nat.male_count) || 0);
              updatedGuestCounts.filipinoFemale = String(Number(nat.female_count) || 0);
            } else if (nat.filipino_subcategory === 'OFW') {
              updatedGuestCounts.ofwMale = String(Number(nat.male_count) || 0);
              updatedGuestCounts.ofwFemale = String(Number(nat.female_count) || 0);
            } else if (nat.filipino_subcategory === 'Foreigner') {
              updatedGuestCounts.foreignMale = String(Number(nat.male_count) || 0);
              updatedGuestCounts.foreignFemale = String(Number(nat.female_count) || 0);
            }
          } else {
            otherNationalities.push({
              nationality: nationalityValue,
              filipino_subcategory: null,
              male_count: String(Number(nat.male_count) || 0),
              female_count: String(Number(nat.female_count) || 0),
            });
          }
        });

        setGuestCounts(updatedGuestCounts);
        setNationalities(otherNationalities);

        setFormData({
          check_in_date: rowData.check_in_date || `${year}-${month}-${day}`,
          ae_profile: rowData.ae_profile || null,
          room_id: rowData.room_id || '',
          room_type: rowData.room_type || '',
          number_of_nights: String(rowData.number_of_nights || ''),
        });
      } else {
        // Reset for add mode
        resetForm();
      }
    }
  }, [open, mode, rowData]);

  const resetForm = () => {
    setFormData({
      check_in_date: `${year}-${month}-${day}`,
      ae_profile: null,
      room_id: '',
      room_type: '',
      number_of_nights: '',
    });
    setGuestCounts({
      filipinoMale: '0',
      filipinoFemale: '0',
      foreignMale: '0',
      foreignFemale: '0',
      ofwMale: '0',
      ofwFemale: '0',
    });
    setNationalities([]);
    setSelectedNationality('');
    setErrors({});
  };

  const handleAddNationality = (nation) => {
    if (!nation) return;
    if (!nationalities.find((n) => n.nationality === nation)) {
      const newNationality = {
        nationality: nation,
        male_count: '0',
        female_count: '0',
      };
      setNationalities([...nationalities, newNationality]);
    }
    setSelectedNationality('');
  };

  const handleRemoveNationality = (nation) => {
    setNationalities(nationalities.filter((n) => n.nationality !== nation));
  };

  const updateNationalityCount = (nationality, gender, value) => {
    const safeValue = String(Math.max(0, Number(value) || 0));
    setNationalities((prev) =>
      prev.map((nation) =>
        nation.nationality === nationality
          ? { ...nation, [`${gender}_count`]: safeValue }
          : nation
      )
    );
  };

  const handleGuestCountChange = (field, value) => {
    const safeValue = String(Math.max(0, Number(value) || 0));
    setGuestCounts({
      ...guestCounts,
      [field]: safeValue,
    });

    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Auto-calculate total guests
  useEffect(() => {
    let total =
      Number(guestCounts.filipinoMale || 0) +
      Number(guestCounts.filipinoFemale || 0) +
      Number(guestCounts.foreignMale || 0) +
      Number(guestCounts.foreignFemale || 0) +
      Number(guestCounts.ofwMale || 0) +
      Number(guestCounts.ofwFemale || 0);

    nationalities.forEach((n) => {
      total += Number(n.male_count || 0) + Number(n.female_count || 0);
    });

    setTotalGuests(total);
  }, [guestCounts, nationalities]);

  const validate = () => {
    const newErrors = {};
    if (!formData.room_id) newErrors.room_id = 'Room ID is required';
    if (!formData.room_type) newErrors.room_type = 'Room type is required';
    if (!formData.number_of_nights) newErrors.number_of_nights = 'Number of nights is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setOpenConfirmationModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    try {
      const u = user?.user_profile;
      const reportMode = role === 'AE' ? u?.report_mode : 'daily';

      // Prepare nationalities data
      const nationalitiesData = [];
      
      if (Number(guestCounts.filipinoMale) > 0 || Number(guestCounts.filipinoFemale) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'Non-OFW',
          male_count: Number(guestCounts.filipinoMale) || 0,
          female_count: Number(guestCounts.filipinoFemale) || 0,
        });
      }
      
      if (Number(guestCounts.ofwMale) > 0 || Number(guestCounts.ofwFemale) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'OFW',
          male_count: Number(guestCounts.ofwMale) || 0,
          female_count: Number(guestCounts.ofwFemale) || 0,
        });
      }
      
      if (Number(guestCounts.foreignMale) > 0 || Number(guestCounts.foreignFemale) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'Foreigner',
          male_count: Number(guestCounts.foreignMale) || 0,
          female_count: Number(guestCounts.foreignFemale) || 0,
        });
      }
      
      nationalities.forEach((nat) => {
        if (Number(nat.male_count) > 0 || Number(nat.female_count) > 0) {
          nationalitiesData.push({
            nationality: nat.nationality,
            filipino_subcategory: null,
            male_count: Number(nat.male_count),
            female_count: Number(nat.female_count),
          });
        }
      });

      const submitData = {
        ...formData,
        ae_profile: u?.id || null,
        nationalities: nationalitiesData,
      };

      if (mode === 'add') {
        await GuestLogService.submit(submitData, reportMode);
      } else if (mode === 'edit' && rowData?.id) {
        await GuestLogService.submit(submitData, reportMode, rowData.id);
      }

      // Refresh logs
      if (refreshLogs) {
        await refreshLogs();
      }

      setOpenNotificationModal(true);
    } catch (error) {
      console.error('Error submitting guest log:', error);
      const errorMsg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Server error occurred. Please try again.';

      setErrorSnackbar({ open: true, message: errorMsg });
    } finally {
      setIsSubmitting(false);
      setOpenConfirmationModal(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isViewMode = mode === 'view';

  if (!user) return null;

  return (
    <>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>

            {isLoadingData ? (
              <View style={styles.loadingContainer}>
                <LoadingText text="Loading..." />
              </View>
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing.lg }}
              >
                {/* Title */}
                <Text style={[styles.title, { color: colors.text, fontFamily: fonts.gotham }]}>
                  Guest Log for
                </Text>

                {/* Check-in Date */}
                <MainTextInput
                  value={formatDate(formData.check_in_date)}
                  onChangeText={(value) => {
                    setFormData({ ...formData, check_in_date: value });
                    if (errors.check_in_date && value.trim() !== '') {
                      setErrors({ ...errors, check_in_date: null });
                    }
                  }}
                  variant="outlined"
                  disabled={true}
                  shrink={true}
                />

                {/* Room ID */}
                <MainTextInput
                  label="Room ID"
                  value={formData.room_id}
                  onChangeText={(value) => {
                    setFormData({ ...formData, room_id: value });
                    if (errors.room_id && value.trim() !== '') {
                      setErrors({ ...errors, room_id: null });
                    }
                  }}
                  variant="outlined"
                  disabled={isViewMode}
                  error={!!errors.room_id}
                  helperText={errors.room_id}
                  shrink={true}
                />

                {/* Room Type Dropdown */}
                <MainSelectInput
                  label="Room Type"
                  value={formData.room_type}
                  onChange={(value) => {
                    setFormData({ ...formData, room_type: value });
                    if (errors.room_type && value) {
                      setErrors({ ...errors, room_type: null });
                    }
                  }}
                  options={roomTypes.map((room) => ({
                    value: room.id,
                    label: room.room_name,
                  }))}
                  disabled={isViewMode}
                  variant="outlined"
                  error={!!errors.room_type}
                  helperText={errors.room_type}
                  placeholder="Select room type"
                />

                {/* How many nights */}
                <MainTextInput
                  label="How many nights are they staying for?"
                  value={formData.number_of_nights}
                  onChangeText={(value) => {
                    setFormData({ ...formData, number_of_nights: value });
                    if (errors.number_of_nights && value.trim() !== '') {
                      setErrors({ ...errors, number_of_nights: null });
                    }
                  }}
                  keyboardType="numeric"
                  variant="outlined"
                  disabled={isViewMode}
                  error={!!errors.number_of_nights}
                  helperText={errors.number_of_nights}
                  shrink={true}
                />

                {/* Philippine Residents Header */}
                <FullUnderlineTitle text="Philippine Residents" />
                <View style={styles.sectionSpacing} />

                {/* Filipino Nationality */}
                <Text style={[styles.subsectionTitle, { color: colors.text, fontFamily: fonts.gotham }]}>
                  Filipino Nationality
                </Text>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Male"
                      value={guestCounts.filipinoMale}
                      onChangeText={(value) => handleGuestCountChange('filipinoMale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Female"
                      value={guestCounts.filipinoFemale}
                      onChangeText={(value) => handleGuestCountChange('filipinoFemale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                </View>

                {/* Foreign Nationality */}
                <View style={styles.foreignNationalityHeader}>
                  <Text style={[styles.subsectionTitle, { color: colors.text, fontFamily: fonts.gotham }]}>
                    Foreign Nationality
                  </Text>
                  <InformationButton
                    helperText="A foreign national who has been granted legal permission to reside permanently or indefinitely in the Philippines."
                    iconSize={20}
                  />
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Male"
                      value={guestCounts.foreignMale}
                      onChangeText={(value) => handleGuestCountChange('foreignMale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Female"
                      value={guestCounts.foreignFemale}
                      onChangeText={(value) => handleGuestCountChange('foreignFemale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                </View>

                {/* OFWs Section */}
                <FullUnderlineTitle text="Overseas Filipino Workers" />
                <View style={styles.sectionSpacing} />
                
                <Text style={[styles.subsectionTitle, { color: colors.text, fontFamily: fonts.gotham }]}>
                  Overseas Filipino Workers
                </Text>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Male"
                      value={guestCounts.ofwMale}
                      onChangeText={(value) => handleGuestCountChange('ofwMale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <MainTextInput
                      label="Female"
                      value={guestCounts.ofwFemale}
                      onChangeText={(value) => handleGuestCountChange('ofwFemale', value)}
                      keyboardType="numeric"
                      variant="outlined"
                      disabled={isViewMode}
                      shrink={true}
                    />
                  </View>
                </View>

                {/* Non-Philippine Residents */}
                <FullUnderlineTitle text="Non-Philippine Residents" />
                <View style={styles.sectionSpacing} />

                {nationalities.map((nation) => (
                  <View key={nation.nationality}>
                    <View style={styles.foreignNationalityHeader}>
                      <Text style={[styles.subsectionTitle, { color: colors.text, fontFamily: fonts.gotham }]}>
                        {nation.nationality}
                      </Text>
                      {!isViewMode && (
                        <TouchableOpacity onPress={() => handleRemoveNationality(nation.nationality)}>
                          <Ionicons name="trash" size={20} color="#EF1A25" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <MainTextInput
                          label="Male"
                          value={nation.male_count}
                          onChangeText={(value) => updateNationalityCount(nation.nationality, 'male', value)}
                          keyboardType="numeric"
                          variant="outlined"
                          disabled={isViewMode}
                          shrink={true}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <MainTextInput
                          label="Female"
                          value={nation.female_count}
                          onChangeText={(value) => updateNationalityCount(nation.nationality, 'female', value)}
                          keyboardType="numeric"
                          variant="outlined"
                          disabled={isViewMode}
                          shrink={true}
                        />
                      </View>
                    </View>
                  </View>
                ))}

                {/* Add Nationality Dropdown */}
                {!isViewMode && (
                  <MainSelectInput
                    label="+ Add Nationality"
                    value={selectedNationality}
                    onChange={(value) => {
                      handleAddNationality(value);
                      setSelectedNationality('');
                    }}
                    options={nationalityOptions
                      .filter((opt) => !nationalities.find((n) => n.nationality === opt))
                      .map((opt) => ({ value: opt, label: opt }))}
                    variant="outlined"
                    placeholder="Select nationality"
                  />
                )}

                {/* Total Guests */}
                <MainTextInput
                  label="Total Guests"
                  value={String(totalGuests)}
                  variant="outlined"
                  disabled={true}
                  shrink={true}
                />

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  {!isViewMode && (
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={isSubmitting ? <LoadingText text="Submitting..." /> : 'Submit'}
                        onPress={handleSave}
                        disabled={isSubmitting}
                      />
                    </View>
                  )}
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      label={isViewMode ? 'Close' : 'Cancel'}
                      onPress={handleCancel}
                      isRed={!isViewMode}
                    />
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        label="SUBMIT REPORT"
        description={
          mode === 'add'
            ? `Submit report for ${formatDate(formData.check_in_date)}?`
            : `Edit report for ${formatDate(formData.check_in_date)}?`
        }
        confirmButtonLabel="Yes, submit"
        cancelButtonLabel="No, nevermind"
        onConfirm={handleConfirmSave}
      />

      {/* Success Notification Modal */}
      <NotificationModal
        open={openNotificationModal}
        label={mode === 'add' ? 'GUEST LOG SUCCESSFULLY ADDED' : 'GUEST LOG SUCCESSFULLY UPDATED'}
        description={
          mode === 'add' 
            ? 'Guest log has been submitted successfully' 
            : 'Guest log has been edited successfully.'
        }
        onClose={() => {
          setOpenNotificationModal(false);
          onClose();
        }}
      />

      {/* Loading Snackbar */}
      <LoadingSnackbar
        open={isSubmitting}
        message={mode === 'edit' ? 'Updating report...' : 'Submitting report...'}
      />

      {/* Error Snackbar */}
      <MainSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        severity="error"
        onClose={() => setErrorSnackbar({ open: false, message: '' })}
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
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    position: 'relative',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionSpacing: {
    height: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  foreignNationalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonWrapper: {
    flex: 1,
  },
});