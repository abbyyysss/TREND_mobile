import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import AuthGateScreen from '@/components/AuthGateScreen';

/**
 * GuestGate
 * ----------
 * Blocks access to guest-only pages (like login, register, reset password)
 * if the user is already authenticated.
 *
 * Example:
 *   <GuestGate redirectPath="/dashboard">
 *     <LoginPage />
 *   </GuestGate>
 */
export default function GuestGate({
  children,
  redirectPath = '/dashboard', // where to go if already logged in
  debounceMs = 300,             // small delay to avoid flicker
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [blocking, setBlocking] = useState(true);

  useEffect(() => {
    let timer = null;

    if (!loading) {
      const isRevisionAllowed =
        pathname?.startsWith('/register/revision/ae'); // matches /register/revision/ae and any child path

      if (isRevisionAllowed && !isAuthenticated) {
        // ❌ Not allowed if no user
        router.replace('/login'); // or wherever your login page is
      } else if (isRevisionAllowed && isAuthenticated) {
        // ✅ Allow revision route
        timer = setTimeout(() => setBlocking(false), debounceMs);
      } else if (isAuthenticated) {
        // ✅ Already logged in — redirect to dashboard
        router.replace(redirectPath);
      } else {
        // ✅ Not logged in — allow access (e.g., login, register)
        timer = setTimeout(() => setBlocking(false), debounceMs);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, isAuthenticated, redirectPath, pathname, router, debounceMs]);

  if (blocking) {
    return <AuthGateScreen message="Checking session..." />;
  }

  return children;
}