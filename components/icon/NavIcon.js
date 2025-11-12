import { Image } from 'expo-image';
import { StyleSheet, useColorScheme } from 'react-native';

export default function NavIcon({ source, alt, size = 24, style }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Image
      source={source}
      alt={alt}
      style={[
        { width: size, height: size },
        isDark && styles.darkIcon,
        style
      ]}
      contentFit="contain"
      transition={400}
    />
  );
}

const styles = StyleSheet.create({
  darkIcon: {
    tintColor: '#ffffff',
  },
});