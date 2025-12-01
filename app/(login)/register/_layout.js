import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { usePathname } from 'expo-router';
import { Slot } from 'expo-router';
import RegisterProgressNav from '@/components/navigation/RegisterProgressNav';
import { useTheme } from '@/assets/theme/ThemeContext';   

const stepMap = {
  '/register': { step: '1/7', title: 'ACCOUNT SETUP' },
  '/register/establishment-information': { step: '2/7', title: 'ESTABLISHMENT INFORMATION' },
  '/register/contact-address': { step: '3/7', title: 'CONTACT AND ADDRESS' },
  '/register/accreditation': { step: '4/7', title: 'ACCREDITATION' },
  '/register/star-rating': { step: '5/7', title: 'STAR RATING' },
  '/register/reporting-mode': { step: '6/7', title: 'GUEST LOG SETUP' },
  '/register/finishing-up': { step: '7/7', title: 'FINISHING UP' },
};

export default function RegisterLayout() {
  const pathname = usePathname();
  const { colors, fonts, isDark, radius, spacing } = useTheme();
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
          colors.border && { borderTopColor: colors.border}
        ]}>
          <Text style={[
            styles.stepText,
            {color: colors.textSecondary},
            {fontFamily: fonts.gotham}
          ]}>
            Step {currentStep.step}
          </Text>
          
          <Text style={[
            styles.titleText,
            {color: colors.text,
            fontFamily: fonts.barabara},
          ]}>
            {currentStep.title }
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
  stepText: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  centeredContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

