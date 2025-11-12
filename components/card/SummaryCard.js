import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/authContext';
// import { AEReportMode } from '@/services/constants';
import DefaultButton from '../button/DefaultButton';

export default function SummaryCard({ onOpenMonthlyReport, reportStatus }) {
  const router = useRouter();
//   const { user, role } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

//   const u = user?.user_profile;
//   const aeType = role === 'AE' ? u?.type : null;
//   const reportMode = role === 'AE' ? u?.report_mode : null;

  const today = new Date();
  const currentMonth = today.toLocaleString('en-US', { month: 'long' });
  const currentYear = today.getFullYear();
  const monthYearLabel = `${currentMonth} ${currentYear}`;

  // Determine button label based on status
  const getButtonLabel = () => {
    if (reportStatus?.toLowerCase() === 'submitted') {
      return 'Edit Report';
    }
    return 'Create report';
  };

  const theme = {
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      secondary: '#757575',
    },
    border: '#9ca3af',
    background: isDark ? '#1a1a1a' : '#ffffff',
    shadow: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text.primary }]}>
          {reportMode === AEReportMode.DAILY
            ? `Summary for ${monthYearLabel}`
            : `Current reporting period: ${monthYearLabel}`}
        </Text>

        {reportMode === AEReportMode.DAILY && (
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            *This is automatically generated from your guest logs.
          </Text>
        )}

        <View style={styles.buttonContainer}>
          {reportMode === AEReportMode.DAILY ? (
            <DefaultButton
              onPress={() =>
                router.push(`/reports-management/my-summary/${currentYear}/${currentMonth}`)
              }
              label="View"
              fontSize={13}
              isBlue={true}
            />
          ) : (
            <DefaultButton
              onPress={onOpenMonthlyReport}
              label={getButtonLabel()}
              fontSize={13}
            />
          )}
        </View>
      </View>

      <Text style={[styles.footerText, { color: theme.text.primary }]}>
        {reportMode === AEReportMode.DAILY
          ? '*The monthly summary for the daily guest logs of the current month will be available for submission at the start of the succeeding month. The deadline for submission is every 5th of the succeeding month.'
          : '*The deadline for submission is every 5th of the succeeding month.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingTop: 8,
    width: 125,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
  },
});