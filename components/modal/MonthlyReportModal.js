import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainTextInput from '@/components/input/MainTextInput';
import FullUnderlineTitle from '@/components/text/FullUnderlineTitle';
import DefaultButton from '@/components/button/DefaultButton';
import MainSelectInput from '@/components/input/MainSelectInput';
import LoadingText from '../loading/LoadingText';
import InformationButton from '@/components/button/InformationButton';
import ConfirmationModal from '../modal/ConfirmationModal';
import NotificationModal from '../modal/NotificationModal';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import LoadingSnackbar from '../snackbar/LoadingSnackbar';

// Import services and context
// import reportService from '@/services/reportService';
// import { useAuth } from '@/context/authContext';

export default function MonthlyReportModal({
  open,
  onClose,
  mode,
  rowData,
  data,
  setData,
  page,
  rowsPerPage,
  setTotalCount,
  // refreshLogs,
}) {
  // const { user, loading, role } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const formatted = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;

    return {
      month: formatted,
      ae_profile_id: null,
      philippine_guests: '',
      philippine_guest_nights: '',
      foreign_guests: '',
      foreign_guest_nights: '',
      philippine_ofw_guests: '',
      philippine_ofw_nights: '',
      rooms_occupied: '',
    };
  });

  const [guestCounts, setGuestCounts] = useState({
    filipinoMale: 0,
    filipinoFemale: 0,
    filipinoTotal: 0,
    foreignMale: 0,
    foreignFemale: 0,
    foreignTotal: 0,
    ofwMale: 0,
    ofwFemale: 0,
    ofwTotal: 0,
  });

  const [fieldModes, setFieldModes] = useState({
    filipino: 'none',
    foreign: 'none',
    ofw: 'none',
  });

  const [nationalityFieldModes, setNationalityFieldModes] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState('');
  const [totalGuests, setTotalGuests] = useState(0);

  const [errors, setErrors] = useState({});

  const isViewMode = mode === 'view';

  const handleFormDataChange = (field) => (value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setFormData({ ...formData, [field]: numValue });

    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // const fetchReportData = async (reportId) => {
  //   setIsFetchingReport(true);
  //   try {
  //     const reportData = await reportService.fetchMonthlyReportById(reportId);

  //     setFormData({
  //       month: reportData.month || '',
  //       ae_profile_id: reportData.ae_profile?.id || reportData.ae_profile,
  //       philippine_guests: reportData.philippine_guests || '',
  //       philippine_guest_nights: reportData.philippine_guest_nights || '',
  //       foreign_guests: reportData.foreign_guests || '',
  //       foreign_guest_nights: reportData.foreign_guest_nights || '',
  //       philippine_ofw_guests: reportData.philippine_ofw_guests || '',
  //       philippine_ofw_nights: reportData.philippine_ofw_nights || '',
  //       rooms_occupied: reportData.rooms_occupied || '',
  //     });

  //     const updatedGuestCounts = {
  //       filipinoMale: 0,
  //       filipinoFemale: 0,
  //       filipinoTotal: 0,
  //       foreignMale: 0,
  //       foreignFemale: 0,
  //       foreignTotal: 0,
  //       ofwMale: 0,
  //       ofwFemale: 0,
  //       ofwTotal: 0,
  //     };

  //     const updatedFieldModes = {
  //       filipino: 'none',
  //       foreign: 'none',
  //       ofw: 'none',
  //     };

  //     const updatedNationalityFieldModes = {};
  //     const otherNationalities = [];

  //     (reportData.nationality_breakdown || []).forEach((nat) => {
  //       const nationalityValue = nat.country;

  //       if (nationalityValue === 'Philippines') {
  //         if (nat.filipino_subcategory === 'Non-OFW') {
  //           const maleCount = Number(nat.male_count) || 0;
  //           const femaleCount = Number(nat.female_count) || 0;
  //           updatedGuestCounts.filipinoMale = maleCount;
  //           updatedGuestCounts.filipinoFemale = femaleCount;
  //           updatedGuestCounts.filipinoTotal = Number(nat.total) || 0;

  //           if (maleCount > 0 || femaleCount > 0) {
  //             updatedFieldModes.filipino = 'disaggregated';
  //           } else if (updatedGuestCounts.filipinoTotal > 0) {
  //             updatedFieldModes.filipino = 'total';
  //           }
  //         } else if (nat.filipino_subcategory === 'OFW') {
  //           const maleCount = Number(nat.male_count) || 0;
  //           const femaleCount = Number(nat.female_count) || 0;
  //           updatedGuestCounts.ofwMale = maleCount;
  //           updatedGuestCounts.ofwFemale = femaleCount;
  //           updatedGuestCounts.ofwTotal = Number(nat.total) || 0;

  //           if (maleCount > 0 || femaleCount > 0) {
  //             updatedFieldModes.ofw = 'disaggregated';
  //           } else if (updatedGuestCounts.ofwTotal > 0) {
  //             updatedFieldModes.ofw = 'total';
  //           }
  //         } else if (nat.filipino_subcategory === 'Foreigner') {
  //           const maleCount = Number(nat.male_count) || 0;
  //           const femaleCount = Number(nat.female_count) || 0;
  //           updatedGuestCounts.foreignMale = maleCount;
  //           updatedGuestCounts.foreignFemale = femaleCount;
  //           updatedGuestCounts.foreignTotal = Number(nat.total) || 0;

  //           if (maleCount > 0 || femaleCount > 0) {
  //             updatedFieldModes.foreign = 'disaggregated';
  //           } else if (updatedGuestCounts.foreignTotal > 0) {
  //             updatedFieldModes.foreign = 'total';
  //           }
  //         }
  //       } else {
  //         const maleCount = Number(nat.male_count) || 0;
  //         const femaleCount = Number(nat.female_count) || 0;
  //         const totalCount = Number(nat.total) || 0;

  //         if (maleCount > 0 || femaleCount > 0) {
  //           updatedNationalityFieldModes[nationalityValue] = 'disaggregated';
  //         } else if (totalCount > 0) {
  //           updatedNationalityFieldModes[nationalityValue] = 'total';
  //         } else {
  //           updatedNationalityFieldModes[nationalityValue] = 'none';
  //         }

  //         otherNationalities.push({
  //           nationality: nationalityValue,
  //           filipino_subcategory: null,
  //           male_count: maleCount,
  //           female_count: femaleCount,
  //           total_count: totalCount,
  //         });
  //       }
  //     });

  //     setGuestCounts(updatedGuestCounts);
  //     setFieldModes(updatedFieldModes);
  //     setNationalityFieldModes(updatedNationalityFieldModes);
  //     setNationalities(otherNationalities);
  //   } catch (error) {
  //     console.error('Error fetching report data:', error);
  //   } finally {
  //     setIsFetchingReport(false);
  //   }
  // };

  // useEffect(() => {
  //   if (open) {
  //     if ((mode === 'edit' || mode === 'add') && rowData?.id) {
  //       fetchReportData(rowData.id);
  //     } else if (mode === 'view' && rowData) {
  //       const updatedGuestCounts = {
  //         filipinoMale: 0,
  //         filipinoFemale: 0,
  //         filipinoTotal: 0,
  //         foreignMale: 0,
  //         foreignFemale: 0,
  //         foreignTotal: 0,
  //         ofwMale: 0,
  //         ofwFemale: 0,
  //         ofwTotal: 0,
  //       };

  //       const updatedFieldModes = {
  //         filipino: 'none',
  //         foreign: 'none',
  //         ofw: 'none',
  //       };

  //       const updatedNationalityFieldModes = {};
  //       const otherNationalities = [];

  //       (rowData.nationalities || []).forEach((nat) => {
  //         const nationalityValue = nat.nationality_name;

  //         if (nationalityValue === 'Philippines') {
  //           if (nat.filipino_subcategory === 'Non-OFW') {
  //             const maleCount = Number(nat.male_count) || 0;
  //             const femaleCount = Number(nat.female_count) || 0;
  //             updatedGuestCounts.filipinoMale = maleCount;
  //             updatedGuestCounts.filipinoFemale = femaleCount;
  //             updatedGuestCounts.filipinoTotal = maleCount + femaleCount;

  //             if (maleCount > 0 || femaleCount > 0) {
  //               updatedFieldModes.filipino = 'disaggregated';
  //             } else if (updatedGuestCounts.filipinoTotal > 0) {
  //               updatedFieldModes.filipino = 'total';
  //             }
  //           } else if (nat.filipino_subcategory === 'OFW') {
  //             const maleCount = Number(nat.male_count) || 0;
  //             const femaleCount = Number(nat.female_count) || 0;
  //             updatedGuestCounts.ofwMale = maleCount;
  //             updatedGuestCounts.ofwFemale = femaleCount;
  //             updatedGuestCounts.ofwTotal = maleCount + femaleCount;

  //             if (maleCount > 0 || femaleCount > 0) {
  //               updatedFieldModes.ofw = 'disaggregated';
  //             } else if (updatedGuestCounts.ofwTotal > 0) {
  //               updatedFieldModes.ofw = 'total';
  //             }
  //           } else if (nat.filipino_subcategory === 'Foreigner') {
  //             const maleCount = Number(nat.male_count) || 0;
  //             const femaleCount = Number(nat.female_count) || 0;
  //             updatedGuestCounts.foreignMale = maleCount;
  //             updatedGuestCounts.foreignFemale = femaleCount;
  //             updatedGuestCounts.foreignTotal = maleCount + femaleCount;

  //             if (maleCount > 0 || femaleCount > 0) {
  //               updatedFieldModes.foreign = 'disaggregated';
  //             } else if (updatedGuestCounts.foreignTotal > 0) {
  //               updatedFieldModes.foreign = 'total';
  //             }
  //           }
  //         } else {
  //           const maleCount = Number(nat.male_count) || 0;
  //           const femaleCount = Number(nat.female_count) || 0;
  //           const totalCount = maleCount + femaleCount;

  //           if (maleCount > 0 || femaleCount > 0) {
  //             updatedNationalityFieldModes[nationalityValue] = 'disaggregated';
  //           } else if (totalCount > 0) {
  //             updatedNationalityFieldModes[nationalityValue] = 'total';
  //           } else {
  //             updatedNationalityFieldModes[nationalityValue] = 'none';
  //           }

  //           otherNationalities.push({
  //             nationality: nationalityValue,
  //             filipino_subcategory: null,
  //             male_count: maleCount,
  //             female_count: femaleCount,
  //             total_count: totalCount,
  //           });
  //         }
  //       });

  //       setGuestCounts(updatedGuestCounts);
  //       setFieldModes(updatedFieldModes);
  //       setNationalityFieldModes(updatedNationalityFieldModes);
  //       setNationalities(otherNationalities);
  //     } else {
  //       resetForm();
  //     }
  //   } else {
  //     resetForm();
  //   }
  // }, [open, mode]);

  // const resetForm = () => {
  //   const now = new Date();
  //   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  //   const formatted = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;

  //   setFormData({
  //     month: formatted,
  //     ae_profile_id: null,
  //     philippine_guests: '',
  //     philippine_guest_nights: '',
  //     foreign_guests: '',
  //     foreign_guest_nights: '',
  //     philippine_ofw_guests: '',
  //     philippine_ofw_nights: '',
  //     rooms_occupied: '',
  //   });
  //   setGuestCounts({
  //     filipinoMale: 0,
  //     filipinoFemale: 0,
  //     filipinoTotal: 0,
  //     foreignMale: 0,
  //     foreignFemale: 0,
  //     foreignTotal: 0,
  //     ofwMale: 0,
  //     ofwFemale: 0,
  //     ofwTotal: 0,
  //   });
  //   setFieldModes({
  //     filipino: 'none',
  //     foreign: 'none',
  //     ofw: 'none',
  //   });
  //   setNationalityFieldModes({});
  //   setNationalities([]);
  //   setErrors({});
  // };

  // useEffect(() => {
  //   let total =
  //     Number(guestCounts.filipinoTotal || 0) +
  //     Number(guestCounts.foreignTotal || 0) +
  //     Number(guestCounts.ofwTotal || 0);

  //   nationalities.forEach((n) => {
  //     const totalCount = Number(n.total_count || 0);
  //     const disaggregatedTotal = Number(n.male_count || 0) + Number(n.female_count || 0);
  //     const nationalityTotal = totalCount > 0 ? totalCount : disaggregatedTotal;
  //     total += nationalityTotal;
  //   });

  //   setTotalGuests(total);
  // }, [guestCounts, nationalities]);

  // const handleGuestCountChange = (field, type) => (value) => {
  //   const numValue = Math.max(0, Number(value) || 0);

  //   setGuestCounts((prev) => {
  //     const updated = { ...prev, [field]: numValue };
  //     return updated;
  //   });

  //   if (errors[field]) {
  //     setErrors({ ...errors, [field]: null });
  //   }

  //   setFieldModes((prev) => {
  //     const updated = { ...prev };

  //     if (type === 'disaggregated') {
  //       if (field.includes('filipino') && !field.includes('ofw')) {
  //         const maleValue = field === 'filipinoMale' ? numValue : guestCounts.filipinoMale || 0;
  //         const femaleValue = field === 'filipinoFemale' ? numValue : guestCounts.filipinoFemale || 0;

  //         if (maleValue === 0 && femaleValue === 0) {
  //           updated.filipino = 'none';
  //         } else {
  //           updated.filipino = 'disaggregated';
  //         }

  //         setGuestCounts((curr) => ({ ...curr, filipinoTotal: maleValue + femaleValue }));
  //       }
  //       if (field.includes('foreign')) {
  //         const maleValue = field === 'foreignMale' ? numValue : guestCounts.foreignMale || 0;
  //         const femaleValue = field === 'foreignFemale' ? numValue : guestCounts.foreignFemale || 0;

  //         if (maleValue === 0 && femaleValue === 0) {
  //           updated.foreign = 'none';
  //         } else {
  //           updated.foreign = 'disaggregated';
  //         }

  //         setGuestCounts((curr) => ({ ...curr, foreignTotal: maleValue + femaleValue }));
  //       }
  //       if (field.includes('ofw')) {
  //         const maleValue = field === 'ofwMale' ? numValue : guestCounts.ofwMale || 0;
  //         const femaleValue = field === 'ofwFemale' ? numValue : guestCounts.ofwFemale || 0;

  //         if (maleValue === 0 && femaleValue === 0) {
  //           updated.ofw = 'none';
  //         } else {
  //           updated.ofw = 'disaggregated';
  //         }

  //         setGuestCounts((curr) => ({ ...curr, ofwTotal: maleValue + femaleValue }));
  //       }
  //     }

  //     if (type === 'total') {
  //       if (field === 'filipinoTotal') {
  //         if (numValue === 0) {
  //           updated.filipino = 'none';
  //         } else {
  //           updated.filipino = 'total';
  //           setGuestCounts((curr) => ({ ...curr, filipinoMale: 0, filipinoFemale: 0 }));
  //         }
  //       }
  //       if (field === 'foreignTotal') {
  //         if (numValue === 0) {
  //           updated.foreign = 'none';
  //         } else {
  //           updated.foreign = 'total';
  //           setGuestCounts((curr) => ({ ...curr, foreignMale: 0, foreignFemale: 0 }));
  //         }
  //       }
  //       if (field === 'ofwTotal') {
  //         if (numValue === 0) {
  //           updated.ofw = 'none';
  //         } else {
  //           updated.ofw = 'total';
  //           setGuestCounts((curr) => ({ ...curr, ofwMale: 0, ofwFemale: 0 }));
  //         }
  //       }
  //     }

  //     return updated;
  //   });
  // };

  // useEffect(() => {
  //   const loadData = async () => {
  //     if (open) {
  //       setIsLoadingData(true);
  //       try {
  //         const nationalitiesData = await reportService.getNationalities();
  //         setNationalityOptions(nationalitiesData.map((n) => n.country));
  //       } catch (error) {
  //         console.error('Error loading data:', error);
  //       } finally {
  //         setIsLoadingData(false);
  //       }
  //     }
  //   };

  //   loadData();
  // }, [open]);

  // const handleAddNationality = (nation) => {
  //   if (!nation) return;
  //   if (!nationalities.find((n) => n.nationality === nation)) {
  //     setNationalities([
  //       ...nationalities,
  //       { nationality: nation, male_count: 0, female_count: 0, total_count: 0 },
  //     ]);
  //     setNationalityFieldModes((prev) => ({ ...prev, [nation]: 'none' }));
  //   }
  //   setSelectedNationality('');
  // };

  // const handleRemoveNationality = (nation) => {
  //   setNationalities(nationalities.filter((n) => n.nationality !== nation));
  //   setNationalityFieldModes((prev) => {
  //     const updated = { ...prev };
  //     delete updated[nation];
  //     return updated;
  //   });
  // };

  // const updateNationalityCount = (nationality, field, value) => {
  //   const numValue = Math.max(0, Number(value) || 0);

  //   setNationalities((prev) =>
  //     prev.map((n) => (n.nationality === nationality ? { ...n, [field]: numValue } : n))
  //   );

  //   setNationalityFieldModes((prev) => {
  //     const updated = { ...prev };
  //     const currentNationality = nationalities.find((n) => n.nationality === nationality);

  //     if (field === 'total_count') {
  //       if (numValue === 0) {
  //         updated[nationality] = 'none';
  //       } else {
  //         updated[nationality] = 'total';
  //         setNationalities((curr) =>
  //           curr.map((n) =>
  //             n.nationality === nationality ? { ...n, male_count: 0, female_count: 0 } : n
  //           )
  //         );
  //       }
  //     } else if (field === 'male_count' || field === 'female_count') {
  //       const otherField = field === 'male_count' ? 'female_count' : 'male_count';
  //       const otherValue =
  //         field === 'male_count'
  //           ? currentNationality?.female_count || 0
  //           : currentNationality?.male_count || 0;

  //       if (numValue === 0 && otherValue === 0) {
  //         updated[nationality] = 'none';
  //       } else {
  //         updated[nationality] = 'disaggregated';
  //         const totalValue = field === 'male_count' ? numValue + otherValue : otherValue + numValue;
  //         setNationalities((curr) =>
  //           curr.map((n) => (n.nationality === nationality ? { ...n, total_count: totalValue } : n))
  //         );
  //       }
  //     }

  //     return updated;
  //   });
  // };

  // const validate = () => {
  //   const newErrors = {};
  //   if (!formData.philippine_guests) newErrors.philippine_guests = 'This field is required';
  //   if (!formData.philippine_guest_nights) newErrors.philippine_guest_nights = 'This field is required';
  //   if (!formData.foreign_guests) newErrors.foreign_guests = 'This field is required';
  //   if (!formData.foreign_guest_nights) newErrors.foreign_guest_nights = 'This field is required';
  //   if (!formData.philippine_ofw_guests) newErrors.philippine_ofw_guests = 'This field is required';
  //   if (!formData.philippine_ofw_nights) newErrors.philippine_ofw_nights = 'This field is required';
  //   if (!formData.rooms_occupied) newErrors.rooms_occupied = 'This field is required';
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const confirmAction = async () => {
  //   if (!validate()) return;

  //   setIsSubmitting(true);
  //   try {
  //     const u = user?.user_profile;
  //     const reportMode = role === 'AE' ? u?.report_mode : 'monthly';

  //     const nationalitiesData = [];
  //     if (guestCounts.filipinoTotal > 0) {
  //       nationalitiesData.push({
  //         nationality: 'Philippines',
  //         filipino_subcategory: 'Non-OFW',
  //         male_count: Number(guestCounts.filipinoMale) || 0,
  //         female_count: Number(guestCounts.filipinoFemale) || 0,
  //         total_count: Number(guestCounts.filipinoTotal) || 0,
  //       });
  //     }
  //     if (guestCounts.ofwTotal > 0) {
  //       nationalitiesData.push({
  //         nationality: 'Philippines',
  //         filipino_subcategory: 'OFW',
  //         male_count: Number(guestCounts.ofwMale) || 0,
  //         female_count: Number(guestCounts.ofwFemale) || 0,
  //         total_count: Number(guestCounts.ofwTotal) || 0,
  //       });
  //     }
  //     if (guestCounts.foreignTotal > 0) {
  //       nationalitiesData.push({
  //         nationality: 'Philippines',
  //         filipino_subcategory: 'Foreigner',
  //         male_count: Number(guestCounts.foreignMale) || 0,
  //         female_count: Number(guestCounts.foreignFemale) || 0,
  //         total_count: Number(guestCounts.foreignTotal) || 0,
  //       });
  //     }
  //     nationalities.forEach((nat) => {
  //       const totalCount = nat.total_count || nat.male_count + nat.female_count;
  //       if (totalCount > 0) {
  //         nationalitiesData.push({
  //           nationality: nat.nationality,
  //           filipino_subcategory: null,
  //           male_count: nat.male_count,
  //           female_count: nat.female_count,
  //           total_count: totalCount,
  //         });
  //       }
  //     });

  //     const submitData = {
  //       ...formData,
  //       ae_profile: u?.id || null,
  //       nationalities: nationalitiesData,
  //     };

  //     await reportService.submit(submitData, reportMode, mode === 'edit' ? rowData?.id : null);

  //     if (refreshLogs) {
  //       await refreshLogs(new Date(formData.month).getFullYear());
  //     }

  //     setOpenNotificationModal(true);
  //   } catch (error) {
  //     console.error('Error submitting report:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //     setOpenConfirmationModal(false);
  //   }
  // };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#DADADA',
    },
    closeButton: {
      padding: 8,
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#d2d2d2' : '#1e1e1e',
      marginBottom: 15,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#d2d2d2' : '#1e1e1e',
      marginBottom: 12,
    },
    rowInputs: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    halfWidth: {
      flex: 1,
    },
    nationalityItem: {
      marginBottom: 16,
    },
    nationalityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    nationalityName: {
      fontSize: 14,
      color: isDark ? '#d2d2d2' : '#1e1e1e',
    },
    deleteButton: {
      padding: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginTop: 20,
      paddingBottom: 20,
    },
    helperText: {
      fontSize: 12,
      color: '#828282',
      marginTop: 4,
      fontStyle: 'italic',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400,
    },
  });

  return (
    <>
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={onClose}
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? '#fff' : '#313638'}
              />
            </TouchableOpacity>
          </View>

          {isFetchingReport ? (
            <View style={styles.loadingContainer}>
              <LoadingOverlay message="Loading report data..." />
            </View>
          ) : (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of domestic guest check-ins"
                  keyboardType="numeric"
                  value={String(formData.philippine_guests)}
                  onChangeText={handleFormDataChange('philippine_guests')}
                  editable={!isViewMode}
                  error={errors.philippine_guests}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of domestic guest nights"
                  keyboardType="numeric"
                  value={String(formData.philippine_guest_nights)}
                  onChangeText={handleFormDataChange('philippine_guest_nights')}
                  editable={!isViewMode}
                  error={errors.philippine_guest_nights}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of foreign guest check-ins"
                  keyboardType="numeric"
                  value={String(formData.foreign_guests)}
                  onChangeText={handleFormDataChange('foreign_guests')}
                  editable={!isViewMode}
                  error={errors.foreign_guests}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of foreign guest nights"
                  keyboardType="numeric"
                  value={String(formData.foreign_guest_nights)}
                  onChangeText={handleFormDataChange('foreign_guest_nights')}
                  editable={!isViewMode}
                  error={errors.foreign_guest_nights}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of ofw guest check-ins"
                  keyboardType="numeric"
                  value={String(formData.philippine_ofw_guests)}
                  onChangeText={handleFormDataChange('philippine_ofw_guests')}
                  editable={!isViewMode}
                  error={errors.philippine_ofw_guests}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of ofw guest nights"
                  keyboardType="numeric"
                  value={String(formData.philippine_ofw_nights)}
                  onChangeText={handleFormDataChange('philippine_ofw_nights')}
                  editable={!isViewMode}
                  error={errors.philippine_ofw_nights}
                />
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total no. of rooms occupied"
                  keyboardType="numeric"
                  value={String(formData.rooms_occupied)}
                  onChangeText={handleFormDataChange('rooms_occupied')}
                  editable={!isViewMode}
                  error={errors.rooms_occupied}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Guest arrivals/check-ins by Nationality/Country of Residence
                </Text>

                <FullUnderlineTitle text="Philippine Residents" />

                <View style={{ marginTop: 15 }}>
                  <Text style={styles.subsectionTitle}>Filipino Nationality</Text>

                  <View style={styles.rowInputs}>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Male"
                        keyboardType="numeric"
                        value={String(guestCounts.filipinoMale)}
                        onChangeText={handleGuestCountChange('filipinoMale', 'disaggregated')}
                        editable={fieldModes.filipino !== 'total' && !isViewMode}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Female"
                        keyboardType="numeric"
                        value={String(guestCounts.filipinoFemale)}
                        onChangeText={handleGuestCountChange('filipinoFemale', 'disaggregated')}
                        editable={fieldModes.filipino !== 'total' && !isViewMode}
                      />
                    </View>
                  </View>

                  <MainTextInput
                    label="Total"
                    keyboardType="numeric"
                    value={String(guestCounts.filipinoTotal)}
                    onChangeText={handleGuestCountChange('filipinoTotal', 'total')}
                    editable={fieldModes.filipino !== 'disaggregated' && !isViewMode}
                    helperText={
                      !isViewMode && fieldModes.filipino !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                  />
                </View>

                <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.subsectionTitle}>Foreign Nationality</Text>
                    <InformationButton
                      helperText="A foreign national who has been granted legal permission to reside permanently or indefinitely in the Philippines."
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Male"
                        keyboardType="numeric"
                        value={String(guestCounts.foreignMale)}
                        onChangeText={handleGuestCountChange('foreignMale', 'disaggregated')}
                        editable={fieldModes.foreign !== 'total' && !isViewMode}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Female"
                        keyboardType="numeric"
                        value={String(guestCounts.foreignFemale)}
                        onChangeText={handleGuestCountChange('foreignFemale', 'disaggregated')}
                        editable={fieldModes.foreign !== 'total' && !isViewMode}
                      />
                    </View>
                  </View>

                  <MainTextInput
                    label="Total"
                    keyboardType="numeric"
                    value={String(guestCounts.foreignTotal)}
                    onChangeText={handleGuestCountChange('foreignTotal', 'total')}
                    editable={fieldModes.foreign !== 'disaggregated' && !isViewMode}
                    helperText={
                      !isViewMode && fieldModes.foreign !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                  />
                </View>
              </View>

              <View style={styles.section}>
                <FullUnderlineTitle text="Overseas Filipino Workers" />

                <View style={{ marginTop: 15 }}>
                  <Text style={styles.subsectionTitle}>Overseas Filipino Workers</Text>

                  <View style={styles.rowInputs}>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Male"
                        keyboardType="numeric"
                        value={String(guestCounts.ofwMale)}
                        onChangeText={handleGuestCountChange('ofwMale', 'disaggregated')}
                        editable={fieldModes.ofw !== 'total' && !isViewMode}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <MainTextInput
                        label="Female"
                        keyboardType="numeric"
                        value={String(guestCounts.ofwFemale)}
                        onChangeText={handleGuestCountChange('ofwFemale', 'disaggregated')}
                        editable={fieldModes.ofw !== 'total' && !isViewMode}
                      />
                    </View>
                  </View>

                  <MainTextInput
                    label="Total"
                    keyboardType="numeric"
                    value={String(guestCounts.ofwTotal)}
                    onChangeText={handleGuestCountChange('ofwTotal', 'total')}
                    editable={fieldModes.ofw !== 'disaggregated' && !isViewMode}
                    helperText={
                      !isViewMode && fieldModes.ofw !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                  />
                </View>
              </View>

              <View style={styles.section}>
                <FullUnderlineTitle text="Non-Philippine Residents" />

                {nationalities.map((nation) => {
                  const fieldMode = nationalityFieldModes[nation.nationality] || 'none';

                  return (
                    <View key={nation.nationality} style={styles.nationalityItem}>
                      <View style={styles.nationalityHeader}>
                        <Text style={styles.nationalityName}>{nation.nationality}</Text>
                        {!isViewMode && (
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleRemoveNationality(nation.nationality)}
                          >
                            <Ionicons name="trash" size={20} color="#EF1A25" />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.rowInputs}>
                        <View style={styles.halfWidth}>
                          <MainTextInput
                            label="Male"
                            keyboardType="numeric"
                            value={String(nation.male_count)}
                            onChangeText={(value) =>
                              updateNationalityCount(nation.nationality, 'male_count', value)
                            }
                            editable={fieldMode !== 'total' && !isViewMode}
                          />
                        </View>
                        <View style={styles.halfWidth}>
                          <MainTextInput
                            label="Female"
                            keyboardType="numeric"
                            value={String(nation.female_count)}
                            onChangeText={(value) =>
                              updateNationalityCount(nation.nationality, 'female_count', value)
                            }
                            editable={fieldMode !== 'total' && !isViewMode}
                          />
                        </View>
                      </View>

                      <MainTextInput
                        label="Total"
                        keyboardType="numeric"
                        value={String(nation.total_count)}
                        onChangeText={(value) =>
                          updateNationalityCount(nation.nationality, 'total_count', value)
                        }
                        editable={fieldMode !== 'disaggregated' && !isViewMode}
                        helperText={
                          !isViewMode && fieldMode !== 'disaggregated'
                            ? "*Manually input the total if there's no data on the sex disaggregation"
                            : ''
                        }
                      />
                    </View>
                  );
                })}

                {!isViewMode && (
                  <View style={{ marginTop: 15 }}>
                    <MainSelectInput
                      label="+ Add Nationality"
                      value={selectedNationality}
                      options={nationalityOptions
                        .filter((opt) => !nationalities.find((n) => n.nationality === opt))
                        .map((opt) => ({ value: opt, label: opt }))}
                      onChange={handleAddNationality}
                      placeholder="Select nationality"
                    />
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <MainTextInput
                  label="Total Guests"
                  keyboardType="numeric"
                  value={String(totalGuests)}
                  editable={false}
                />
              </View>

              {isViewMode ? (
                <View style={styles.buttonContainer}>
                  <DefaultButton label="Close" onPress={onClose} />
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <DefaultButton
                    label={isSubmitting ? 'Submitting...' : 'Submit'}
                    onPress={() => setOpenConfirmationModal(true)}
                    disabled={isSubmitting}
                  />
                  <DefaultButton
                    label="Cancel"
                    onPress={onClose}
                    disabled={isSubmitting}
                    variant="danger"
                  />
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>

      <ConfirmationModal
        open={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        label="SUBMIT REPORT"
        description="Submit this report?"
        confirmButtonLabel="Yes, submit"
        cancelButtonLabel="No, nevermind"
        onConfirm={confirmAction}
      />

      <NotificationModal
        open={openNotificationModal}
        label="SUCCESS"
        description="Report submitted successfully"
        onClose={() => {
          setOpenNotificationModal(false);
          onClose();
        }}
      />

      <LoadingSnackbar
        open={isSubmitting}
        message={mode === 'edit' ? 'Updating report...' : 'Submitting report...'}
      />
    </>
  );
}