import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/assets/theme/ThemeContext";

export default function FilterSelectInput({
  options = [],
  placeholder = "Select an option",
  placeholderOption = "",
  onSelect = () => {},
  value = "",
  isFilterIcon = false,
  disabled = false,
}) {
  const { colors, spacing, typography, radius, fonts } = useTheme();

  const isDisabled = Boolean(disabled);

  // Initial value priority
  const initialValue = value || placeholderOption || "";

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [selected, setSelected] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  const lastSelectedRef = useRef(initialValue);

  // Merge placeholder option
  const mergedOptions = useMemo(() => {
    return placeholderOption ? [placeholderOption, ...options] : [...options];
  }, [placeholderOption, options]);

  // Filter list based on text
  const filtered = useMemo(() => {
    if (!hasTyped) return mergedOptions;
    const q = searchQuery.toLowerCase();

    return mergedOptions.filter((opt) => {
      const label = typeof opt === "object" ? opt.label : opt;
      return label.toLowerCase().includes(q);
    });
  }, [hasTyped, searchQuery, mergedOptions]);

  // Handle selection
  const handleSelect = useCallback(
    (option) => {
      const label = typeof option === "object" ? option.label : option;

      setSelected(label);
      setSearchQuery(label);
      setHasTyped(false);
      setIsOpen(false);
      lastSelectedRef.current = label;

      onSelect(label);
    },
    [onSelect]
  );

  // Close modal
  const handleModalClose = useCallback(() => {
    setIsOpen(false);

    // Restore last valid selection
    if (!selected && lastSelectedRef.current) {
      setSelected(lastSelectedRef.current);
      setSearchQuery(lastSelectedRef.current);
    }

    setHasTyped(false);
  }, [selected]);

  // Sync parent value changes
  useEffect(() => {
    if (value !== selected) {
      setSelected(value);
      setSearchQuery(value);
      lastSelectedRef.current = value;
    }
  }, [value]);

  return (
    <View style={{ marginBottom: spacing.sm }}>
      {/* Label */}
      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: isDisabled ? colors.textSecondary : colors.text,
          fontFamily: fonts.gotham,
          marginBottom: spacing.xs,
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        {placeholder}
      </Text>

      {/* Main button */}
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          backgroundColor: isDisabled ? colors.secondary : colors.surface,
        }}
      >
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            if (!isDisabled) {
              setIsOpen(true);
              setHasTyped(false);
            }
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            opacity: isDisabled ? 0.5 : 1,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              flex: 1,
              color: searchQuery ? colors.text : colors.placeholder,
              fontFamily: fonts.gotham,
              fontSize: typography.fontSize.md,
            }}
            numberOfLines={1}
          >
            {searchQuery || placeholder}
          </Text>

          {isFilterIcon ? (
            <Ionicons
              name="filter-outline"
              size={16}
              color={isDisabled ? colors.textSecondary : colors.text}
            />
          ) : (
            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={isDisabled ? colors.textSecondary : colors.text}
        
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={handleModalClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              width: "80%",
              maxWidth: 400,
              maxHeight: 350,
            }}
          >
            {/* Search input */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                padding: spacing.md,
              }}
            >
              <TextInput
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setHasTyped(text.trim().length > 0);
                }}
                style={{
                  color: colors.text,
                  fontSize: typography.fontSize.md,
                  fontFamily: fonts.gotham,
                  padding: spacing.sm,
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
                }}
                placeholder="Search..."
                placeholderTextColor={colors.placeholder}
                autoFocus
              />
            </View>

            {/* Options */}
            <ScrollView style={{ padding: spacing.xs }}>
              {filtered.length > 0 ? (
                filtered.map((option, idx) => {
                  const label =
                    typeof option === "object" ? option.label : option;
                  const key =
                    typeof option === "object" ? option.key : option;

                  const isPlaceholder = placeholderOption && idx === 0;

                  return (
                    <TouchableOpacity
                      key={`${key}-${idx}`}
                      disabled={Boolean(isPlaceholder)}
                      onPress={() => handleSelect(option)}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.md,
                        backgroundColor:
                          selected === label ? colors.primary + "22" : "transparent",
                        opacity: isPlaceholder ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          color: isPlaceholder
                            ? colors.textSecondary
                            : colors.text,
                          fontSize: typography.fontSize.md,
                          fontFamily: fonts.gotham,
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={{ padding: spacing.md, alignItems: "center" }}>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.fontSize.sm,
                      fontFamily: fonts.gotham,
                    }}
                  >
                    No results found
                  </Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
