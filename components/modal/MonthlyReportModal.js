import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';
import MainTextInput from '@/components/input/MainTextInput';
import FullUnderlineTitle from '@/components/text/FullUnderlineTitle';
import DefaultButton from '@/components/button/DefaultButton';
import { useAuth } from '@/context/AuthContext';
import MainSelectInput from '@/components/input/MainSelectInput';
import LoadingText from '../loading/LoadingText';
import InformationButton from '@/components/button/InformationButton';
import reportService from '@/services/ReportService';
import ConfirmationModal from '../modal/ConfirmationModal';
import NotificationModal from '../modal/NotificationModal';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import LoadingSnackbar from '../snackbar/LoadingSnackbar';
import MainSnackbar from '../snackbar/MainSnackbar';

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
  refreshLogs,
}) {
  const { colors, spacing, typography, radius, isDark, fonts } = useTheme();
  const { user, loading, role } = useAuth();

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
    filipinoMale: '0',
    filipinoFemale: '0',
    filipinoTotal: '0',
    foreignMale: '0',
    foreignFemale: '0',
    foreignTotal: '0',
    ofwMale: '0',
    ofwFemale: '0',
    ofwTotal: '0',
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

  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });

  const isViewMode = mode === 'view';

  const handleFormDataChange = (field) => (value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setFormData({ ...formData, [field]: numValue });

    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const fetchReportData = async (reportId) => {
    setIsFetchingReport(true);
    try {
      const reportData = await reportService.fetchMonthlyReportById(reportId);

      setFormData({
        month: reportData.month || '',
        ae_profile_id: reportData.ae_profile?.id || reportData.ae_profile,
        philippine_guests: reportData.philippine_guests || '',
        philippine_guest_nights: reportData.philippine_guest_nights || '',
        foreign_guests: reportData.foreign_guests || '',
        foreign_guest_nights: reportData.foreign_guest_nights || '',
        philippine_ofw_guests: reportData.philippine_ofw_guests || '',
        philippine_ofw_nights: reportData.philippine_ofw_nights || '',
        rooms_occupied: reportData.rooms_occupied || '',
      });

      const updatedGuestCounts = {
        filipinoMale: '0',
        filipinoFemale: '0',
        filipinoTotal: '0',
        foreignMale: '0',
        foreignFemale: '0',
        foreignTotal: '0',
        ofwMale: '0',
        ofwFemale: '0',
        ofwTotal: '0',
      };

      const updatedFieldModes = {
        filipino: 'none',
        foreign: 'none',
        ofw: 'none',
      };

      const updatedNationalityFieldModes = {};
      const otherNationalities = [];

      (reportData.nationality_breakdown || []).forEach((nat) => {
        const nationalityValue = nat.country;

        if (nationalityValue === 'Philippines') {
          if (nat.filipino_subcategory === 'Non-OFW') {
            const maleCount = String(Number(nat.male_count) || 0);
            const femaleCount = String(Number(nat.female_count) || 0);
            updatedGuestCounts.filipinoMale = maleCount;
            updatedGuestCounts.filipinoFemale = femaleCount;
            updatedGuestCounts.filipinoTotal = String(Number(nat.total) || 0);

            if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
              updatedFieldModes.filipino = 'disaggregated';
            } else if (Number(updatedGuestCounts.filipinoTotal) > 0) {
              updatedFieldModes.filipino = 'total';
            }
          } else if (nat.filipino_subcategory === 'OFW') {
            const maleCount = String(Number(nat.male_count) || 0);
            const femaleCount = String(Number(nat.female_count) || 0);
            updatedGuestCounts.ofwMale = maleCount;
            updatedGuestCounts.ofwFemale = femaleCount;
            updatedGuestCounts.ofwTotal = String(Number(nat.total) || 0);

            if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
              updatedFieldModes.ofw = 'disaggregated';
            } else if (Number(updatedGuestCounts.ofwTotal) > 0) {
              updatedFieldModes.ofw = 'total';
            }
          } else if (nat.filipino_subcategory === 'Foreigner') {
            const maleCount = String(Number(nat.male_count) || 0);
            const femaleCount = String(Number(nat.female_count) || 0);
            updatedGuestCounts.foreignMale = maleCount;
            updatedGuestCounts.foreignFemale = femaleCount;
            updatedGuestCounts.foreignTotal = String(Number(nat.total) || 0);

            if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
              updatedFieldModes.foreign = 'disaggregated';
            } else if (Number(updatedGuestCounts.foreignTotal) > 0) {
              updatedFieldModes.foreign = 'total';
            }
          }
        } else {
          const maleCount = String(Number(nat.male_count) || 0);
          const femaleCount = String(Number(nat.female_count) || 0);
          const totalCount = String(Number(nat.total) || 0);

          if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
            updatedNationalityFieldModes[nationalityValue] = 'disaggregated';
          } else if (Number(totalCount) > 0) {
            updatedNationalityFieldModes[nationalityValue] = 'total';
          } else {
            updatedNationalityFieldModes[nationalityValue] = 'none';
          }

          otherNationalities.push({
            nationality: nationalityValue,
            filipino_subcategory: null,
            male_count: maleCount,
            female_count: femaleCount,
            total_count: totalCount,
          });
        }
      });

      setGuestCounts(updatedGuestCounts);
      setFieldModes(updatedFieldModes);
      setNationalityFieldModes(updatedNationalityFieldModes);
      setNationalities(otherNationalities);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setErrorSnackbar({
        open: true,
        message: 'Failed to load report data. Please try again.',
      });
    } finally {
      setIsFetchingReport(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const formatted = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;

    setFormData({
      month: formatted,
      ae_profile_id: null,
      philippine_guests: '',
      philippine_guest_nights: '',
      foreign_guests: '',
      foreign_guest_nights: '',
      philippine_ofw_guests: '',
      philippine_ofw_nights: '',
      rooms_occupied: '',
    });
    setGuestCounts({
      filipinoMale: '0',
      filipinoFemale: '0',
      filipinoTotal: '0',
      foreignMale: '0',
      foreignFemale: '0',
      foreignTotal: '0',
      ofwMale: '0',
      ofwFemale: '0',
      ofwTotal: '0',
    });
    setFieldModes({
      filipino: 'none',
      foreign: 'none',
      ofw: 'none',
    });
    setNationalityFieldModes({});
    setNationalities([]);
    setSelectedNationality('');
    setErrors({});
  };

  useEffect(() => {
    if (open) {
      if ((mode === 'edit' || mode === 'add') && rowData?.id) {
        fetchReportData(rowData.id);
      } else if (mode === 'view' && rowData) {
        const updatedGuestCounts = {
          filipinoMale: '0',
          filipinoFemale: '0',
          filipinoTotal: '0',
          foreignMale: '0',
          foreignFemale: '0',
          foreignTotal: '0',
          ofwMale: '0',
          ofwFemale: '0',
          ofwTotal: '0',
        };

        const updatedFieldModes = {
          filipino: 'none',
          foreign: 'none',
          ofw: 'none',
        };

        const updatedNationalityFieldModes = {};
        const otherNationalities = [];

        (rowData.nationalities || []).forEach((nat) => {
          const nationalityValue = nat.nationality_name;

          if (nationalityValue === 'Philippines') {
            if (nat.filipino_subcategory === 'Non-OFW') {
              const maleCount = String(Number(nat.male_count) || 0);
              const femaleCount = String(Number(nat.female_count) || 0);
              updatedGuestCounts.filipinoMale = maleCount;
              updatedGuestCounts.filipinoFemale = femaleCount;
              updatedGuestCounts.filipinoTotal = String(Number(maleCount) + Number(femaleCount));

              if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
                updatedFieldModes.filipino = 'disaggregated';
              } else if (Number(updatedGuestCounts.filipinoTotal) > 0) {
                updatedFieldModes.filipino = 'total';
              }
            } else if (nat.filipino_subcategory === 'OFW') {
              const maleCount = String(Number(nat.male_count) || 0);
              const femaleCount = String(Number(nat.female_count) || 0);
              updatedGuestCounts.ofwMale = maleCount;
              updatedGuestCounts.ofwFemale = femaleCount;
              updatedGuestCounts.ofwTotal = String(Number(maleCount) + Number(femaleCount));

              if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
                updatedFieldModes.ofw = 'disaggregated';
              } else if (Number(updatedGuestCounts.ofwTotal) > 0) {
                updatedFieldModes.ofw = 'total';
              }
            } else if (nat.filipino_subcategory === 'Foreigner') {
              const maleCount = String(Number(nat.male_count) || 0);
              const femaleCount = String(Number(nat.female_count) || 0);
              updatedGuestCounts.foreignMale = maleCount;
              updatedGuestCounts.foreignFemale = femaleCount;
              updatedGuestCounts.foreignTotal = String(Number(maleCount) + Number(femaleCount));

              if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
                updatedFieldModes.foreign = 'disaggregated';
              } else if (Number(updatedGuestCounts.foreignTotal) > 0) {
                updatedFieldModes.foreign = 'total';
              }
            }
          } else {
            const maleCount = String(Number(nat.male_count) || 0);
            const femaleCount = String(Number(nat.female_count) || 0);
            const totalCount = String(Number(maleCount) + Number(femaleCount));

            if (Number(maleCount) > 0 || Number(femaleCount) > 0) {
              updatedNationalityFieldModes[nationalityValue] = 'disaggregated';
            } else if (Number(totalCount) > 0) {
              updatedNationalityFieldModes[nationalityValue] = 'total';
            } else {
              updatedNationalityFieldModes[nationalityValue] = 'none';
            }

            otherNationalities.push({
              nationality: nationalityValue,
              filipino_subcategory: null,
              male_count: maleCount,
              female_count: femaleCount,
              total_count: totalCount,
            });
          }
        });

        setGuestCounts(updatedGuestCounts);
        setFieldModes(updatedFieldModes);
        setNationalityFieldModes(updatedNationalityFieldModes);
        setNationalities(otherNationalities);
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [open, mode, rowData]);

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

  const handleGuestCountChange = (field, type) => (value) => {
    const safeValue = String(Math.max(0, Number(value) || 0));

    setGuestCounts((prev) => {
      const updated = { ...prev, [field]: safeValue };
      return updated;
    });

    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }

    setFieldModes((prev) => {
      const updated = { ...prev };

      if (type === 'disaggregated') {
        if (field.includes('filipino') && !field.includes('ofw')) {
          const maleValue = field === 'filipinoMale' ? safeValue : guestCounts.filipinoMale || '0';
          const femaleValue = field === 'filipinoFemale' ? safeValue : guestCounts.filipinoFemale || '0';

          if (Number(maleValue) === 0 && Number(femaleValue) === 0) {
            updated.filipino = 'none';
          } else {
            updated.filipino = 'disaggregated';
          }

          setGuestCounts((curr) => ({ 
            ...curr, 
            filipinoTotal: String(Number(maleValue) + Number(femaleValue)) 
          }));
        }
        if (field.includes('foreign')) {
          const maleValue = field === 'foreignMale' ? safeValue : guestCounts.foreignMale || '0';
          const femaleValue = field === 'foreignFemale' ? safeValue : guestCounts.foreignFemale || '0';

          if (Number(maleValue) === 0 && Number(femaleValue) === 0) {
            updated.foreign = 'none';
          } else {
            updated.foreign = 'disaggregated';
          }

          setGuestCounts((curr) => ({ 
            ...curr, 
            foreignTotal: String(Number(maleValue) + Number(femaleValue)) 
          }));
        }
        if (field.includes('ofw')) {
          const maleValue = field === 'ofwMale' ? safeValue : guestCounts.ofwMale || '0';
          const femaleValue = field === 'ofwFemale' ? safeValue : guestCounts.ofwFemale || '0';

          if (Number(maleValue) === 0 && Number(femaleValue) === 0) {
            updated.ofw = 'none';
          } else {
            updated.ofw = 'disaggregated';
          }

          setGuestCounts((curr) => ({ 
            ...curr, 
            ofwTotal: String(Number(maleValue) + Number(femaleValue)) 
          }));
        }
      }

      if (type === 'total') {
        if (field === 'filipinoTotal') {
          if (Number(safeValue) === 0) {
            updated.filipino = 'none';
          } else {
            updated.filipino = 'total';
            setGuestCounts((curr) => ({ ...curr, filipinoMale: '0', filipinoFemale: '0' }));
          }
        }
        if (field === 'foreignTotal') {
          if (Number(safeValue) === 0) {
            updated.foreign = 'none';
          } else {
            updated.foreign = 'total';
            setGuestCounts((curr) => ({ ...curr, foreignMale: '0', foreignFemale: '0' }));
          }
        }
        if (field === 'ofwTotal') {
          if (Number(safeValue) === 0) {
            updated.ofw = 'none';
          } else {
            updated.ofw = 'total';
            setGuestCounts((curr) => ({ ...curr, ofwMale: '0', ofwFemale: '0' }));
          }
        }
      }

      return updated;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (open) {
        setIsLoadingData(true);
        try {
          const [nationalitiesData] = await Promise.all([reportService.getNationalities()]);
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
  }, [open]);

  const handleAddNationality = (nation) => {
    if (!nation) return;
    if (!nationalities.find((n) => n.nationality === nation)) {
      setNationalities([
        ...nationalities, 
        { 
          nationality: nation, 
          male_count: '0', 
          female_count: '0', 
          total_count: '0' 
        }
      ]);
      setNationalityFieldModes((prev) => ({ ...prev, [nation]: 'none' }));
    }
    setSelectedNationality('');
  };

  const handleRemoveNationality = (nation) => {
    setNationalities(nationalities.filter((n) => n.nationality !== nation));
    setNationalityFieldModes((prev) => {
      const updated = { ...prev };
      delete updated[nation];
      return updated;
    });
  };

  const updateNationalityCount = (nationality, field, value) => {
    const safeValue = String(Math.max(0, Number(value) || 0));

    setNationalities((prev) => 
      prev.map((n) => (n.nationality === nationality ? { ...n, [field]: safeValue } : n))
    );

    setNationalityFieldModes((prev) => {
      const updated = { ...prev };
      const currentNationality = nationalities.find((n) => n.nationality === nationality);

      if (field === 'total_count') {
        if (Number(safeValue) === 0) {
          updated[nationality] = 'none';
        } else {
          updated[nationality] = 'total';
          setNationalities((curr) =>
            curr.map((n) => (n.nationality === nationality ? { ...n, male_count: '0', female_count: '0' } : n)),
          );
        }
      } else if (field === 'male_count' || field === 'female_count') {
        const otherField = field === 'male_count' ? 'female_count' : 'male_count';
        const otherValue = field === 'male_count' 
          ? currentNationality?.female_count || '0' 
          : currentNationality?.male_count || '0';

        if (Number(safeValue) === 0 && Number(otherValue) === 0) {
          updated[nationality] = 'none';
        } else {
          updated[nationality] = 'disaggregated';
          const totalValue = String(Number(safeValue) + Number(otherValue));
          setNationalities((curr) =>
            curr.map((n) => (n.nationality === nationality ? { ...n, total_count: totalValue } : n)),
          );
        }
      }

      return updated;
    });
  };
    
  const validate = () => {
    const newErrors = {};
    if (!formData.philippine_guests) newErrors.philippine_guests = 'This field is required';
    if (!formData.philippine_guest_nights) newErrors.philippine_guest_nights = 'This field is required';
    if (!formData.foreign_guests) newErrors.foreign_guests = 'This field is required';
    if (!formData.foreign_guest_nights) newErrors.foreign_guest_nights = 'This field is required';
    if (!formData.philippine_ofw_guests) newErrors.philippine_ofw_guests = 'This field is required';
    if (!formData.philippine_ofw_nights) newErrors.philippine_ofw_nights = 'This field is required';
    if (!formData.rooms_occupied) newErrors.rooms_occupied = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setOpenConfirmationModal(true);
  };

  const confirmAction = async () => {
    setIsSubmitting(true);
    try {
      const u = user?.user_profile;
      const reportMode = role === 'AE' ? u?.report_mode : 'monthly';

      const nationalitiesData = [];
      
      if (Number(guestCounts.filipinoTotal) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'Non-OFW',
          male_count: Number(guestCounts.filipinoMale) || 0,
          female_count: Number(guestCounts.filipinoFemale) || 0,
          total_count: Number(guestCounts.filipinoTotal) || 0,
        });
      }
      
      if (Number(guestCounts.ofwTotal) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'OFW',
          male_count: Number(guestCounts.ofwMale) || 0,
          female_count: Number(guestCounts.ofwFemale) || 0,
          total_count: Number(guestCounts.ofwTotal) || 0,
        });
      }
      
      if (Number(guestCounts.foreignTotal) > 0) {
        nationalitiesData.push({
          nationality: 'Philippines',
          filipino_subcategory: 'Foreigner',
          male_count: Number(guestCounts.foreignMale) || 0,
          female_count: Number(guestCounts.foreignFemale) || 0,
          total_count: Number(guestCounts.foreignTotal) || 0,
        });
      }
      
      nationalities.forEach((nat) => {
        const totalCount = Number(nat.total_count) || (Number(nat.male_count) + Number(nat.female_count));
        if (totalCount > 0) {
          nationalitiesData.push({
            nationality: nat.nationality,
            filipino_subcategory: null,
            male_count: Number(nat.male_count),
            female_count: Number(nat.female_count),
            total_count: totalCount,
          });
        }
      });

      const submitData = {
        ...formData,
        ae_profile: u?.id || null,
        nationalities: nationalitiesData,
      };

      await reportService.submit(submitData, reportMode, mode === 'edit' ? rowData?.id : null);

      if (refreshLogs) {
        await refreshLogs(new Date(formData.month).getFullYear());
      }

      setOpenNotificationModal(true);
    } catch (error) {
      console.error('Error submitting report:', error);
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


  return (
    <>
      <Modal
        visible={open}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: colors.background 
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {isFetchingReport ? (
              <LoadingOverlay message="Loading report data..." />
            ) : (
              <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: spacing.lg }}
              >
                <MainTextInput
                  label="Total no. of domestic guest check-ins"
                  type="number"
                  variant = "outlined"
                  size="small"
                  shrink
                  value={formData.philippine_guests}
                  onChange={handleFormDataChange('philippine_guests')}
                  disabled={isViewMode}
                  error={!!errors.philippine_guests}
                  helperText={errors.philippine_guests}
                />

                <MainTextInput
                  label="Total no. of domestic guest nights"
                  type="number"
                  variant = "outlined"
                  size="small"
                  shrink
                  value={formData.philippine_guest_nights}
                  onChange={handleFormDataChange('philippine_guest_nights')}
                  disabled={isViewMode}
                  error={!!errors.philippine_guest_nights}
                  helperText={errors.philippine_guest_nights}
                />

                <MainTextInput
                  label="Total no. of foreign guest check-ins"
                  variant = "outlined"
                  type="number"
                  size="small"
                  shrink
                  value={formData.foreign_guests}
                  onChange={handleFormDataChange('foreign_guests')}
                  disabled={isViewMode}
                  error={!!errors.foreign_guests}
                  helperText={errors.foreign_guests}
                />

                <MainTextInput
                  label="Total no. of foreign guest nights"
                  variant = "outlined"
                  type="number"
                  size="small"
                  shrink
                  value={formData.foreign_guest_nights}
                  onChange={handleFormDataChange('foreign_guest_nights')}
                  disabled={isViewMode}
                  error={!!errors.foreign_guest_nights}
                  helperText={errors.foreign_guest_nights}
                />

                <MainTextInput
                  label="Total no. of ofw guest check-ins"
                  variant = "outlined"
                  type="number"
                  size="small"
                  shrink
                  value={formData.philippine_ofw_guests}
                  onChange={handleFormDataChange('philippine_ofw_guests')}
                  disabled={isViewMode}
                  error={!!errors.philippine_ofw_guests}
                  helperText={errors.philippine_ofw_guests}
                />

                <MainTextInput
                  label="Total no. of ofw guest nights"
                  variant = "outlined"
                  type="number"
                  size="small"
                  shrink
                  value={formData.philippine_ofw_nights}
                  onChange={handleFormDataChange('philippine_ofw_nights')}
                  disabled={isViewMode}
                  error={!!errors.philippine_ofw_nights}
                  helperText={errors.philippine_ofw_nights}
                />

                <MainTextInput
                  label="Total no. of rooms occupied"
                  type="number"
                  variant = "outlined"
                  size="small"
                  shrink
                  value={formData.rooms_occupied}
                  onChange={handleFormDataChange('rooms_occupied')}
                  disabled={isViewMode}
                  error={!!errors.rooms_occupied}
                  helperText={errors.rooms_occupied}
                />

                <Text style={{ 
                  fontSize: typography.fontSize.xl, 
                  color: colors.text,
                  fontWeight: typography.weight.semibold,
                  fontFamily: fonts.gotham,
                  marginTop: spacing.lg,
                  marginBottom: spacing.md 
                }}>
                  Guest arrivals/check-ins by Nationality/Country of Residence
                </Text>

                <FullUnderlineTitle text="Philippine Residents" />

                {/* Filipino Nationality Section */}
                <View style={{ marginBottom: spacing.lg }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md }}>
                    <Text style={{ color: colors.text, fontSize: typography.fontSize.md, fontFamily: fonts.gotham, }}>
                      Filipino Nationality
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Male"
                        variant="outlined"
                        disabled={fieldModes.filipino === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.filipinoMale}
                        onChange={handleGuestCountChange('filipinoMale', 'disaggregated')}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Female"
                        variant="outlined"
                        disabled={fieldModes.filipino === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.filipinoFemale}
                        onChange={handleGuestCountChange('filipinoFemale', 'disaggregated')}
                      />
                    </View>
                  </View>
                  
                  <MainTextInput
                    label="Total"
                    variant="outlined"
                    disabled={fieldModes.filipino === 'disaggregated' || mode === 'view'}
                    type="number"
                    size="small"
                    helperText={
                      mode !== 'view' && fieldModes.filipino !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                    shrink={true}
                    value={guestCounts.filipinoTotal}
                    onChange={handleGuestCountChange('filipinoTotal', 'total')}
                  />
                </View>

                {/* Foreign Nationality Section */}
                <View style={{ marginBottom: spacing.lg }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                    <Text style={{ color: colors.text, fontSize: typography.fontSize.md, fontFamily: fonts.gotham, }}>
                      Foreign Nationality
                    </Text>
                    <InformationButton
                      iconSize={20}
                      helperText="A foreign national who has been granted legal permission to reside permanently or indefinitely in the Philippines."
                    />
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Male"
                        variant="outlined"
                        disabled={fieldModes.foreign === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.foreignMale}
                        onChange={handleGuestCountChange('foreignMale', 'disaggregated')}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Female"
                        variant="outlined"
                        disabled={fieldModes.foreign === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.foreignFemale}
                        onChange={handleGuestCountChange('foreignFemale', 'disaggregated')}
                      />
                    </View>
                  </View>
                  
                  <MainTextInput
                    label="Total"
                    variant="outlined"
                    disabled={fieldModes.foreign === 'disaggregated' || mode === 'view'}
                    type="number"
                    size="small"
                    helperText={
                      mode !== 'view' && fieldModes.foreign !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                    shrink={true}
                    value={guestCounts.foreignTotal}
                    onChange={handleGuestCountChange('foreignTotal', 'total')}
                  />
                </View>

                <FullUnderlineTitle text="Overseas Filipino Workers" />

                {/* OFW Section */}
                <View style={{ marginBottom: spacing.lg }}>
                  <Text style={{ color: colors.text, fontSize: typography.fontSize.md, marginBottom: spacing.sm, marginTop: spacing.md, fontFamily: fonts.gotham, }}>
                    Overseas Filipino Workers
                  </Text>
                  
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Male"
                        variant="outlined"
                        disabled={fieldModes.ofw === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.ofwMale}
                        onChange={handleGuestCountChange('ofwMale', 'disaggregated')}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <MainTextInput
                        label="Female"
                        variant="outlined"
                        disabled={fieldModes.ofw === 'total' || mode === 'view'}
                        type="number"
                        size="small"
                        shrink={true}
                        value={guestCounts.ofwFemale}
                        onChange={handleGuestCountChange('ofwFemale', 'disaggregated')}
                      />
                    </View>
                  </View>
                  
                  <MainTextInput
                    label="Total"
                    variant="outlined"
                    disabled={fieldModes.ofw === 'disaggregated' || mode === 'view'}
                    type="number"
                    size="small"
                    helperText={
                      mode !== 'view' && fieldModes.ofw !== 'disaggregated'
                        ? "*Manually input the total if there's no data on the sex disaggregation"
                        : ''
                    }
                    shrink={true}
                    value={guestCounts.ofwTotal}
                    onChange={handleGuestCountChange('ofwTotal', 'total')}
                  />
                </View>

                
                <FullUnderlineTitle text="Non-Philippine Residents" />
                
                {/* Other Nationalities */}
                {nationalities.map((nation) => {
                  const fieldMode = nationalityFieldModes[nation.nationality] || 'none';

                  return (
                    <View key={nation.nationality} style={{ marginBottom: spacing.lg }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md }}>
                        <Text style={{ color: colors.text, fontSize: typography.fontSize.md, flex: 1 , fontFamily: fonts.gotham,}}>
                          {nation.nationality}
                        </Text>
                        {!isViewMode && (
                          <TouchableOpacity onPress={() => handleRemoveNationality(nation.nationality)}>
                            <Ionicons name="trash-outline" size={20} color="#EF1A25" />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                        <View style={{ flex: 1 }}>
                          <MainTextInput
                            disabled={fieldMode === 'total' || mode === 'view'}
                            label="Male"
                            type="number"
                            variant="outlined"
                            size="small"
                            shrink={true}
                            value={nation.male_count}
                            onChange={(value) => updateNationalityCount(nation.nationality, 'male_count', value)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <MainTextInput
                            disabled={fieldMode === 'total' || mode === 'view'}
                            label="Female"
                            type="number"
                            variant="outlined"
                            size="small"
                            shrink={true}
                            value={nation.female_count}
                            onChange={(value) => updateNationalityCount(nation.nationality, 'female_count', value)}
                          />
                        </View>
                      </View>
                      
                      <MainTextInput
                        label="Total"
                        variant="outlined"
                        disabled={fieldMode === 'disaggregated' || mode === 'view'}
                        type="number"
                        size="small"
                        helperText={
                          mode !== 'view' && fieldMode !== 'disaggregated'
                            ? "*Manually input the total if there's no data on the sex disaggregation"
                            : ''
                        }
                        shrink={true}
                        value={nation.total_count}
                        onChange={(value) => updateNationalityCount(nation.nationality, 'total_count', value)}
                      />
                    </View>
                  );
                })}

                {!isViewMode && (
                  <MainSelectInput
                    label="+ Add Nationality"
                    size="small"
                    variant="outlined"
                    value={selectedNationality}
                    onChange={(value) => {
                      handleAddNationality(value);
                      setSelectedNationality('');
                    }}
                    options={nationalityOptions
                      .filter((opt) => !nationalities.find((n) => n.nationality === opt))
                      .map((opt) => ({ value: opt, label: opt }))}
                     placeholder="Select nationality"
                  />
                )}

                <MainTextInput 
                  label="Total Guests" 
                  variant="outlined"
                  shrink
                  disabled 
                  type="number" 
                  size="small"
                  value={totalGuests} 
                />

                {/* Action Buttons */}
                  <View style={{ 
                    flexDirection: 'row', 
                    gap: spacing.md,  
                    marginBottom: spacing.xl 
                  }}>
                    {!isViewMode && (
                      <View style={{ flex: 1 }}>
                        <DefaultButton
                          label={isSubmitting ? <LoadingText text="Submitting..." /> : 'Submit'}
                          onPress={() => setOpenConfirmationModal(true)}
                          disabled={isSubmitting}
                        />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <DefaultButton
                        label={isViewMode ? 'Close' : 'Cancel'}
                        onPress={onClose}
                        isRed={!isViewMode}
                        disabled={isSubmitting && !isViewMode}
                      />
                    </View>
                  </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
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
        label="REPORT SUCCESSFULLY SUBMITTED"
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

      <MainSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        severity="error"
        onClose={() => setErrorSnackbar({ open: false, message: '' })}
      />
    </>
  );
}