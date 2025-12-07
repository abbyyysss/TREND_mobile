import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function CustomPagination({
  count = 3,
  page = 1,
  onChange,
  rowsPerPage = 5,
  hasPages = true,
  onRowsPerPageChange = () => {},
}) {
  const {colors, isDark, fonts} = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const perPageOptions = [5, 10, 20];

  const handlePageChange = (newPage) => {
    if (onChange && newPage >= 1 && newPage <= count) {
      onChange(null, newPage);
    }
  };

  const handleRowsChange = (option) => {
    onRowsPerPageChange(option);
    setDropdownVisible(false);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (count <= maxVisible) {
      for (let i = 1; i <= count; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', count);
      } else if (page >= count - 2) {
        pages.push(1, '...', count - 3, count - 2, count - 1, count);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', count);
      }
    }

    return pages;
  };

  return (
    <View style={styles.container}>
      {/* Pagination Controls */}
      <View style={styles.paginationWrapper}>
        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={[
            styles.navButton,
            page === 1 && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={page === 1 ? '#757575' : (isDark ? colors.text : '#313638')}
          />
        </TouchableOpacity>

        {/* Page Numbers */}
        <View style={styles.pageNumbers}>
          {renderPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <Text
                  key={`ellipsis-${index}`}
                  style={[
                    styles.ellipsis,
                    { color: isDark ? colors.text : '#313638',
                      fontFamily: fonts.gotham
                    }
                  ]}
                >
                  ...
                </Text>
              );
            }

            const isActive = pageNum === page;
            return (
              <TouchableOpacity
                key={pageNum}
                onPress={() => handlePageChange(pageNum)}
                style={[
                  styles.pageButton,
                  isActive && styles.pageButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    { color: isDark ? colors.text : '#313638', fontFamily: fonts.gotham },
                    isActive && styles.pageButtonTextActive,
                  ]}
                >
                  {pageNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => handlePageChange(page + 1)}
          disabled={page === count}
          style={[
            styles.navButton,
            page === count && styles.navButtonDisabled,
          ]}
        >
          <Ionicons
            name="arrow-forward"
            size={20}
            color={page === count ? '#757575' : (isDark ? colors.text : '#313638')}
          />
        </TouchableOpacity>
      </View>

      {/* Rows Per Page Selector */}
      {hasPages && (
        <View style={styles.rowsPerPageContainer}>
          <Text style={[
            styles.rowsPerPageLabel,
            { color: isDark ? colors.text : '#313638', fontFamily: fonts.gotham }
          ]}>
            No. of pages:
          </Text>

          <TouchableOpacity
            onPress={() => setDropdownVisible(true)}
            style={[
              styles.dropdownButton,
              { borderColor: isDark ? colors.border : '#9CA3AF' },
            ]}
          >
            <Text style={[
              styles.dropdownButtonText,
              { color: isDark ? colors.text : '#313638', fontFamily: fonts.gotham }
            ]}>
              {rowsPerPage}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={isDark ? '#E5E7EB' : '#313638'}
            />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          <Modal
            visible={dropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setDropdownVisible(false)}
            >
              <View style={[
                styles.dropdownMenu,
                { backgroundColor: isDark ? colors.surface : '#ffffff' }
              ]}>
                {perPageOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleRowsChange(option)}
                    style={[
                      styles.dropdownItem,
                      option === rowsPerPage && styles.dropdownItemActive,
                    ]}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      { color: isDark ? colors.text : '#313638', fontFamily: fonts.gotham }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  paginationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  pageButtonActive: {
    backgroundColor: '#F0C640',
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#FFFFFF',
  },
  ellipsis: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  rowsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  rowsPerPageLabel: {
    fontSize: 14,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 60,
  },
  dropdownButtonText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(240, 198, 64, 0.2)',
  },
  dropdownItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
});