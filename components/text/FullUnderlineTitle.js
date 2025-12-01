import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function FullUnderlineTitle({ text, noUnderline = false }) {
  const { fonts, isDark, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: isDark ? colors.text : colors.text },
          { fontFamily: fonts.gotham }
        ]}
      >
        {text}
      </Text>

      {!noUnderline && (
        <View
          style={[
            styles.underline,
            { backgroundColor: isDark ? colors.textSecondary : colors.text }
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  underline: {
    width: '100%',
    height: 1.5,
    borderRadius: 10,
  },
});
