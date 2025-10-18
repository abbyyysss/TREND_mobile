// utils/aeTypes.js
// Map enum keys to readable labels
export const AE_TYPE_LABELS = {
  MABUHAY_ACCOMMODATION: "Mabuhay Accommodation",
  HOTEL: "Hotel",
  RESORT: "Resort",
  GUEST_HOUSE: "Guest House",
  APARTMENT: "Apartment",
  HOSTEL: "Hostel",
};

/**
 * Convert an AE type enum key to a human-readable label.
 * If no match is found, it returns the original value (or "N/A").
 *
 * @param {string} type - The enum key (e.g., "GUEST_HOUSE")
 * @returns {string} - The human-readable label (e.g., "Guest House")
 */
export const formatAEType = (type) => {
  if (!type) return "N/A";
  return AE_TYPE_LABELS[type] || type;
};

/**
 * Convert a readable label back to enum format for backend.
 * Example: "Guest House" -> "GUEST_HOUSE"
 *
 * @param {string} readableType - Human readable label
 * @returns {string} - Backend enum format
 */
export const formatAETypeForBackend = (readableType) => {
  if (!readableType) return "";
  return readableType.replace(/\s+/g, "_").toUpperCase();
};

/**
 * Get all available AE types as an array of objects for dropdowns/pickers
 * Useful for React Native Picker or similar components
 * 
 * @returns {Array<{label: string, value: string}>}
 */
export const getAETypeOptions = () => {
  return Object.entries(AE_TYPE_LABELS).map(([value, label]) => ({
    label,
    value,
  }));
};

/**
 * Get all readable labels as an array
 * Useful for React Native Picker that only needs labels
 * 
 * @returns {Array<string>}
 */
export const getAETypeLabels = () => {
  return Object.values(AE_TYPE_LABELS);
};

/**
 * Get all enum keys as an array
 * 
 * @returns {Array<string>}
 */
export const getAETypeKeys = () => {
  return Object.keys(AE_TYPE_LABELS);
};