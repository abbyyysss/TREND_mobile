import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function RegisterProgressNav() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef(null);
  const { colors, isDark, radius, typography } = useTheme();

  const progressValues = [
    { id: '1', name: 'Account Setup', path: '/register' },
    { id: '2', name: 'Establishment Information', path: '/register/establishment-information' },
    { id: '3', name: 'Contact and Address', path: '/register/contact-address' },
    { id: '4', name: 'Accreditation', path: '/register/accreditation' },
    { id: '5', name: 'Star Rating', path: '/register/star-rating' },
    { id: '6', name: 'Reporting Mode', path: '/register/reporting-mode' },
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
                  {
                    backgroundColor: (isCompleted || isActive) 
                      ? '#8DC641' 
                      : 'transparent',
                    borderWidth: (isCompleted || isActive) ? 0 : 1,
                    borderColor: colors.text,
                  }
                ]}
              >
                <Text style={[
                  styles.circleText,
                  {
                    color: (isCompleted || isActive) ? '#fff' : colors.text,
                    fontSize: typography.fontSize.sm,
                  }
                ]}>
                  {progressValue.id}
                </Text>
              </TouchableOpacity>
              
              <Text style={[
                styles.labelText,
                {
                  color: colors.text,
                  fontSize: typography.fontSize.xs,
                }
              ]}>
                {progressValue.name}
              </Text>
            </View>
            
            {!isLast && (
              <View style={[
                styles.line,
                {
                  backgroundColor: isCompleted ? '#8DC641' : colors.text,
                }
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
  circleText: {
    fontWeight: '500',
  },
  labelText: {
    marginTop: 4,
    width: 80,
    textAlign: 'center',
  },
  line: {
    width: 50,
    height: 4,
    marginTop: 10,
  },
});