import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, eachMonthOfInterval, startOfMonth, subMonths, subYears } from 'date-fns';
import ComparisonDateInput from '@/components/input/ComparisonDateInput';
import MonthYearInput from '@/components/input/MonthYearInput';
import ComparisonCard from '@/components/card/ComparisonCard';
import TouristTypeChart from '@/components/chart/TouristTypeChart';
import MainCard from '@/components/card/MainCard';
import VisitorGrowthRateChart from '@/components/chart/VisitorGrowthRateChart';
import MarketSourceChart from '@/components/chart/MarketSourceChart';
import OccupancyRateChart from '@/components/chart/OccupancyRateChart';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import NoResultsText from '@/components/text/NoResultsText';
import ObservationCard from '@/components/card/ObservationCard';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';
import { fetchDashboardData } from '@/services/DashboardService';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DashboardLayout() {
  const { colors, isDark } = useTheme();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [availablePeriods] = useState(() =>
    eachMonthOfInterval({
      start: subYears(startOfMonth(new Date()), 15),
      end: startOfMonth(new Date()),
    }).map((d) => format(d, 'yyyy-MM'))
  );

  const [selectedMonthYear, setSelectedMonthYear] = useState(startOfMonth(new Date()));
  const [compareMode, setCompareMode] = useState('Last month');
  const [compareDate, setCompareDate] = useState(subMonths(startOfMonth(new Date()), 1));

  const prevDepsRef = useRef(null);

  useEffect(() => {
    // Dependencies used for ref comparison
    const deps = {
      selectedMonthYear: format(selectedMonthYear, 'yyyy-MM'),
      compareMode,
      compareDate: compareMode === 'Custom range' ? format(compareDate, 'yyyy-MM') : null,
    };

    const currentDeps = JSON.stringify(deps);
    if (prevDepsRef.current === currentDeps) return;
    prevDepsRef.current = currentDeps;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Determine compare date based on mode
        let calculatedCompareDate = compareDate;
        if (compareMode === 'Last month') {
          calculatedCompareDate = startOfMonth(subMonths(selectedMonthYear, 1));
        } else if (compareMode === 'Same month last year') {
          calculatedCompareDate = startOfMonth(subYears(selectedMonthYear, 1));
        }

        // Only update state when not custom range
        if (compareMode !== 'Custom range') {
          setCompareDate(calculatedCompareDate);
        }

        let compareParam = 'last_month';
        if (compareMode === 'Same month last year') compareParam = 'last_year';
        else if (compareMode === 'Custom range') compareParam = 'custom_range';

        const params = {
          period: format(selectedMonthYear, 'yyyy-MM'),
          compare: compareParam,
        };
        if (compareParam === 'custom_range') {
          params.range = format(calculatedCompareDate, 'yyyy-MM');
        }

        const data = await fetchDashboardData(params);
        setDashboardData(data);
      } catch (error) {
        console.error('❌ Failed to fetch dashboard data:', error);
        setDashboardData({ error: true });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedMonthYear, compareMode, compareDate]);

  const transformedData = useMemo(() => {
    if (!dashboardData || dashboardData.error || dashboardData.noData) return null;

    const {
      kpis = {},
      growth_rate = [],
      domestic_foreign_ofw = [],
      top_nationalities = [],
      occupancy_rate_comp = [],
      notes_obs,
    } = dashboardData;

    const labels = (growth_rate || []).map((item) => format(new Date(item.month), 'MMM'));
    const currentData = (growth_rate || []).map((item) => item.current ?? 0);
    const previousData = (growth_rate || []).map((item) => item.previous ?? 0);

    const touristLabels = (domestic_foreign_ofw || []).map((item) =>
      format(new Date(item.month), 'MMM')
    );
    const domesticData = (domestic_foreign_ofw || []).map((item) => item.domestic?.count ?? 0);
    const foreignData = (domestic_foreign_ofw || []).map((item) => item.foreign?.count ?? 0);
    const ofwData = (domestic_foreign_ofw || []).map((item) => item.ofw?.count ?? 0);

    const marketSourceData = (top_nationalities || []).map((item) => ({
      country: item.country,
      value: item.current ?? 0,
      change: item.pct_change ?? 0,
    }));

    const formattedCompareMonth = format(new Date(dashboardData.compare_period), 'MMM yyyy');
    const currentYear = format(new Date(dashboardData.period), 'yyyy');
    const compareYear = format(new Date(dashboardData.compare_period), 'yyyy');

    return {
      kpis,
      labels,
      currentData,
      previousData,
      touristLabels,
      domesticData,
      foreignData,
      ofwData,
      marketSourceData,
      occupancy_rate_comp,
      notes_obs,
      formattedCompareMonth,
      currentYear,
      compareYear,
    };
  }, [dashboardData]);

  const renderKPICards = () => {
    if (!transformedData) return null;
    const { kpis, formattedCompareMonth } = transformedData;

    return (
      <View style={styles.kpiContainer}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <ComparisonCard
              titleText="Total Visitor Arrivals"
              statsText={kpis.total_arrivals.value.toLocaleString()}
              percentageText={formatCompactNumber(Math.abs(kpis.total_arrivals.pct_change ?? 0))}
              isIncreasing={kpis.total_arrivals.pct_change > 0}
              comparisonText={kpis.total_arrivals.compare.toLocaleString()}
              monthYearText={formattedCompareMonth}
            />
          </View>
          <View style={styles.kpiCard}>
            <ComparisonCard
              titleText="Total Guest Nights"
              statsText={kpis.total_guest_nights.value.toLocaleString()}
              percentageText={formatCompactNumber(
                Math.abs(kpis.total_guest_nights.pct_change ?? 0)
              )}
              isIncreasing={kpis.total_guest_nights.pct_change > 0}
              comparisonText={kpis.total_guest_nights.compare.toLocaleString()}
              monthYearText={formattedCompareMonth}
            />
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <ComparisonCard
              titleText="Total Rooms Occupied"
              statsText={kpis.total_rooms_occupied.value.toLocaleString()}
              percentageText={formatCompactNumber(
                Math.abs(kpis.total_rooms_occupied.pct_change ?? 0)
              )}
              isIncreasing={kpis.total_rooms_occupied.pct_change > 0}
              comparisonText={kpis.total_rooms_occupied.compare.toLocaleString()}
              monthYearText={formattedCompareMonth}
            />
          </View>
          <View style={styles.kpiCard}>
            <ComparisonCard
              titleText="Avg Occupancy Rate"
              statsText={`${kpis.average_occupancy_rate.value.toFixed(2)}%`}
              percentageText={formatCompactNumber(
                Math.abs(kpis.average_occupancy_rate.pct_change ?? 0)
              )}
              isIncreasing={kpis.average_occupancy_rate.pct_change > 0}
              comparisonText={`${kpis.average_occupancy_rate.compare.toFixed(2)}%`}
              monthYearText={formattedCompareMonth}
            />
          </View>
        </View>

        <View style={styles.kpiFullWidth}>
          <ComparisonCard
            titleText="Average Length of Stay"
            statsText={formatReadableNumber(kpis.average_length_of_stay.value)}
            percentageText={formatCompactNumber(
              Math.abs(kpis.average_length_of_stay.pct_change ?? 0)
            )}
            isIncreasing={kpis.average_length_of_stay.pct_change > 0}
            comparisonText={kpis.average_length_of_stay.compare.toFixed(2)}
            monthYearText={formattedCompareMonth}
          />
        </View>
      </View>
    );
  };

  const renderCharts = () => {
    if (!transformedData) return null;

    const {
      labels,
      currentData,
      previousData,
      touristLabels,
      domesticData,
      foreignData,
      ofwData,
      marketSourceData,
      occupancy_rate_comp,
      currentYear,
      compareYear,
    } = transformedData;

    return (
      <View style={styles.chartsContainer}>
        <MainCard style={styles.chartCard}>
          <VisitorGrowthRateChart
            title="Visitor Growth Rate"
            labels={labels}
            oldData={previousData}
            newData={currentData}
            period={currentYear}
            comparePeriod={compareYear}
          />
        </MainCard>

        <MainCard style={styles.chartCard}>
          <TouristTypeChart
            domesticData={domesticData}
            foreignData={foreignData}
            ofwData={ofwData}
            title={`Domestic vs Foreign vs OFW (${currentYear})`}
          />
        </MainCard>

        <MainCard style={styles.chartCard}>
          <MarketSourceChart
            title={
              currentYear === compareYear
                ? `Top 10 Sources of Market (${currentYear})`
                : `Top 10 Sources of Market (${compareYear} vs ${currentYear})`
            }
            data={marketSourceData}
          />
        </MainCard>

        <MainCard style={styles.chartCard}>
          <OccupancyRateChart
            title={`Occupancy Rate Comparison (${currentYear})`}
            data={occupancy_rate_comp}
          />
        </MainCard>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.monthYearPicker}>
            <MonthYearInput
              value={selectedMonthYear}
              onSelect={setSelectedMonthYear}
              availablePeriods={availablePeriods}
            />
          </View>
          <View style={styles.comparisonPicker}>
            <ComparisonDateInput
              value={compareDate}
              onChange={setCompareDate}
              mode={compareMode}
              onModeChange={setCompareMode}
              baseDate={selectedMonthYear}
              availablePeriods={availablePeriods}
            />
          </View>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <LoadingOverlay message="Loading dashboard data..." />
        ) : dashboardData?.error ? (
          <NoResultsText text="Failed to load data. Please try again later." />
        ) : dashboardData?.noData ? (
          <NoResultsText text="No results found for the selected period." />
        ) : (
          <>
            {/* KPI Cards */}
            {renderKPICards()}

            {/* Charts */}
            {renderCharts()}

            {/* Observation Card */}
            {transformedData?.notes_obs && (
              <ObservationCard message={transformedData.notes_obs} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  filtersContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 25,
    zIndex: 2000,
    position: 'relative',
  },
  monthYearPicker: {
    width: 225,
    zIndex: 2001,
  },
  comparisonPicker: {
    width: '100%',
    zIndex: 2000,
  },
  kpiContainer: {
    marginBottom: 25,
    gap: 15,
    zIndex: 1,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 15,
  },
  kpiCard: {
    flex: 1,
  },
  kpiFullWidth: {
    width: '100%',
  },
  chartsContainer: {
    gap: 20,
    marginBottom: 25,
    zIndex: 1,
  },
  chartCard: {
    marginBottom: 0,
  },
});