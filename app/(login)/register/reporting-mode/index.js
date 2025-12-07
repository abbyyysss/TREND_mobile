import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MainSelectInput from '@/components/input/MainSelectInput';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';

export default function ReportingMode() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, updateFormData, formErrors, setErrors, clearErrors } = useAERegistration();
  const [touched, setTouched] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const frequencyOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.report_mode?.trim()) 
      newErrors.report_mode = "Reporting mode is required";
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = () => {
    setTouched(true);
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      clearErrors();
      router.push('/register/finishing-up');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          {
            color: (touched && formErrors.report_mode) ? '#dc2626' : colors.text,
            fontFamily: fonts.gotham
          }
        ]}>
          Choose your preferred reporting mode{' '}
          {(touched && formErrors.report_mode) && (
            <Text style={styles.requiredText}>(required)</Text>
          )}
        </Text>
        <TouchableOpacity 
          onPress={() => setShowTooltip(!showTooltip)}
          style={styles.infoButton}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      {showTooltip && (
        <View style={[styles.tooltip, { backgroundColor: colors.background }]}>
          <Text style={[styles.tooltipText, { color: colors.text }]}>
            Select how frequently you prefer to submit your reports. You can choose to report on a daily or monthly basis depending on your establishment's needs and operational schedule.
          </Text>
        </View>
      )}

      <MainSelectInput 
        value={formData.report_mode || ''}
        onChange={(value) => {
          updateFormData({ report_mode: value });
          if (touched) validate();
        }}
        options={frequencyOptions}
        variant="standard"
        error={touched && !!formErrors.report_mode}
        helperText={formErrors.report_mode || 'This setting can be changed later.'}
      />

      <DefaultButton 
        onPress={handleSubmit}
        label="Submit" 
      />

      <BackButton 
        onPress={() => router.push('/register/star-rating')}
        label="Back"
        hasBg={true}
        hasPadding={true}
      />

      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
        isArrow={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    padding: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 14,
    color: '#dc2626',
  },
  infoButton: {
    padding: 4,
  },
  tooltip: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: -10,
    marginBottom: 5,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});