import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

export default function RegisterProgressNav() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const progressValues = [
    { id: '1', name: 'Account Setup', path: '/register' },
    { id: '2', name: 'Establishment Information', path: '/register/establishment-information' },
    { id: '3', name: 'Contact and Address', path: '/register/contact-address' },
    { id: '4', name: 'Accreditation', path: '/register/accreditation' },
    { id: '5', name: 'Star Rating', path: '/register/star-rating' },
    { id: '6', name: 'Guest Log Setup', path: '/register/guest-log-setup' },
    { id: '7', name: 'Finishing Up', path: '/register/finishing-up' },
  ];

  const currentIndex = progressValues.findIndex(item => item.path === pathname);

  // Auto scroll active step into view
  useEffect(() => {
    if (scrollRef.current && currentIndex !== -1) {
      const scrollPosition = currentIndex * 150;
      scrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  }, [pathname, currentIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {progressValues.map((progressValue, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === progressValues.length - 1;

        return (
          <View key={progressValue.id} style={styles.stepWrapper}>
            <View style={styles.stepContainer}>
              <TouchableOpacity
                onPress={() => router.push(progressValue.path)}
                style={[
                  styles.circle,
                  (isCompleted || isActive) ? styles.circleActive : styles.circleInactive,
                  isDark && !isCompleted && !isActive && styles.circleDark
                ]}
              >
                <Text style={[
                  styles.circleText,
                  (isCompleted || isActive) ? styles.circleTextActive : isDark ? styles.circleTextDark : styles.circleTextLight
                ]}>
                  {progressValue.id}
                </Text>
              </TouchableOpacity>
              
              <Text style={[
                styles.labelText,
                isDark ? styles.labelTextDark : styles.labelTextLight
              ]}>
                {progressValue.name}
              </Text>
            </View>
            
            {!isLast && (
              <View style={[
                styles.line,
                isCompleted ? styles.lineCompleted : isDark ? styles.lineDark : styles.lineLight
              ]} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 40,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: '#8DC641',
  },
  circleInactive: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'transparent',
  },
  circleDark: {
    borderColor: '#fff',
  },
  circleText: {
    fontSize: 14,
  },
  circleTextActive: {
    color: '#fff',
  },
  circleTextLight: {
    color: '#000',
  },
  circleTextDark: {
    color: '#fff',
  },
  labelText: {
    marginTop: 4,
    width: 80,
    textAlign: 'center',
    fontSize: 12,
  },
  labelTextLight: {
    color: '#313638',
  },
  labelTextDark: {
    color: '#d5d6d7',
  },
  line: {
    width: 50,
    height: 4,
    marginTop: 10,
  },
  lineCompleted: {
    backgroundColor: '#8DC641',
  },
  lineLight: {
    backgroundColor: '#000',
  },
  lineDark: {
    backgroundColor: '#fff',
  },
});
