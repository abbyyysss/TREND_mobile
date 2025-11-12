import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
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

export default function GuestLogModal({ 
  open, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'view'
  rowData = null,
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for dropdowns
  const roomTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe Room' },
  ];

  const nationalityOptions = [
    'United States',
    'Japan',
    'South Korea',
    'China',
    'Singapore',
    'Australia',
    'United Kingdom',
    'Canada',
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const [checkInDate, setCheckInDate] = useState(formattedDate);
  const [roomId, setRoomId] = useState('');
  const [roomType, setRoomType] = useState('');
  const [nightsStaying, setNightsStaying] = useState('');

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

  // Load data when modal opens
  useEffect(() => {
    if (open && rowData && mode !== 'add') {
      setCheckInDate(rowData.checkInDate || formattedDate);
      setRoomId(rowData.room_id || '');
      setRoomType(rowData.roomType || '');
      setNightsStaying(rowData.lengthOfStay?.toString() || '');

      if (rowData.guestCounts) {
        setGuestCounts({
          filipinoMale: String(rowData.guestCounts.filipinoMale || 0),
          filipinoFemale: String(rowData.guestCounts.filipinoFemale || 0),
          foreignMale: String(rowData.guestCounts.foreignMale || 0),
          foreignFemale: String(rowData.guestCounts.foreignFemale || 0),
          ofwMale: String(rowData.guestCounts.ofwMale || 0),
          ofwFemale: String(rowData.guestCounts.ofwFemale || 0),
        });
      }

      if (rowData.nationalities) {
        setNationalities(rowData.nationalities);
      }
    } else if (open && mode === 'add') {
      resetForm();
    }
  }, [open, mode, rowData]);

  const resetForm = () => {
    setCheckInDate(formattedDate);
    setRoomId('');
    setRoomType('');
    setNightsStaying('');
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
    const safeValue = Math.max(0, Number(value) || 0).toString();
    setNationalities((prev) =>
      prev.map((nation) =>
        nation.nationality === nationality
          ? { ...nation, [`${gender}_count`]: safeValue }
          : nation
      )
    );
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

  const handleGuestCountChange = (field, value) => {
    const safeValue = Math.max(0, Number(value) || 0).toString();
    setGuestCounts({
      ...guestCounts,
      [field]: safeValue,
    });

    // Clear error if exists
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!roomId) newErrors.roomId = 'Room ID is required';
    if (!roomType) newErrors.roomType = 'Room type is required';
    if (!nightsStaying) newErrors.nightsStaying = 'Number of nights is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setOpenConfirmationModal(true);
  };

  const handleConfirmSave = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', {
        checkInDate,
        roomId,
        roomType,
        nightsStaying,
        guestCounts,
        nationalities,
        totalGuests,
      });
      
      setIsSubmitting(false);
      setOpenConfirmationModal(false);
      setOpenNotificationModal(true);
    }, 2000);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isViewMode = mode === 'view';

  return (
    <>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text style={[styles.title, isDark && styles.titleDark]}>
                Guest Log for
              </Text>

              {/* Check-in Date */}
              <MainTextInput
                value={checkInDate}
                onChangeText={(value) => {
                  setCheckInDate(value);
                  if (errors.checkInDate && value.trim() !== '') {
                    setErrors({ ...errors, checkInDate: null });
                  }
                }}
                variant="outlined"
                disabled={true}
              />

              {/* Room ID */}
              <MainTextInput
                label="Room ID"
                value={roomId}
                onChangeText={(value) => {
                  setRoomId(value);
                  if (errors.roomId && value.trim() !== '') {
                    setErrors({ ...errors, roomId: null });
                  }
                }}
                variant="outlined"
                disabled={isViewMode}
                error={errors.roomId}
              />

              {/* Room Type Dropdown */}
              <MainSelectInput
                label="Room Type"
                value={roomType}
                onChange={(value) => {
                  setRoomType(value);
                  if (errors.roomType && value) {
                    setErrors({ ...errors, roomType: null });
                  }
                }}
                options={roomTypes}
                disabled={isViewMode}
                variant="outlined"
                error={errors.roomType}
              />

              {/* How many nights */}
              <MainTextInput
                label="How many nights are they staying for?"
                value={nightsStaying}
                onChangeText={(value) => {
                  setNightsStaying(value);
                  if (errors.nightsStaying && value.trim() !== '') {
                    setErrors({ ...errors, nightsStaying: null });
                  }
                }}
                keyboardType="numeric"
                variant="outlined"
                disabled={isViewMode}
                error={errors.nightsStaying}
              />

              {/* Philippine Residents Header */}
              <FullUnderlineTitle text="Philippine Residents" />
              <View style={styles.sectionSpacing} />

              {/* Filipino Nationality */}
              <Text style={[styles.subsectionTitle, isDark && styles.subsectionTitleDark]}>
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
                    style={styles.noBottomMargin}
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
                    style={styles.noBottomMargin}
                  />
                </View>
              </View>

              {/* Foreign Nationality */}
              <View style={styles.foreignNationalityHeader}>
                <Text style={[styles.subsectionTitle, isDark && styles.subsectionTitleDark]}>
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
                    style={styles.noBottomMargin}
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
                    style={styles.noBottomMargin}
                  />
                </View>
              </View>

              {/* OFWs Section */}
              <FullUnderlineTitle text="Overseas Filipino Workers" />
              <View style={styles.sectionSpacing} />
              
              <Text style={[styles.subsectionTitle, isDark && styles.subsectionTitleDark]}>
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
                    style={styles.noBottomMargin}
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
                    style={styles.noBottomMargin}
                  />
                </View>
              </View>

              {/* Non-Philippine Residents */}
              <FullUnderlineTitle text="Non-Philippine Residents" />
              <View style={styles.sectionSpacing} />

              {nationalities.map((nation) => (
                <View key={nation.nationality}>
                  <View style={styles.foreignNationalityHeader}>
                    <Text style={[styles.subsectionTitle, isDark && styles.subsectionTitleDark]}>
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
                        style={styles.noBottomMargin}
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
                        style={styles.noBottomMargin}
                      />
                    </View>
                  </View>
                </View>
              ))}

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
              />

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {!isViewMode && (
                  <View style={styles.buttonWrapper}>
                    <DefaultButton
                      label={isSubmitting ? <LoadingText text="Submitting..." /> : "Submit"}
                      onPress={handleSave}
                      disabled={isSubmitting}
                      style={styles.saveButton}
                    />
                  </View>
                )}
                <View style={styles.buttonWrapper}>
                  <DefaultButton
                    label={isViewMode ? 'Close' : 'Cancel'}
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                </View>
              </View>
            </ScrollView>
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
            ? `Submit report for ${checkInDate}?`
            : `Edit report for ${checkInDate}?`
        }
        confirmButtonLabel="Yes, submit"
        cancelButtonLabel="No, nevermind"
        onConfirm={handleConfirmSave}
      />

      {/* Success Notification Modal */}
      <NotificationModal
        open={openNotificationModal}
        label="SUCCESS"
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    position: 'relative',
  },
  modalContentDark: {
    backgroundColor: '#1a1a1a',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  titleDark: {
    color: '#ffffff',
  },
  sectionSpacing: {
    height: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  subsectionTitleDark: {
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  noBottomMargin: {
    marginBottom: 0,
  },
  foreignNationalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginLeft: 6,
    padding: 2,
  },
  infoIconText: {
    fontSize: 16,
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#EF1A25',
  },
  cancelButtonText: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#D4A053',
  },
  confirmationModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmationTextDark: {
    color: '#cccccc',
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmationCancelButton: {
    backgroundColor: '#E8E8E8',
  },
  successIconContainer: {
    marginBottom: 16,
  },
});