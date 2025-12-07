import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AERegistrationContext = createContext(null);

const STORAGE_KEY = 'ae-registration-form';

export const AERegistrationProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [mode, setMode] = useState('register'); // "register" by default
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from AsyncStorage
  useEffect(() => {
    loadFormData();
  }, []);

  // Persist formData whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveFormData();
    }
  }, [formData, isLoading]);

  const loadFormData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      }
    } catch (err) {
      console.error('Failed to load form data from AsyncStorage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
      console.error('Failed to save form data to AsyncStorage:', err);
    }
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const setErrors = (errors) => {
    setFormErrors(errors);
  };

  const clearErrors = () => {
    setFormErrors({});
  };

  const clearFormData = async () => {
    setFormData({});
    clearErrors();
    setMode('register');
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear form data from AsyncStorage:', err);
    }
  };

  return (
    <AERegistrationContext.Provider
      value={{
        formData,
        updateFormData,
        clearFormData,
        formErrors,
        setErrors,
        clearErrors,
        mode,
        setMode,
        isLoading, // expose loading state
      }}
    >
      {children}
    </AERegistrationContext.Provider>
  );
};

export const useAERegistration = () => {
  const context = useContext(AERegistrationContext);
  if (!context) {
    throw new Error('useAERegistration must be used within AERegistrationProvider');
  }
  return context;
};