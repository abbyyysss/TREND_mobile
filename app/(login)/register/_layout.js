import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { usePathname } from 'expo-router';
import { Slot } from 'expo-router';
import RegisterProgressNav from '@/components/navigation/RegisterProgressNav';

const stepMap = {
  '/register': { step: '1/7', title: 'ACCOUNT SETUP' },
  '/register/establishment-information': { step: '2/7', title: 'ESTABLISHMENT INFORMATION' },
  '/register/contact-address': { step: '3/7', title: 'CONTACT ADDRESS' },
  '/register/accreditation': { step: '4/7', title: 'ACCREDITATION' },
  '/register/star-rating': { step: '5/7', title: 'STAR RATING' },
  '/register/guest-log-setup': { step: '6/7', title: 'GUEST LOG SETUP' },
  '/register/finishing-up': { step: '7/7', title: 'FINISHING UP' },
};

export default function RegisterLayout() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentStep = stepMap[pathname] || { step: '', title: '' };

  // These routes should hide the header and title
  const hideLayoutElements = ['/register/confirmation', '/register/success'].includes(pathname);

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        hideLayoutElements && styles.containerCentered
      ]}
    >
      {!hideLayoutElements && <RegisterProgressNav />}

      {!hideLayoutElements ? (
        <View style={[
          styles.contentWrapper,
          isDark ? styles.borderDark : styles.borderLight
        ]}>
          <Text style={[
            styles.stepText,
            isDark ? styles.textDark : styles.textLight
          ]}>
            Step {currentStep.step}
          </Text>
          
          <Text style={[
            styles.titleText,
            isDark ? styles.textDark : styles.textLight
          ]}>
            {currentStep.title}
          </Text>
          
          <Slot />
        </View>
      ) : (
        <View style={styles.centeredContent}>
          <Slot />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  containerCentered: {
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 30,
    gap: 15,
  },
  borderLight: {
    borderTopColor: '#C0BFBF',
  },
  borderDark: {
    borderTopColor: '#4A4A4A',
  },
  stepText: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  centeredContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

