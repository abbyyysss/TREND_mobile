import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DefaultButton from '../button/DefaultButton';
import { formatReadableNumber } from '@/utils/numberFormatter';
import { styles, getThemedStyles } from '@/styles/tableStyles';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function GuestLogTable({ 
  openGuestLogModal, 
  data = [], 
  loading, 
  onDelete 
}) {
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  const renderRow = (row, index) => (
    <View key={row.id} style={[styles.tableRow, themedStyles.tableRow]}>
      {/* Check in date */}
      <View style={[styles.cell, styles.checkInDateCell]}>
        <Text style={[styles.cellText, themedStyles.cellText]}>
          {row.checkInDate}
        </Text>
      </View>

      {/* Checked in at */}
      <View style={[styles.cell, styles.checkInTimeCell]}>
        <Text style={[styles.cellText, themedStyles.cellText]}>
          {row.checkInAt}
        </Text>
      </View>

      {/* Room ID */}
      <View style={[styles.cell, styles.roomIDCell]}>
        <Text style={[styles.cellText, themedStyles.cellText]}>
          {row.room_id}
        </Text>
      </View>

      {/* No. of guests */}
      <View style={[styles.cell, styles.noOfGuestsCell]}>
        <Text style={[styles.cellText, themedStyles.cellText]}>
          {formatReadableNumber(row.noOfGuests)}
        </Text>
      </View>

      {/* Length of stay */}
      <View style={[styles.cell, styles.lengthOfStayCell]}>
        <Text style={[styles.cellText, themedStyles.cellText]}>
          {formatReadableNumber(row.lengthOfStay)}
        </Text>
      </View>

      {/* Actions */}
      <View style={[styles.cell, styles.actionsCell]}>
        <View style={styles.actionsContainer}>
          <DefaultButton
            label="View"
            isBlue
            isTransparent
            fullWidth={false}
            onClick={() => openGuestLogModal('view', row.id)}
          />
          <DefaultButton
            label="Edit"
            isTransparent
            fullWidth={false}
            onClick={() => openGuestLogModal('edit', row.id)}
          />
          <DefaultButton
            label="Delete"
            isTransparent
            isRed
            fullWidth={false}
            onClick={() => onDelete(row.id)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.scrollView}
      >
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Check in date
              </Text>
            </View>
            <View style={[styles.headerCell, styles.checkInTimeCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Checked in at
              </Text>
            </View>
            <View style={[styles.headerCell, styles.roomIDCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Room ID
              </Text>
            </View>
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                No. of guests
              </Text>
            </View>
            <View style={[styles.headerCell, styles.lengthOfStayCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Length of stay (in nights)
              </Text>
            </View>
            <View style={[styles.headerCell, styles.actionsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Actions
              </Text>
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
                  No guest logs found.
                </Text>
              </View>
            ) : (
              data.map((row, index) => renderRow(row, index))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}