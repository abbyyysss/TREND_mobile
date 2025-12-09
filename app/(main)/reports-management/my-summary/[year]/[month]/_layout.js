import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/assets/theme/ThemeContext';
import NoResultsText from '@/components/text/NoResultsText';

export default function MySummaryReportLayout({ children }) {
  const { user, role } = useAuth();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {role === 'AE' ? (
        children
      ) : (
        <NoResultsText text="This page is unavailable for your account." />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});