import { StyleSheet } from 'react-native';

// Base table styles
export const baseStyles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 0,
  },
  tableWrapper: {
    minWidth: 800,
  },
  headerRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  bodyRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableBody: {
    maxHeight: 500,
  },
  cell: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cellCheckInDate: {
    width: 120,
  },
  cellCheckInTime: {
    width: 120,
  },
  cellRoomID: {
    width: 100,
  },
  cellNoOfGuests: {
    width: 120,
  },
  cellLengthOfStay: {
    width: 180,
  },
  cellActions: {
    width: 200,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});

// Table container styles
export const tableContainerStyles = {
  borderWidth: 0,
  borderColor: '#DADADA',
  overflow: 'hidden',
};

// Header cell styles based on theme
export const getHeaderCellStyles = (isDark) => ({
  backgroundColor: isDark ? '#000000' : '#FFFFFF',
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#DADADA',
});

// Header text styles based on theme
export const getHeaderTextStyles = (isDark) => ({
  color: isDark ? '#FFFFFF' : '#000000',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'left',
});

// Body cell styles based on theme
export const getBodyCellStyles = (isDark) => ({
  backgroundColor: isDark ? '#000000' : '#FFFFFF',
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#DADADA',
});

// Body text styles based on theme
export const getBodyTextStyles = (isDark) => ({
  color: isDark ? '#E0E0E0' : '#000000',
  fontSize: 14,
  textAlign: 'left',
});

// Row hover/press styles (similar to MUI hover)
export const getRowHoverStyles = (isDark, pressed) => {
  if (pressed) {
    return {
      backgroundColor: isDark ? '#2A2A2A' : '#E8E8E8',
    };
  }
  return {};
};