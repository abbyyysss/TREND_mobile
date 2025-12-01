import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
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
import ObservationCard from '@/components/card/ObservationCard';
import { formatCompactNumber, formatReadableNumber } from '@/utils/numberFormatter';
import { useTheme } from '@/assets/theme/ThemeContext';
// import { fetchDashboardData } from './service/dashboardService';

console.log('ComparisonDateInput:', ComparisonDateInput);
console.log('MonthYearInput:', MonthYearInput);
console.log('ComparisonCard:', ComparisonCard);
console.log('TouristTypeChart:', TouristTypeChart);
console.log('MainCard:', MainCard);
console.log('VisitorGrowthRateChart:', VisitorGrowthRateChart);
console.log('MarketSourceChart:', MarketSourceChart);
console.log('OccupancyRateChart:', OccupancyRateChart);
console.log('ObservationCard:', ObservationCard);

export default function Dashboard() {
  const { colors, fonts, isDark } = useTheme();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false for UI testing
  
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

  // COMMENTED OUT: API DATA FETCHING - FOR UI FOCUS
  /*
  useEffect(() => {
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
        let calculatedCompareDate = compareDate;
        if (compareMode === 'Last month') {
          calculatedCompareDate = startOfMonth(subMonths(selectedMonthYear, 1));
        } else if (compareMode === 'Same month last year') {
          calculatedCompareDate = startOfMonth(subYears(selectedMonthYear, 1));
        }

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
  */

  // MOCK DATA FOR UI TESTING - Replace with real data later
  useEffect(() => {
    // Simulate data loading
    const mockData = {
      period: format(selectedMonthYear, 'yyyy-MM'),
      compare_period: format(compareDate, 'yyyy-MM'),
      kpis: {
        total_arrivals: { value: 125430, compare: 111500, pct_change: 12.5 },
        total_guest_nights: { value: 345678, compare: 320000, pct_change: 8.0 },
        total_rooms_occupied: { value: 45678, compare: 43000, pct_change: 6.2 },
        average_occupancy_rate: { value: 72.5, compare: 68.3, pct_change: 6.1 },
        average_length_of_stay: { value: 2.75, compare: 2.87, pct_change: -4.2 },
      },
      growth_rate: [
        { month: '2024-01', current: 10, previous: 8 },
        { month: '2024-02', current: 15, previous: 12 },
        { month: '2024-03', current: 12, previous: 10 },
        { month: '2024-04', current: 18, previous: 15 },
        { month: '2024-05', current: 20, previous: 18 },
        { month: '2024-06', current: 16, previous: 14 },
      ],
      domestic_foreign_ofw: [
        { month: '2024-01', domestic: { count: 100 }, foreign: { count: 80 }, ofw: { count: 30 } },
        { month: '2024-02', domestic: { count: 120 }, foreign: { count: 90 }, ofw: { count: 35 } },
        { month: '2024-03', domestic: { count: 110 }, foreign: { count: 85 }, ofw: { count: 32 } },
        { month: '2024-04', domestic: { count: 130 }, foreign: { count: 95 }, ofw: { count: 38 } },
        { month: '2024-05', domestic: { count: 140 }, foreign: { count: 100 }, ofw: { count: 40 } },
        { month: '2024-06', domestic: { count: 125 }, foreign: { count: 90 }, ofw: { count: 35 } },
      ],
      top_nationalities: [
        { country: 'UNITED STATES', current: 45000, pct_change: 12.5 },
        { country: 'JAPAN', current: 38000, pct_change: -5.2 },
        { country: 'SOUTH KOREA', current: 35000, pct_change: 8.3 },
        { country: 'CHINA', current: 32000, pct_change: 15.7 },
        { country: 'AUSTRALIA', current: 28000, pct_change: -3.1 },
      ],
      occupancy_rate_comp: [
        { month: '2024-01', ae_occupancy: 65, city_occupancy: 58 },
        { month: '2024-02', ae_occupancy: 72, city_occupancy: 65 },
        { month: '2024-03', ae_occupancy: 68, city_occupancy: 62 },
        { month: '2024-04', ae_occupancy: 75, city_occupancy: 70 },
      ],
      notes_obs: 'Strong performance in Q2 with significant growth in international arrivals. Domestic tourism shows steady growth. Recommend focusing on off-peak season promotions.',
    };
    
    setDashboardData(mockData);
  }, [selectedMonthYear, compareDate]);

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
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#D4AF37' : '#EBC855'} />
            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
              Loading dashboard data...
            </Text>
          </View>
        ) : dashboardData?.error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
              Failed to load data. Please try again later.
            </Text>
          </View>
        ) : dashboardData?.noData ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
              No results found for the selected period.
            </Text>
          </View>
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
    backgroundColor: '#fff',
  },
  safeAreaDark: {
    backgroundColor: '#000',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#313638',
  },
  loadingTextDark: {
    color: '#d2d2d2',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#313638',
  },
  errorTextDark: {
    color: '#d2d2d2',
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