import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
// import { useAuth } from '@/context/authContext';
// import { fetchProvinces, fetchCities, fetchBarangays } from '@/services/locationService';
// import { updateCurrentUser } from '@/services/authService';
import PrimaryModalHeader from '../header/PrimaryModalHeader';
import MainTextInput from '../input/MainTextInput';
import MainSelectInput from '../input/MainSelectInput';
import DefaultButton from '../button/DefaultButton';
import NotificationModal from '../modal/NotificationModal';
import MainSnackbar from '../snackbar/MainSnackbar';
import LoadingText from '../loading/LoadingText';

export default function EditContactAddressModal({ open, onClose }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const { user, setUser } = useAuth();
  // const profile = user?.user_profile || {};
  // const userVal = user?.user_profile?.user || {};

  // Mock data for UI testing
  const profile = {
    contact_person: 'John Doe',
    street_address: '123 Main Street',
    region: 'Region 7',
    province: 'Cebu',
    city_municipality: 'Cebu City',
    barangay: 'Lahug',
  };
  const userVal = {
    contact_num: '09123456789',
  };

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

  const handleCloseSnackbar = () => {
    setCurrentSnack(null);
  };

  // Preload existing values
  useEffect(() => {
    if (!profile || !open) return;
    setContact(profile.contact_person || '');
    setContactNum(userVal.contact_num || '');
    setStreetAddress(profile.street_address || '');
  }, [profile, open]);

  // Load provinces (commented out)
  // useEffect(() => {
  //   async function loadProvinces() {
  //     try {
  //       const provinces = await fetchProvinces(regionCode);
  //       const mapped = provinces.map((p) => ({ value: p.code, label: p.name }));
  //       setProvinceOptions(mapped);
  //       if (profile.province)
  //         setProvinceCode(mapped.find((p) => p.label === profile.province)?.value || '');
  //     } catch (err) {
  //       console.error('Failed to load provinces:', err);
  //     }
  //   }
  //   if (open) loadProvinces();
  // }, [regionCode, open]);

  // Mock province options for UI testing
  useEffect(() => {
    if (open) {
      setProvinceOptions([
        { value: '0722', label: 'Cebu' },
        { value: '0726', label: 'Bohol' },
        { value: '0746', label: 'Negros Oriental' },
      ]);
    }
  }, [open]);

  // Load cities (commented out)
  // useEffect(() => {
  //   async function loadCities() {
  //     if (!provinceCode) return;
  //     try {
  //       const cities = await fetchCities(regionCode, provinceCode);
  //       const mapped = cities.map((c) => ({ value: c.code, label: c.name }));
  //       setCityOptions(mapped);
  //       if (profile.city_municipality)
  //         setCityCode(mapped.find((c) => c.label === profile.city_municipality)?.value || '');
  //     } catch (err) {
  //       console.error('Failed to load cities:', err);
  //     }
  //   }
  //   loadCities();
  // }, [provinceCode]);

  // Mock city options
  useEffect(() => {
    if (provinceCode) {
      setCityOptions([
        { value: '072217', label: 'Cebu City' },
        { value: '072234', label: 'Mandaue City' },
        { value: '072246', label: 'Lapu-Lapu City' },
      ]);
    }
  }, [provinceCode]);

  // Load barangays (commented out)
  // useEffect(() => {
  //   async function loadBarangaysData() {
  //     if (!cityCode) return;
  //     try {
  //       const barangays = await fetchBarangays(cityCode);
  //       const mapped = barangays.map((b) => ({ value: b.code, label: b.name }));
  //       setBarangayOptions(mapped);
  //       if (profile.barangay)
  //         setBarangayCode(mapped.find((b) => b.label === profile.barangay)?.value || '');
  //     } catch (err) {
  //       console.error('Failed to load barangays:', err);
  //     }
  //   }
  //   loadBarangaysData();
  // }, [cityCode]);

  // Mock barangay options
  useEffect(() => {
    if (cityCode) {
      setBarangayOptions([
        { value: '072217001', label: 'Lahug' },
        { value: '072217002', label: 'Apas' },
        { value: '072217003', label: 'Capitol Site' },
      ]);
    }
  }, [cityCode]);

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

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    // API call commented out
    // try {
    //   setLoading(true);
    //   const regionName = 'Region 7';
    //   const provinceName = provinceOptions.find((p) => p.value === provinceCode)?.label || '';
    //   const cityName = cityOptions.find((c) => c.value === cityCode)?.label || '';
    //   const barangayName = barangayOptions.find((b) => b.value === barangayCode)?.label || '';
    //   const payload = {
    //     contact_person: contact,
    //     contact_num: contactNum,
    //     street_address: streetAddress,
    //     region: regionName,
    //     province: provinceName,
    //     city_municipality: cityName,
    //     barangay: barangayName,
    //   };
    //   const res = await updateCurrentUser(payload);
    //   setUser((prev) => ({
    //     ...prev,
    //     user_profile: res.user_profile,
    //   }));
    //   setShowSuccessModal(true);
    // } catch (error) {
    //   const errData = error.response?.data;
    //   console.error('❌ Update failed:', errData || error);
    //   const backendErrors = {};
    //   if (errData && typeof errData === 'object') {
    //     Object.entries(errData).forEach(([field, messages]) => {
    //       const msg = Array.isArray(messages) ? messages[0] : String(messages);
    //       backendErrors[field] = msg;
    //       showSnackbar(`${field.replaceAll('_', ' ')}: ${msg}`, 'error');
    //     });
    //   } else {
    //     showSnackbar('Failed to update contact and address. Please try again.', 'error');
    //   }
    //   setErrors(backendErrors);
    // } finally {
    //   setLoading(false);
    // }

    // Mock success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleCancel = () => onClose();

  const regionOptions = [{ value: '070000000', label: 'Region 7' }];

  const styles = createStyles(isDark);

  return (
    <>
      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <PrimaryModalHeader onClose={onClose} label="Edit Contact & Address" />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.content}>
                <View>
                  <Text style={styles.title}>Contact and Address</Text>
                  <Text style={styles.note}>
                    Note: Changes to address will need DOT approval before being implemented.
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <MainTextInput
                    label="Contact Person"
                    value={contact}
                    onChange={setContact}
                    error={Boolean(errors.contact)}
                    helperText={errors.contact || ''}
                  />

                  <MainTextInput
                    label="Contact Number"
                    value={contactNum}
                    onChange={setContactNum}
                    keyboardType="numeric"
                    error={Boolean(errors.contactNum)}
                    helperText={errors.contactNum || ''}
                  />

                  <MainSelectInput
                    label="Region"
                    value={regionCode}
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
                  />

                  <MainSelectInput
                    label="Province"
                    value={provinceCode}
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
                  />

                  <MainSelectInput
                    label="City/Municipality"
                    value={cityCode}
                    onChange={(val) => {
                      setCityCode(val);
                      setBarangayCode('');
                      setBarangayOptions([]);
                    }}
                    options={cityOptions}
                    error={Boolean(errors.city)}
                    helperText={errors.city || ''}
                  />

                  <MainSelectInput
                    label="Barangay"
                    value={barangayCode}
                    onChange={setBarangayCode}
                    options={barangayOptions}
                    error={Boolean(errors.barangay)}
                    helperText={errors.barangay || ''}
                  />

                  <MainTextInput
                    label="Street Address"
                    value={streetAddress}
                    onChange={setStreetAddress}
                    error={Boolean(errors.street)}
                    helperText={errors.street || ''}
                  />

                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label={loading ? <LoadingText text="SAVING..." /> : 'SAVE CHANGES'}
                        onPress={handleSaveChanges}
                        disabled={loading}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <DefaultButton
                        label="CANCEL"
                        onPress={handleCancel}
                        isRed={true}
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
          open={true}
          message={currentSnack.message}
          severity={currentSnack.severity}
          onClose={handleCloseSnackbar}
          duration={4000}
        />
      )}
    </>
  );
}

const createStyles = (isDark) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxWidth: 650,
      maxHeight: '90%',
      backgroundColor: isDark ? '#000' : '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#DADADA',
      overflow: 'hidden',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: 20,
      gap: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#d5d6d7' : '#313638',
    },
    note: {
      fontSize: 14,
      color: '#828282',
      marginTop: 5,
    },
    formContainer: {
      gap: 20,
      paddingHorizontal: '10%',
    },
    buttonContainer: {
      flexDirection: 'column',
      gap: 10,
      paddingHorizontal: 20,
    },
    buttonWrapper: {
      flex: 1,
    },
  });