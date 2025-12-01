import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./Api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./Constants";

// ================== REGISTRATION ==================
export const registerDOT = (payload) =>
  api.post("/accounts/register/dot/", payload).then((res) => res.data);

export const registerAE = (payload) =>
  api.post("/accounts/register/accommodation/", payload).then((res) => res.data);

export const registerProvince = (payload) =>
  api.post("/accounts/register/province/", payload).then((res) => res.data);

export const registerCityMunicipality = (payload) =>
  api.post("/accounts/register/city-municipality/", payload).then((res) => res.data);

// ================== REGISTRATION REVISION ==================
export const reviseAERegistration = (payload) =>
  api
    .patch("/accounts/register/accommodation/revise/", payload)
    .then((res) => res.data);

// ================== AUTH ==================
export const loginUser = async (email, password) => {
  console.log('🔐 Attempting login with email:', email);
  console.log('📍 API Base URL:', api.defaults.baseURL);
  
  try {
    const payload = { email, password };
    console.log('📤 Sending login request to /accounts/token/');
    
    const res = await api.post("/accounts/token/", payload);
    
    console.log('✅ Login successful! Response:', {
      hasAccess: !!res.data.access,
      hasRefresh: !!res.data.refresh,
      accessTokenLength: res.data.access?.length,
    });

    await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
    await AsyncStorage.setItem(REFRESH_TOKEN, res.data.refresh);

    return { ok: true, data: res.data };
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Full error:', error.message);
    
    // Return detailed error information
    return {
      ok: false,
      data: error.response?.data || { 
        detail: error.message || "Login failed" 
      },
    };
  }
};

// ================== USER ==================
export const getCurrentUser = async () => {
  console.log('👤 Fetching current user data...');
  try {
    const res = await api.get("/accounts/get-user/");
    console.log('✅ User data retrieved successfully');
    return res.data;
  } catch (error) {
    console.error('❌ Failed to get user data:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCurrentUser = (payload) =>
  api.patch("/accounts/me/update/", payload).then((res) => res.data);

export const changePassword = (payload) =>
  api.post("/accounts/me/change-password/", payload).then((res) => res.data);

// ================== PASSWORD RESET ==================
export const requestPasswordReset = (email) =>
  api.post("/accounts/password-reset/", { email }).then((res) => res.data);

export const validateResetToken = (uidb64, token) =>
  api
    .get(`/accounts/password-reset/validate/${uidb64}/${token}/`)
    .then((res) => res.data);

export const confirmPasswordReset = (payload) =>
  api.post("/accounts/password-reset/confirm/", payload).then((res) => res.data);