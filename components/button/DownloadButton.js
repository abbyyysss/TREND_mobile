import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function DownloadButton({
  iconSize = 24,
  onClick,
  type = 'button',
  text = 'Download',
}) {
  const { colors, spacing, radius } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        onPress={onClick}
        onLongPress={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        style={{
          padding: spacing.sm,
          borderRadius: radius.full,
        }}
      >
        <MaterialIcons 
          name="download-for-offline" 
          size={iconSize} 
          color={colors.text} 
        />
      </TouchableOpacity>

      {/* Tooltip on long press */}
      {showTooltip && (
        <View
          style={{
            position: 'absolute',
            top: -35,
            left: '50%',
            transform: [{ translateX: -40 }],
            backgroundColor: colors.card,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: radius.sm,
            borderWidth: 1,
            borderColor: colors.border,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 1000,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </Text>
          {/* Tooltip arrow */}
          <View
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: [{ translateX: -6 }],
              width: 0,
              height: 0,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: colors.card,
            }}
          />
        </View>
      )}
    </View>
  );
}