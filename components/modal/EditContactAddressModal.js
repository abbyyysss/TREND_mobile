import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from './NotificationModal';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from '@/context/AuthContext';
import { fetchProvinces, fetchCities, fetchBarangays } from '@/services/LocationService';
import { updateCurrentUser } from '@/services/AuthService';

export default function EditContactAddressModal({ open, onClose }) {
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();
  const { user, setUser } = useAuth();
  const profile = user?.user_profile || {};
  const userVal = user?.user_profile?.user || {};

  // ✅ States
  const [contact, setContact] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [regionCode, setRegionCode] = useState('070000000');
  const [provinceCode, setProvinceCode] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [barangayCode, setBarangayCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  // Snackbar system
  const [snackQueue, setSnackQueue] = useState([]);
  const [currentSnack, setCurrentSnack] = useState(null);

  const showSnackbar = (message, severity = 'error') => {
    const id = Date.now();
    setSnackQueue((prev) => [...prev, { id, message, severity }]);
  };

  useEffect(() => {
    if (!currentSnack && snackQueue.length > 0) {
      const [next, ...rest] = snackQueue;
      setCurrentSnack(next);
      setSnackQueue(rest);
    }
  }, [snackQueue, currentSnack]);

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setCurrentSnack(null);
  };

  // ✅ Preload existing values
  useEffect(() => {
    if (!profile || !open) return;
    setContact(profile.contact_person || '');
    setContactNum(userVal.contact_num || '');
    setStreetAddress(profile.street_address || '');
  }, [profile, open]);

  // ✅ Load provinces
  useEffect(() => {
    async function loadProvinces() {
      try {
        const provinces = await fetchProvinces(regionCode);
        const mapped = provinces.map((p) => ({ value: p.code, label: p.name }));
        setProvinceOptions(mapped);
        if (profile.province)
          setProvinceCode(mapped.find((p) => p.label === profile.province)?.value || '');
      } catch (err) {
        console.error('Failed to load provinces:', err);
      }
    }
    if (open) loadProvinces();
  }, [regionCode, open]);

  // ✅ Load cities
  useEffect(() => {
    async function loadCities() {
      if (!provinceCode) return;
      try {
        const cities = await fetchCities(regionCode, provinceCode);
        const mapped = cities.map((c) => ({ value: c.code, label: c.name }));
        setCityOptions(mapped);
        if (profile.city_municipality)
          setCityCode(mapped.find((c) => c.label === profile.city_municipality)?.value || '');
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    }
    loadCities();
  }, [provinceCode]);

  // ✅ Load barangays
  useEffect(() => {
    async function loadBarangaysData() {
      if (!cityCode) return;
      try {
        const barangays = await fetchBarangays(cityCode);
        const mapped = barangays.map((b) => ({ value: b.code, label: b.name }));
        setBarangayOptions(mapped);
        if (profile.barangay)
          setBarangayCode(mapped.find((b) => b.label === profile.barangay)?.value || '');
      } catch (err) {
        console.error('Failed to load barangays:', err);
      }
    }
    loadBarangaysData();
  }, [cityCode]);

  // ✅ Validation
  const validateInputs = () => {
    const newErrors = {};
    if (!contact.trim()) newErrors.contact = 'Contact person is required.';
    if (!contactNum.trim()) newErrors.contactNum = 'Contact number is required.';
    if (contactNum.length > 11) newErrors.contactNum = 'Contact number must be 11 digits max.';
    if (!provinceCode) newErrors.province = 'Province selection is required.';
    if (!cityCode) newErrors.city = 'City/Municipality selection is required.';
    if (!barangayCode) newErrors.barangay = 'Barangay selection is required.';
    if (!streetAddress.trim()) newErrors.street = 'Street address is required.';

    setErrors(newErrors);
    Object.values(newErrors).forEach((msg) => showSnackbar(msg, 'error'));
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save handler
  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);

      const regionName = 'Region 7';
      const provinceName = provinceOptions.find((p) => p.value === provinceCode)?.label || '';
      const cityName = cityOptions.find((c) => c.value === cityCode)?.label || '';
      const barangayName = barangayOptions.find((b) => b.value === barangayCode)?.label || '';

      const payload = {
        contact_person: contact,
        contact_num: contactNum,
        street_address: streetAddress,
        region: regionName,
        province: provinceName,
        city_municipality: cityName,
        barangay: barangayName,
      };

      console.log('📦 Sending contact & address payload:', payload);

      const res = await updateCurrentUser(payload);
      console.log('✅ Update success:', res);

      setUser((prev) => ({
        ...prev,
        user_profile: res.user_profile,
      }));

      setShowSuccessModal(true);
    } catch (error) {
      const errData = error.response?.data;
      console.error('❌ Update failed:', errData || error);

      const backendErrors = {};
      if (errData && typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${field.replaceAll('_', ' ')}: ${msg}`, 'error');
        });
      } else {
        showSnackbar('Failed to update contact and address. Please try again.', 'error');
      }

      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => onClose();
  const regionOptions = [{ value: '070000000', label: 'Region 7' }];

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: '#DADADA',
      maxWidth: 650,
      width: '90%',
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
    scrollContent: {
      flexGrow: 1,
    },
    headerContainer: {
      width: '100%',
    },
    bodyContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom: 40,
    },
    titleContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      color: isDark ? '#d5d6d7' : '#313638',
      fontFamily: fonts.gotham,
      fontWeight: typography.weight.semibold,
      marginBottom: 4,
    },
    note: {
      fontSize: 14,
      color: '#828282',
      fontFamily: fonts.gotham,
    },
    formContainer: {
      width: '100%',
      paddingHorizontal: '5%',
      gap: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      gap: 15,
      paddingHorizontal: 20,
      marginTop: 10,
    },
    buttonWrapper: {
      flex: 1,
    },
  });

  return (
    <>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <PrimaryModalHeader onClose={onClose} label="Edit Contact & Address" />
            </View>

            {/* Body */}
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.bodyContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Contact and Address</Text>
                  <Text style={styles.note}>
                    Note: Changes to address will need DOT approval before being implemented.
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  {/* Contact Person */}
                  <MainTextInput
                    label="Contact Person"
                    value={contact}
                    onChange={setContact}
                    error={Boolean(errors.contact)}
                    helperText={errors.contact || ''}
                    size="small"
                    shrink={true}
                    variant="outlined"
                  />

                  {/* Contact Number */}
                  <MainTextInput
                    label="Contact Number"
                    value={contactNum}
                    type="number"
                    onChange={setContactNum}
                    error={Boolean(errors.contactNum)}
                    helperText={errors.contactNum || ''}
                    size="small"
                    shrink={true}
                    variant="outlined"
                  />

                  {/* Region */}
                  <MainSelectInput
                    label="Region"
                    value={regionCode}
                    variant="outlined"
                    options={regionOptions}
                    onChange={(val) => {
                      setRegionCode(val);
                      setProvinceCode('');
                      setCityCode('');
                      setBarangayCode('');
                      setProvinceOptions([]);
                      setCityOptions([]);
                      setBarangayOptions([]);
                    }}
                    size="small"
                    shrink={true}
                  />

                  {/* Province */}
                  <MainSelectInput
                    label="Province"
                    value={provinceCode}
                    variant="outlined"
                    onChange={(val) => {
                      setProvinceCode(val);
                      setCityCode('');
                      setBarangayCode('');
                      setCityOptions([]);
                      setBarangayOptions([]);
                    }}
                    options={provinceOptions}
                    error={Boolean(errors.province)}
                    helperText={errors.province || ''}
                    size="small"
                    shrink={true}
                  />

                  {/* City/Municipality */}
                  <MainSelectInput
                    label="City/Municipality"
                    value={cityCode}
                    variant="outlined"
                    onChange={(val) => {
                      setCityCode(val);
                      setBarangayCode('');
                      setBarangayOptions([]);
                    }}
                    options={cityOptions}
                    error={Boolean(errors.city)}
                    helperText={errors.city || ''}
                    size="small"
                    shrink={true}
                  />

                  {/* Barangay */}
                  <MainSelectInput
                    label="Barangay"
                    value={barangayCode}
                    variant="outlined"
                    onChange={setBarangayCode}
                    options={barangayOptions}
                    error={Boolean(errors.barangay)}
                    helperText={errors.barangay || ''}
                    size="small"
                    shrink={true}
                  />

                  {/* Street Address */}
                  <MainTextInput
                    label="Street Address"
                    value={streetAddress}
                    onChange={setStreetAddress}
                    error={Boolean(errors.street)}
                    helperText={errors.street || ''}
                    size="small"
                    shrink={true}
                    variant="outlined"
                  />

                  {/* Buttons */}
                  <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={loading ? <LoadingText text="SAVING..." /> : 'SAVE CHANGES'}
                        onPress={handleSaveChanges}
                        disabled={loading}
                        fontSize={13}
                        paddingVertical={7}
                        paddingHorizontal={10}
                        fullWidth={true}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label="CANCEL"
                        onPress={handleCancel}
                        isRed={true}
                        fontSize={13}
                        paddingVertical={7}
                        paddingHorizontal={10}
                        fullWidth={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <NotificationModal
        open={showSuccessModal}
        label="CONTACT & ADDRESS UPDATED SUCCESSFULLY"
        description="Your contact and address has been submitted. Changes require DOT approval to take effect."
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />

      {currentSnack && (
        <MainSnackbar
          key={currentSnack.id}
          open={true}
          message={currentSnack.message}
          severity={currentSnack.severity}
          onClose={handleCloseSnackbar}
          duration={4000}
        />
      )}

      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />
    </>
  );
}