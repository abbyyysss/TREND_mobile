import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchAllMergedReports } from '@/services/ReportService';
import AEReportsTable from '@/components/table/AEReportsTable';
import FolderCard from '@/components/card/FolderCard';
import BackToRouteButton from '@/components/button/BackToRouteButton';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ReportsManagementID() {
  const { user, role } = useAuth();
  const { id } = useLocalSearchParams();
  const hasInitialized = useRef(false);
  const { colors, typography, spacing, fonts, radius } = useTheme();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const u = user?.user_profile;
  const username = u?.user?.username ?? 'User';
  const aeType = role === 'AE' ? u?.type : null;
  const reportMode = role === 'AE' ? u?.report_mode : null;
  const displayRole = aeType ? `${aeType} (${reportMode})` : role;

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(reportData.map((r) => r.year)))
      .filter(Boolean)
      .sort((a, b) => a - b);
    return years;
  }, [reportData]);

  const latestReports = useMemo(() => reportData.slice(0, 5), [reportData]);

  useEffect(() => {
    if (hasInitialized.current || !id) return;
    hasInitialized.current = true;

    const loadReports = async () => {
      setLoading(true);
      try {
        const mapped = await fetchAllMergedReports({ ae_profile: id });
        setReportData(mapped);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingWrapper}>
          <LoadingOverlay message="Loading reports..." />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, { padding: spacing.lg }]}
    >
      <BackToRouteButton
        title={reportData?.[0]?.aeName || 'Establishment'}
        route="/reports-management"
      />

      <View style={[styles.section, { marginTop: spacing.lg, gap: spacing.sm }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontFamily: fonts.gotham,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.weight.semibold,
            },
          ]}
        >
          Last Report Submitted
        </Text>
        <AEReportsTable reports={latestReports} />
      </View>

      <View style={[styles.foldersContainer, { marginTop: spacing.lg, gap: 12 }]}>
        {availableYears.map((year) => (
          <FolderCard key={year} id={id} year={year} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingWrapper: {
    height: 200,
  },
  section: {
    width: '100%',
    marginBottom: 25,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  foldersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
});