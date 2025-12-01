import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, getCurrentUser } from "@/services/AuthService";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/services/Constants";
import api, { setApiLogoutHandler } from "@/services/Api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Register logout handler for API.js
  useEffect(() => {
    setApiLogoutHandler(() => handleLogout);
  }, []);

  // Initial auth check on app startup
  useEffect(() => {
    const init = async () => {
      const access = await AsyncStorage.getItem(ACCESS_TOKEN);
      const refresh = await AsyncStorage.getItem(REFRESH_TOKEN);

      if (!refresh) {
        setLoading(false);
        return;
      }

      try {
        let newAccess = access;
        if (!access) {
          const res = await api.post("/accounts/token/refresh/", { refresh });
          newAccess = res.data.access;
          await AsyncStorage.setItem(ACCESS_TOKEN, newAccess);
        }

        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        await AsyncStorage.removeItem(ACCESS_TOKEN);
        await AsyncStorage.removeItem(REFRESH_TOKEN);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Auto-refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh = await AsyncStorage.getItem(REFRESH_TOKEN);
      if (!refresh) return;

      try {
        const res = await api.post("/accounts/token/refresh/", { refresh });
        await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
      } catch (e) {
        handleLogout();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (email, password) => {
    // ✅ Capture both 'ok' and 'data' from loginUser
    const { ok, data } = await loginUser(email, password);
    
    if (!ok) {
      // ✅ Return the error data so Login component can show the message
      return { ok: false, data };
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return { ok: true, data: userData };
    } catch (e) {
      console.error("Failed to get user data after login:", e);
      handleLogout();
      return { 
        ok: false, 
        data: { detail: "Login succeeded but failed to fetch user data" } 
      };
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login: handleLogin, 
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);