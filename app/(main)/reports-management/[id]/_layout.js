import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ReportProgressNav from '@/components/navigation/ReportProgressNav';
import { fetchMergedReports } from '@/services/ReportService';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import { useAuth } from '@/context/AuthContext';
import NoResultsText from '@/components/text/NoResultsText';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ReportsManagementIDLayout({ children }) {
  const { role } = useAuth();
  const { id, year, month } = useLocalSearchParams();
  const { colors, spacing } = useTheme();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMergedReports({ ae_profile: id });

        const reportData = Array.isArray(data?.mapped)
          ? data.mapped[0] || null
          : null;
        if (!reportData) {
          setError(`The user with ID ${id} doesn't exist or is unavailable.`);
          return;
        }

        setReport(reportData);
      } catch (err) {
        console.error('Failed to fetch report:', err);

        if (err.response?.status === 404 || err.response?.status === 500) {
          setError(`The user with ID ${id} doesn't exist or is unavailable.`);
        } else {
          setError('Failed to fetch report. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) loadReport();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingWrapper}>
          <LoadingOverlay message="Loading report..." />
        </View>
      </View>
    );
  }

  // only restrict AE role after a valid report exists
  if (role === 'AE') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <NoResultsText text="This page is unavailable for your account." />
      </View>
    );
  }

  if (error && role !== 'AE') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <NoResultsText text={error} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.layoutContent, { 
        paddingVertical: 30,
        paddingHorizontal: spacing.lg,
        gap: 15,
      }]}
    >
      <ReportProgressNav
        aeId={report?.ae_id}
        aeName={report?.aeName}
        year={year}
        month={month}
      />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContent: {
    flexGrow: 1,
  },
  loadingWrapper: {
    height: 150,
  },
});