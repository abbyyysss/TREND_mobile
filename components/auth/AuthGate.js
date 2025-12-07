import { useAuth } from '@/context/AuthContext';
import useAuthGate from '@/hooks/UseAuthGate';
import { View, StyleSheet } from 'react-native';
import LoadingOverlay from '@/components/loading/LoadingOverlay';

/**
 * Wrapper you can put in any layout/page.
 * It derives the user's role from your user object shape.
 */
export default function AuthGate({
  children,
  loginPath = '/login',
  forbiddenPath = '/dashboard',
  allowRoles = undefined,     // e.g. ['AE']
  debounceMs = 0,
  overlayStyle = {},
}) {
  const { user, isAuthenticated, loading } = useAuth();

  // Try to normalize role from your various user payload shapes
  const role =
    user?.role ??
    user?.ae?.user?.role ??
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
    return (
      <View style={[styles.container, overlayStyle]}>
        <LoadingOverlay message={gateMessage} />
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