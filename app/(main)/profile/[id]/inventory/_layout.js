import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { useProfileRoute } from '@/context/ProfileRouteContext';
import NoResultsText from '@/components/text/NoResultsText';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ProfileInventoryLayout() {
  const { colors } = useTheme();
  const { viewed, loading } = useProfileRoute();

  const profile = viewed?.user_profile ?? null;
  const account = profile?.user ?? null;
  const role = account?.role;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <NoResultsText text="Loading inventory..." isGap={false} />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}