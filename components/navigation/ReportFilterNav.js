import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
// import { useAuth } from '@/context/authContext';
// import { AEReportMode } from '@/services/constants';

export default function ReportFilterNav({ activeFilter, onFilterChange }) {
//   const { user, role } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

//   const u = user?.user_profile;
//   const aeType = role === 'AE' ? u?.type : null;
//   const reportMode = role === 'AE' ? u?.report_mode : null;

  let filterOptions = ['All', 'Auto', 'Pending', 'Submitted', 'Flagged', 'Missing'];

  if (role === 'AE') {
    if (reportMode === AEReportMode.DAILY) {
      filterOptions = ['All', 'Auto', 'Flagged'];
    } else {
      filterOptions = ['All', 'Pending', 'Submitted', 'Flagged', 'Missing'];
    }
  }

  const theme = {
    text: {
      active: '#D4AF37',
      inactive: isDark ? '#d5d6d7' : '#313638',
    },
    background: {
      active: isDark ? '#0B0B0B' : '#F4F4F4',
      inactive: 'transparent',
    },
    border: isDark ? '#666666' : '#9ca3af',
  };

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter
                    ? theme.background.active
                    : theme.background.inactive,
              },
            ]}
            onPress={() => onFilterChange(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === filter
                      ? theme.text.active
                      : theme.text.inactive,
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});