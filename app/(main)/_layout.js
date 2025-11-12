import { Slot } from 'expo-router';
import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '@/components/header/MainHeader';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  console.log("🟡 Main Layout Rendered");

  return (
    <SafeAreaProvider>
      <SafeAreaView 
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000000' : '#FFFFFF' }
        ]}
        edges={['top', 'bottom']}
      >
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#000000' : '#FFFFFF'}
        />
        
        {/* Fixed Header */}
        <View style={styles.header}>
          <MainHeader />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Slot />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});