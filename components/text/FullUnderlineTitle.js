import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function FullUnderlineTitle({ text }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.text, isDark && styles.textDark]}>{text}</Text>
      <View style={[styles.underline, isDark && styles.underlineDark]} />
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
    color: '#1e1e1e',
    fontFamily: 'System',
  },
  textDark: {
    color: '#d2d2d2',
  },
  underline: {
    width: '100%',
    height: 1,
    backgroundColor: '#1e1e1e',
  },
  underlineDark: {
    backgroundColor: '#d2d2d2',
  },
});