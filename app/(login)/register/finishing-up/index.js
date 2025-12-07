import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DefaultButton from '@/components/button/DefaultButton';
import BackButton from '@/components/button/BackButton';
import LoadingText from '@/components/loading/LoadingText';
import MainSnackbar from '@/components/snackbar/MainSnackbar';
import { useTheme } from '@/assets/theme/ThemeContext';
import { useAERegistration } from '@/context/AERegistrationContext';
import { registerAE } from '@/services/AuthService';

export default function FinishingUp() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const { formData, setErrors, clearErrors, clearFormData } = useAERegistration();
  const [loading, setLoading] = useState(false);
  const [snackQueue, setSnackQueue] = useState([]);
  const [currentSnack, setCurrentSnack] = useState(null);

  const showSnackbar = (message, severity = "error") => {
    const id = Date.now();
    const newSnack = { id, message, severity };
    setSnackQueue((prev) => [...prev, newSnack]);
  };

  useEffect(() => {
    if (!currentSnack && snackQueue.length > 0) {
      const [next, ...rest] = snackQueue;
      setCurrentSnack(next);
      setSnackQueue(rest);
    }
  }, [snackQueue, currentSnack]);

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setCurrentSnack(null);
  };

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const cleanAERegistrationPayload = (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password || data.confirmPassword,
      contact_person: data.contact_person,
      contact_num: data.contact_num,
      id_code: data.id_code || " ",
      establishment_name: data.establishment_name,
      business_name: data.business_name,
      proof_of_business: data.proof_of_business,
      barangay: data.barangay || "",
      city_municipality: data.city_municipality,
      province: data.province,
      region: "Region 7",
      street_address: data.street_address,
      type: data.type,
      total_rooms: data.total_rooms || 0,
      male_employees: data.male_employees || 0,
      female_employees: data.female_employees || 0,
      report_mode: data.report_mode,
    };

    // Accreditation fields
    if (data.is_dot_accredited) {
      payload.accreditation_control_number = data.accreditation_control_number;
      payload.accreditation_expiry = data.accreditation_expiry;
      payload.accreditation_certificate = data.accreditation_certificate || null;
    } else {
      payload.accreditation_control_number = null;
      payload.accreditation_expiry = null;
      payload.accreditation_certificate = null;
    }

    // Star rating fields
    if (data.is_star_rated) {
      payload.star_rating = data.star_rating || 0;
      payload.star_rating_certificate = data.star_rating_certificate || null;
      payload.star_rating_expiry = data.star_rating_expiry || null;
    } else {
      payload.star_rating = null;
      payload.star_rating_certificate = null;
      payload.star_rating_expiry = null;
    }

    return payload;
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!formData.establishment_name?.trim()) 
      validationErrors.establishment_name = "Establishment name is required.";
    if (!formData.business_name?.trim()) 
      validationErrors.business_name = "Business name is required.";
    if (!formData.type?.trim()) 
      validationErrors.type = "Establishment type is required.";
    if (!formData.proof_of_business) 
      validationErrors.proof_of_business = "Proof of business is required.";
    if (!formData.contact_person) 
      validationErrors.contact_person = "Contact person is required";
    if (!formData.contact_num?.trim()) 
      validationErrors.contact_num = "Contact number is required";
    if (!/^\d{11}$/.test(formData.contact_num)) 
      validationErrors.contact_num = "Contact number must be 11 digits";
    if (!formData.province_code) 
      validationErrors.province = "Province is required";
    if (!formData.city_code) 
      validationErrors.city_municipality = "City/Municipality is required";
    if (!formData.barangay_code) 
      validationErrors.barangay = "Barangay is required";
    if (!formData.street_address?.trim()) 
      validationErrors.street_address = "Street address is required";

    // Accreditation validation
    if (formData.is_dot_accredited) {
      if (!formData.accreditation_control_number?.trim()) 
        validationErrors.accreditation_control_number = "Accreditation control number is required";
      if (!formData.accreditation_expiry?.trim()) 
        validationErrors.accreditation_expiry = "Accreditation expiry date is required";
      if (!formData.accreditation_certificate) 
        validationErrors.accreditation_certificate = "Accreditation certificate is required.";
    }

    // Star rating validation
    if (formData.is_star_rated) {
      if (!formData.star_rating) 
        validationErrors.star_rating = "Star rating is required.";
      if (!formData.star_rating_expiry?.trim()) 
        validationErrors.star_rating_expiry = "Star rating expiry date is required.";
      if (!formData.star_rating_certificate) 
        validationErrors.star_rating_certificate = "Star rating certificate is required.";
    }

    if (!formData.report_mode?.trim()) 
      validationErrors.report_mode = "Reporting mode is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach(msg => showSnackbar(msg, "error"));
      return;
    }

    clearErrors();

    try {
      setLoading(true);
      const payload = cleanAERegistrationPayload(formData);
      console.log("🧾 Final AE payload before submit:", payload);

      const formDataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Handle file objects from React Native
          if (value && typeof value === 'object' && value.uri) {
            formDataToSend.append(key, {
              uri: value.uri,
              name: value.name,
              type: value.type,
            });
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      const res = await registerAE(formDataToSend);
      console.log("✅ Registration success:", res);

      clearFormData();

      // For React Native, we'll use a different approach than sessionStorage
      // You might want to use AsyncStorage or pass params directly
      router.push({
        pathname: '/register/success',
        params: {
          message: "Thank you for registering. We will email you once your registration is approved."
        }
      });
    } catch (error) {
      const errData = error.response?.data;
      console.error("❌ Registration failed:", errData || error);

      if (errData && typeof errData === "object") {
        const backendErrors = {};
        Object.entries(errData).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          backendErrors[field] = msg;
          showSnackbar(`${capitalizeWords(field.replaceAll("_", " "))}: ${msg}`, "error");
        });
        setErrors(backendErrors);
      } else {
        showSnackbar("Registration failed. Please check your details.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text, fontFamily: fonts.gotham }]}>
        Click any step number in the progress bar above to go back and check your entries. 
        If everything is correct, click submit.
      </Text>

      <DefaultButton 
        onPress={handleSubmit}
        label={loading ? <LoadingText text="Submitting..."/> : "Submit"}
        disabled={loading}
      />

      <BackButton 
        onPress={() => router.push('/register/reporting-mode')}
        label="Back"
        hasBg={true}
        hasPadding={true}
      />

      <BackButton 
        onPress={() => router.push('/login')}
        label="Back to Login"
        isArrow={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    padding: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 26,
  },
});