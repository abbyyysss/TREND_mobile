// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { useAuth } from '@/context/AuthContext';
// import { AEReportMode } from '@/services/Constants';
// import NoResultsText from '@/components/text/NoResultsText';

// export default function GuestLogLayout({ children }) {
//   const { user, role } = useAuth();

//   const u = user?.user_profile;
//   const aeType = role === 'AE' ? u?.type : null;
//   const reportMode = role === 'AE' ? u?.report_mode : null;

//   return (
//     <View style={styles.container}>
//       {reportMode === AEReportMode.DAILY ? (
//         children
//       ) : (
//         <NoResultsText text="This page is unavailable for your account." />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });