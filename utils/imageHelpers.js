// utils/imageHelpers.js
import { BASE_URL } from '@/services/Constants';

/**
 * Builds a complete media URL from a path
 * @param {string} path - The media path (e.g., "/media/images/photo.jpg")
 * @returns {string|null} - Complete URL or null if path is invalid
 */
export function buildMediaUrl(path) {
  if (!path) return null;
  
  // If path already has a protocol (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path starts with /media, prepend BASE_URL
  if (path.startsWith('/media')) {
    return `${BASE_URL.replace(/\/$/, '')}${path}`;
  }
  
  // If path doesn't start with /, add it
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL.replace(/\/$/, '')}${normalizedPath}`;
}

/**
 * Builds a complete image URL specifically for image resources
 * @param {string} imagePath - The image path
 * @returns {string|null} - Complete image URL or null
 */
export function buildImageUrl(imagePath) {
  return buildMediaUrl(imagePath);
}

/**
 * Checks if a URL is valid and accessible
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL format
 */
export function isValidUrl(url) {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}