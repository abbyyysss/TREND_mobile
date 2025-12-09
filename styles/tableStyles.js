import { StyleSheet } from 'react-native';

// Base styles (non-themed)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    minWidth: '100%',
    borderWidth: 0,
  },
  
  // Header styles
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  headerCell: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
  },
  
  // Body styles
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    textAlign: 'left',
  },
  
  // Column widths (mobile-optimized)
  checkInDateCell: {
    width: 250,
  },
  checkInTimeCell: {
    width: 150,
  },
  roomIDCell: {
    width: 200,
  },
  noOfGuestsCell: {
    width: 135,
  },
  lengthOfStayCell: {
    width: 135,
  },
  actionsCell: {
    width: 360,
  },
  
  // Actions
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  // Empty states
  emptyStateContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
  },
});

// Theme-aware style generators (using ThemeContext colors and fonts)
export const getThemedStyles = (isDark, colors, fonts) => {
  return StyleSheet.create({
    tableHeader: {
      backgroundColor: isDark ? colors.card : colors.background,
      borderColor: colors.border,
    },
    headerText: {
      color: isDark ? colors.text : colors.text,
      fontFamily: fonts.gotham,
    },
    tableRow: {
      backgroundColor: isDark ? colors.card : colors.background,
      borderColor: colors.border,
    },
    cellText: {
      color: isDark ? colors.foreground : colors.text,
      fontFamily: fonts.gotham,
    },
    emptyStateText: {
      color: colors.textSecondary,
      fontFamily: fonts.gotham,
    },
  });
};

// Additional style generators matching the original MUI implementation
// Updated to use ThemeContext colors
export const getHeaderCellSx = (isDark, colors, fonts) => ({
  fontWeight: '600',
  backgroundColor: isDark ? colors.card : colors.background,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: colors.border,
  color: colors.text,
  textAlign: 'left',
  fontSize: 14,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontFamily: fonts.gotham,
});

export const getBodyCellSx = (isDark, colors, fonts) => ({
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: colors.border,
  color: isDark ? colors.foreground : colors.text,
  backgroundColor: isDark ? colors.card : colors.background,
  textAlign: 'left',
  fontSize: 14,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontFamily: fonts.gotham,
});

export const tableContainerSx = (colors) => ({
  borderWidth: 0,
  borderColor: colors.border,
});

export const getRowSx = (isDark, colors) => ({
  cursor: 'pointer',
  backgroundColor: isDark ? colors.card : colors.background,
  hoverBackgroundColor: isDark ? '#2A2A2A' : '#E8E8E8',
  transition: 'background-color 120ms ease',
});