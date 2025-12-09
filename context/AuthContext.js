import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, getCurrentUser } from "@/services/AuthService";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/services/Constants";
import api, { setApiLogoutHandler } from "@/services/Api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ========== EXTRACTED USER FIELDS ==========
  
  // Extract user ID - it's nested in user_profile.user.id
  const myId = useMemo(() => {
    return (
      user?.user_profile?.user?.id ??  // Nested format (actual structure)
      user?.id ??  // Fallback for top-level format
      null
    );
  }, [user]);

  // Extract profile ID (AEProfile.id)
  const myProfileId = useMemo(() => {
    return user?.user_profile?.id ?? null;
  }, [user]);

  // Extract role - it's nested in user_profile.user.role
  const role = useMemo(() => {
    return (
      user?.user_profile?.user?.role ??  // Nested format (actual structure)
      user?.role ??  // Fallback
      null
    );
  }, [user]);

  // Extract email - it's nested in user_profile.user.email
  const email = useMemo(() => {
    return (
      user?.user_profile?.user?.email ??  // Nested format (actual structure)
      user?.email ??  // Fallback
      null
    );
  }, [user]);

  // Extract username - it's nested in user_profile.user.username
  const username = useMemo(() => {
    return (
      user?.user_profile?.user?.username ??  // Nested format (actual structure)
      user?.username ??  // Fallback
      null
    );
  }, [user]);

  // Extract contact number - it's nested in user_profile.user.contact_num
  const contactNum = useMemo(() => {
    return (
      user?.user_profile?.user?.contact_num ??  // Nested format (actual structure)
      user?.user_profile?.contact_person ??  // Alternative field name
      user?.contact_num ??  // Fallback
      null
    );
  }, [user]);

  // Extract is_active status - it's nested in user_profile.user.is_active
  const isActive = useMemo(() => {
    return (
      user?.user_profile?.user?.is_active ??  // Nested format (actual structure)
      user?.is_active ??  // Fallback
      true  // Default to true if not specified
    );
  }, [user]);

  // Extract is_staff status - it's nested in user_profile.user.is_staff
  const isStaff = useMemo(() => {
    return (
      user?.user_profile?.user?.is_staff ??  // Nested format (actual structure)
      user?.is_staff ??  // Fallback
      false  // Default to false
    );
  }, [user]);

  // ========== AE-SPECIFIC FIELDS ==========

  // Extract establishment info
  const establishmentName = useMemo(() => {
    return user?.user_profile?.establishment_name ?? null;
  }, [user]);

  const businessName = useMemo(() => {
    return user?.user_profile?.business_name ?? null;
  }, [user]);

  const idCode = useMemo(() => {
    return user?.user_profile?.id_code ?? null;
  }, [user]);

  const accreditationStatus = useMemo(() => {
    return user?.user_profile?.accreditation_status ?? null;
  }, [user]);

  // Extract address fields
  const barangay = useMemo(() => {
    return user?.user_profile?.barangay ?? null;
  }, [user]);

  const cityMunicipality = useMemo(() => {
    return user?.user_profile?.city_municipality ?? null;
  }, [user]);

  const province = useMemo(() => {
    return user?.user_profile?.province ?? null;
  }, [user]);

  const region = useMemo(() => {
    return user?.user_profile?.region ?? null;
  }, [user]);

  const streetAddress = useMemo(() => {
    return user?.user_profile?.street_address ?? null;
  }, [user]);

  // Extract establishment details
  const establishmentType = useMemo(() => {
    return user?.user_profile?.type ?? null;
  }, [user]);

  const totalRooms = useMemo(() => {
    return user?.user_profile?.total_rooms ?? null;
  }, [user]);

  const maleEmployees = useMemo(() => {
    return user?.user_profile?.male_employees ?? null;
  }, [user]);

  const femaleEmployees = useMemo(() => {
    return user?.user_profile?.female_employees ?? null;
  }, [user]);

  // Extract reporting fields
  const reportMode = useMemo(() => {
    return user?.user_profile?.report_mode ?? null;
  }, [user]);

  const complianceRate = useMemo(() => {
    return user?.user_profile?.compliance_rate ?? null;
  }, [user]);

  // Extract registration status fields - nested in user_profile.user
  const registrationStatus = useMemo(() => {
    return (
      user?.user_profile?.user?.registration_status ??  // Nested format (actual structure)
      user?.registration_status ??  // Fallback
      null
    );
  }, [user]);

  const rejectedReason = useMemo(() => {
    return (
      user?.user_profile?.user?.rejected_reason ??  // Nested format (actual structure)
      user?.rejected_reason ??  // Fallback
      null
    );
  }, [user]);

  const rejectedAdditionalFeedback = useMemo(() => {
    return (
      user?.user_profile?.user?.rejected_additional_feedback ??  // Nested format (actual structure)
      user?.rejected_additional_feedback ??  // Fallback
      null
    );
  }, [user]);

  // ========== EFFECTS ==========

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
        
        setUser(userData); // Store raw data - useMemo handles extraction
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Auth initialization failed:", e);
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
        console.error("Token refresh failed:", e);
        handleLogout();
      }
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // ========== AUTH HANDLERS ==========

  const handleLogin = async (email, password) => {
    const { ok, data } = await loginUser(email, password);
    
    if (!ok) {
      return { ok: false, data };
    }
    
    try {
      const userData = await getCurrentUser();
      
      setUser(userData); // Store raw data - useMemo handles extraction
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

  // ========== CONTEXT VALUE ==========

  const value = {
    // Raw user object (for accessing nested data directly)
    user,
    setUser,
    
    // Auth state
    isAuthenticated,
    loading,
    
    // User basic info
    myId,
    myProfileId,
    role,
    email,
    username,
    contactNum,
    isActive,
    isStaff,
    
    // Establishment info
    establishmentName,
    businessName,
    idCode,
    accreditationStatus,
    
    // Address
    barangay,
    cityMunicipality,
    province,
    region,
    streetAddress,
    
    // Establishment details
    establishmentType,
    totalRooms,
    maleEmployees,
    femaleEmployees,
    
    // Reporting
    reportMode,
    complianceRate,
    
    // Registration status
    registrationStatus,
    rejectedReason,
    rejectedAdditionalFeedback,
    
    // Auth methods
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};