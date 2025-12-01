import React from 'react';
import { useAuth } from '@/context/AuthContext';
import useAuthGate from '@/hooks/useAuthGate';
import AuthGateScreen from '@/components/AuthGateScreen';

/**
 * Wrapper you can put in any layout/screen.
 * It derives the user's role from your user object shape.
 */
export default function AuthGate({
  children,
  loginPath = '/login',
  forbiddenPath = '/dashboard',
  allowRoles = undefined,     // e.g. ['AE']
  debounceMs = 0,
}) {
  const { user, isAuthenticated, loading } = useAuth();

  // Try to normalize role from your various user payload shapes
  const role =
    user?.role ??
    user?.ae?.user?.role ??
    user?.dot?.user?.role ??
    user?.province?.user?.role ??
    user?.city_municipality?.user?.role ??
    null;

  const { gateMessage, blocking } = useAuthGate({
    isAuthenticated,
    loading,
    role,
    allowRoles,
    loginPath,
    forbiddenPath,
    debounceMs,
  });

  if (blocking) {
    return <AuthGateScreen message={gateMessage} />;
  }

  return children;
}