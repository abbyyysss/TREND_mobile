import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingOverlay from '@/components/loading/LoadingOverlay';

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
  overlayStyle = {},
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [blocking, setBlocking] = useState(true);

  useEffect(() => {
    let timer = null;

    if (!loading) {
      const isRevisionAllowed =
        pathname.startsWith('/register/revision/ae'); // matches /register/revision/ae and any child path

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
    return (
      <View style={[styles.container, overlayStyle]}>
        <LoadingOverlay message="Checking session..." />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});