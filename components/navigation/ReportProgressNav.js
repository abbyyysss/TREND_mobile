// ReportProgressNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function ReportProgressNav({ aeId, aeName, year, month }) {
  const router = useRouter();
  const { colors, fonts, spacing } = useTheme();

  const crumbs = [
    { label: 'Reports Management', href: '/reports-management' },
    aeId
      ? { label: aeName || 'Loading...', href: `/reports-management/${aeId}` }
      : { label: aeName || 'Loading...', href: '#' },
    ...(year
      ? [{ label: `${year} reports`, href: `/reports-management/${aeId}/${year}` }]
      : []),
    ...(year && month
      ? [{ label: `${month} ${year} report`, href: `/reports-management/${aeId}/${year}/${month}` }]
      : []),
  ];

  const handlePress = (href) => {
    if (href !== '#') {
      router.push(href);
    }
  };

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      {crumbs.map((crumb, i) => (
        <View key={i} style={[styles.crumbWrapper, { gap: spacing.sm }]}>
          <MaterialIcons 
            name="chevron-right" 
            size={16} 
            color="#D2D2D2" 
          />
          <TouchableOpacity
            onPress={() => handlePress(crumb.href)}
            activeOpacity={0.6}
            disabled={crumb.href === '#'}
          >
            <Text
              style={[
                styles.crumbText,
                { 
                  color: colors.text,
                  fontFamily: fonts.gotham,
                },
              ]}
            >
              {crumb.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  crumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crumbText: {
    fontSize: 14,
  },
});