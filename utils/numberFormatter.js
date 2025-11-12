// utils/numberFormatter.js

/**
 * Formats numbers for compact display (e.g., 1.2K, 2.5M, 3.1B).
 * Ideal for chart axes.
 */
export function formatCompactNumber(value) {
  if (value == null || isNaN(value)) return '';

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value.toString();
  }
}

/**
 * Formats numbers with commas for readability.
 * Example: 1000000 → "1,000,000"
 */
export function formatReadableNumber(value) {
  if (value == null || isNaN(value)) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}