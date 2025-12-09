import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { styles, getThemedStyles } from '@/styles/tableStyles';
import DefaultButton from '@/components/button/DefaultButton';
import OccupiedRoomsModal from '@/components/modal/OccupiedRoomsModal';
import { formatDate } from '@/utils/dateUtils';

export default function DailyBreakdownSummaryTable({ data = [], loading = false, aeId }) {
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const onClose = () => setModalOpen(false);

  return (
    <>
      <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.scrollView}
        >
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableHeader, themedStyles.tableHeader]}>
              <View style={[styles.headerCell, { width: 160 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>Day</Text>
              </View>
              <View style={[styles.headerCell, { width: 180 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>Day of the week</Text>
              </View>
              <View style={[styles.headerCell, { width: 180 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>No. of rooms occupied</Text>
              </View>
              <View style={[styles.headerCell, { width: 200 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>No. of guest check-ins</Text>
              </View>
              <View style={[styles.headerCell, { width: 200 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>No. of guest nights</Text>
              </View>
              <View style={[styles.headerCell, { width: 120 }]}>
                <Text style={[styles.headerText, themedStyles.headerText]}>Actions</Text>
              </View>
            </View>

            {/* Table Body */}
            <View style={styles.tableBody}>
              {loading ? (
                <View style={styles.emptyStateContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : data.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={[styles.emptyStateText, themedStyles.emptyStateText]}>
                    No daily breakdown found.
                  </Text>
                </View>
              ) : (
                data.map((row, index) => (
                  <View 
                    key={index} 
                    style={[styles.tableRow, themedStyles.tableRow]}
                  >
                    <View style={[styles.cell, { width: 160 }]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatDate(row.date)}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: 180 }]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {row.day_of_week}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: 180 }]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {row.rooms_occupied}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: 200 }]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {row.guest_checkins}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: 200 }]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {row.guest_nights}
                      </Text>
                    </View>
                    <View style={[styles.cell, { width: 120 }]}>
                      <DefaultButton
                        label="View"
                        isBlue
                        isTransparent
                        fullWidth={false}
                        onPress={() => {
                          setSelectedDate(row.date);
                          setModalOpen(true);
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      <OccupiedRoomsModal 
        visible={modalOpen} 
        onClose={onClose} 
        date={selectedDate} 
        aeId={aeId} 
      />
    </>
  );
}