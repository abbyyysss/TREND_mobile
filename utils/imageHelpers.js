// utils/imageHelpers.js
// For Expo, you'll typically store your backend URL in app.config.js or as an environment variable
import Constants from 'expo-constants';

export function buildMediaUrl(path) {
  if (!path) return null;
  
  // Access environment variables in Expo
  // Option 1: From app.config.js extra field
  const backendBase = Constants.expoConfig?.extra?.backendUrl || 
                      // Option 2: From environment (if using expo-constants)
                      process.env.EXPO_PUBLIC_BACKEND_URL ||
                      // Fallback for development
                      "http://localhost:8000";
  
  return path.startsWith("/media") ? `${backendBase}${path}` : path;
}

// Alternative buildMediaUrl without expo-constants dependency
export function buildMediaUrlSimple(path) {
  if (!path) return null;
  
  // You can hardcode or use a config file
  const backendBase = "http://localhost:8000"; // or your production URL
  
  return path.startsWith("/media") ? `${backendBase}${path}` : path;
}