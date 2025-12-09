import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AEReportMode } from '@/services/Constants';
import { useTheme } from '@/assets/theme/ThemeContext';
import DefaultButton from '../button/DefaultButton';

export default function SummaryCard({ onOpenMonthlyReport, reportStatus }) {
  const router = useRouter();
  const { user, role } = useAuth();
  const { colors, spacing, typography, fonts, radius, isDark } = useTheme();

  const u = user?.user_profile;
  const aeType = role === 'AE' ? u?.type : null;
  const reportMode = role === 'AE' ? u?.report_mode : null;

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

  const handleViewReport = () => {
    router.push(`/reports-management/my-summary/${currentYear}/${currentMonth}`);
  };

  const styles = StyleSheet.create({
    container: {
      gap: 10,
    },
    card: {
      width: '100%',
      borderWidth: 1,
      borderColor: isDark ? '#444444' : '#9CA3AF',
      borderRadius: radius.xl || 16,
      padding: 15,
      backgroundColor: isDark ? colors.card : colors.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardMd: {
      padding: 20,
    },
    title: {
      fontSize: 20,
      color: isDark ? '#FFFFFF' : '#000000',
      fontFamily: fonts.gotham || 'System',
      fontWeight: typography.weight.semibold || '600',
      marginBottom: 5,
    },
    titleMd: {
      fontSize: 25,
    },
    subtitle: {
      color: '#757575',
      fontSize: 11,
      marginTop: 2,
    },
    subtitleMd: {
      fontSize: 13,
    },
    buttonContainer: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 10,
      width: 125,
    },
    buttonContainerMd: {
      width: 150,
    },
    disclaimer: {
      fontSize: 12,
      color: isDark ? '#d5d6d7' : '#313638',
      lineHeight: 18,
    },
    disclaimerMd: {
      fontSize: 14,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardMd]}>
        <Text style={[styles.title, styles.titleMd]}>
          {reportMode === AEReportMode.DAILY
            ? `Summary for ${monthYearLabel}`
            : `Current reporting period: ${monthYearLabel}`}
        </Text>

        {reportMode === AEReportMode.DAILY && (
          <Text style={[styles.subtitle, styles.subtitleMd]}>
            *This is automatically generated from your guest logs.
          </Text>
        )}

        {reportMode === AEReportMode.DAILY ? (
          <View style={[styles.buttonContainer, styles.buttonContainerMd]}>
            <DefaultButton
              onPress={handleViewReport}
              label="View"
              isBlue={true}
              fontSize={13}
              paddingVertical={5}
              fullWidth={true}
            />
          </View>
        ) : (
          <View style={[styles.buttonContainer, styles.buttonContainerMd]}>
            <DefaultButton
              onPress={onOpenMonthlyReport}
              label={getButtonLabel()}
              fontSize={13}
              paddingVertical={5}
              fullWidth={true}
            />
          </View>
        )}
      </View>

      <Text style={[styles.disclaimer, styles.disclaimerMd]}>
        {reportMode === AEReportMode.DAILY
          ? '*The monthly summary for the daily guest logs of the current month will be available for submission at the start of the succeeding month. The deadline for submission is every 5th of the succeeding month.'
          : '*The deadline for submission is every 5th of the succeeding month.'}
      </Text>
    </View>
  );
}