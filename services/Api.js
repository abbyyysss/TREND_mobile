import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, REFRESH_TOKEN, BASE_URL } from "./Constants"; 
import { router } from 'expo-router';

const api = axios.create({ baseURL: BASE_URL });

// allow AuthContext to register its logout fn
let logoutCallback = null;
export const setApiLogoutHandler = (fn) => {
  logoutCallback = fn;
};

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await AsyncStorage.getItem(REFRESH_TOKEN);

      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}accounts/token/refresh/`, { refresh });
          await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);

          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api(error.config);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);

          await AsyncStorage.removeItem(ACCESS_TOKEN);
          await AsyncStorage.removeItem(REFRESH_TOKEN);

          if (logoutCallback) logoutCallback();

          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
