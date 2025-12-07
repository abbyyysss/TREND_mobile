import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN } from '@/services/Constants';

/**
 * Role-aware route guard for React Native:
 *  - Blocks while auth is loading
 *  - Redirects to login if unauthenticated
 *  - Redirects to forbiddenPath if role is not allowed
 */
export default function useAuthGate({
  isAuthenticated,
  loading,
  role,                 // <-- pass the resolved user role here
  allowRoles,           // e.g., ['AE']
  loginPath = '/login',
  forbiddenPath = '/dashboard', // or '/403'
  debounceMs = 0,
}) {
  const router = useRouter();
  const [gateMessage, setGateMessage] = useState('Checking session…');
  const [showOverlay, setShowOverlay] = useState(debounceMs === 0);

  // Optional debounce to reduce overlay flicker
  useEffect(() => {
    if (debounceMs > 0) {
      const t = setTimeout(() => setShowOverlay(true), debounceMs);
      return () => clearTimeout(t);
    }
  }, [debounceMs]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasToken = !!(await AsyncStorage.getItem(ACCESS_TOKEN));
        const loggingOut = (await AsyncStorage.getItem('logout_in_progress')) === '1';

        if (loading) {
          setGateMessage(
            loggingOut ? 'Logging out…' :
            hasToken ? 'Loading…' :
            'Checking session…'
          );
          return;
        }

        if (!isAuthenticated) {
          setGateMessage(loggingOut ? 'Logged out. Redirecting to sign in…' : 'Redirecting to sign in…');
          if (loggingOut) await AsyncStorage.removeItem('logout_in_progress');
          router.replace(loginPath);
          return;
        }

        // Authenticated: check role
        if (Array.isArray(allowRoles) && allowRoles.length > 0) {
          const ok = allowRoles.includes(role);
          if (!ok) {
            setGateMessage('You do not have access to this page…');
            router.replace(forbiddenPath);
            return;
          }
        }

        setGateMessage('Loading…');
      } catch (error) {
        console.error('Auth gate error:', error);
        setGateMessage(loading ? 'Checking session…' : 'Redirecting…');
        if (!loading && !isAuthenticated) router.replace(loginPath);
      }
    };

    checkAuth();
  }, [loading, isAuthenticated, role, allowRoles, router, loginPath, forbiddenPath]);

  const blocking = (loading || !isAuthenticated) && showOverlay;
  return { gateMessage, blocking };
}