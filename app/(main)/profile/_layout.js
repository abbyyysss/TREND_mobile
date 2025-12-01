// import { useEffect, useMemo, useState } from 'react';
// import { View, Text, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { ProfileRouteProvider } from '@/context/ProfileRouteContext';
// import ProfileNav from '@/components/navigation/ProfileNav';
// import CameraIconButton from '@/components/button/CameraIconButton';
// import UploadPhotoModal from '@/components/modal/UploadPhotoModal';
// // import { useAuth } from '@/context/authContext';
// // import { getProfileById } from '@/services/ProfileService';
// // import { buildMediaUrl } from "@/utils/imageHelpers";

// // Sample data for testing
// const SAMPLE_DATA = {
//   user_profile: {
//     id: '123',
//     region: 'Western Visayas',
//     establishment_name: 'Beach Resort & Spa',
//     business_name: 'Paradise Beach Resort',
//     street_address: '123 Coastal Road',
//     barangay: 'Poblacion',
//     city_municipality: 'Iloilo City',
//     province: 'Iloilo',
//     accreditation_status: true,
//     user: {
//       username: 'paradise_resort',
//       role: 'AE',
//       profile_photo: 'https://picsum.photos/200',
//       cover_photo: 'https://picsum.photos/800/400',
//     }
//   }
// };

// export default function ProfileLayout({ children, route }) {
//   // ✅ All hooks at the top, unconditionally
//   const routeProfileId = route?.params?.id;
//   // const { user: me } = useAuth();
  
//   // Comment out auth and use sample data
//   const me = SAMPLE_DATA;

//   const myProfileId = me?.user_profile?.id ?? null;
//   const isMine = !!routeProfileId && !!myProfileId && String(routeProfileId) === String(myProfileId);

//   const [viewed, setViewed] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);
//   const [uploadPhotoContext, setUploadPhotoContext] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     async function load() {
//       if (!routeProfileId) {
//         if (mounted) { setNotFound(true); setLoading(false); }
//         return;
//       }
//       if (isMine && me) {
//         if (!mounted) return;
//         setViewed(me);
//         setNotFound(false);
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
      
//       // Comment out API call and use sample data
//       // const res = await getProfileById(routeProfileId);
//       const res = { ok: true, data: SAMPLE_DATA };
      
//       if (!mounted) return;
//       if (res?.ok && res?.data) {
//         setViewed(res.data);
//         setNotFound(false);
//       } else {
//         setViewed(null);
//         setNotFound(true);
//       }
//       setLoading(false);
//     }

//     load();
//     return () => { mounted = false; };
//   }, [routeProfileId, isMine, me]);

//   // derive display fields (no early returns)
//   const profile = viewed?.user_profile ?? null;
//   const account = profile?.user ?? null;

//   // Comment out buildMediaUrl and use direct URLs
//   const profilePhoto =
//     profile?.user?.profile_photo || "https://via.placeholder.com/200";

//   const coverPhoto =
//     profile?.user?.cover_photo || "https://via.placeholder.com/800x400";

//   const displayName = useMemo(() => {
//     if (loading) return 'Loading...';
//     return profile?.establishment_name || profile?.business_name || account?.username || 'Profile';
//   }, [loading, profile, account]);

//   const address = [
//     profile?.street_address, 
//     profile?.barangay, 
//     profile?.city_municipality, 
//     profile?.province
//   ].filter(Boolean).join(', ');

//   const isVerified = profile?.accreditation_status === true;

//   // ✅ Choose what to render without returning early
//   let content;
//   if (notFound) {
//     content = (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>
//           The user with ID {routeProfileId} doesn't exist or is unavailable.
//         </Text>
//       </View>
//     );
//   } else {
//     content = (
//       <ScrollView style={styles.container}>
//         <View style={styles.contentWrapper}>
//           {/* Cover Photo */}
//           <ImageBackground
//             source={{ uri: coverPhoto }}
//             style={styles.coverPhoto}
//             imageStyle={styles.coverPhotoImage}
//           >
//             {/* Profile Photo */}
//             <View style={styles.profilePhotoContainer}>
//               <Image
//                 source={{ uri: profilePhoto }}
//                 style={styles.profilePhoto}
//               />
//               <View style={styles.profileCameraButton}>
//                 <CameraIconButton onPress={() => setUploadPhotoContext('profile')} />
//               </View>
//             </View>

//             {/* Cover Photo Camera Button */}
//             <View style={styles.coverCameraButton}>
//               <CameraIconButton onPress={() => setUploadPhotoContext('cover')} />
//             </View>
//           </ImageBackground>

//           {/* Profile Info Section */}
//           <View style={styles.profileInfoSection}>
//             <View style={styles.profileInfo}>
//               <View style={styles.nameContainer}>
//                 <Text style={styles.displayName}>
//                   {displayName}
//                 </Text>
//                 {isVerified && (
//                   <FontAwesome5 name="award" size={20} color="#8DC641" style={styles.verifiedIcon} />
//                 )}
//               </View>
//               {!!address && (
//                 <Text style={styles.addressText}>{address}</Text>
//               )}
//             </View>

//             {/* Navigation Border */}
//             <View style={styles.navBorder}>
//               <View style={styles.navContainer}>
//                 <ProfileNav myId={profile?.id} role="AE" />
//               </View>
//             </View>

//             {/* Content Area */}
//             <View style={styles.childrenContainer}>
//               {children}
//             </View>
//           </View>
//         </View>

//         <UploadPhotoModal
//           visible={!!uploadPhotoContext}
//           onClose={() => setUploadPhotoContext(null)}
//           label={uploadPhotoContext === 'profile' ? 'PROFILE PHOTO' : 'COVER PHOTO'}
//           description={
//             uploadPhotoContext === 'profile'
//               ? 'Profile photo changed successfully.'
//               : 'Cover photo changed successfully.'
//           }
//         />
//       </ScrollView>
//     );
//   }

//   return (
//     <ProfileRouteProvider value={{ viewed, isMine, loading }}>
//       {content}
//     </ProfileRouteProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   contentWrapper: {
//     width: '100%',
//   },
//   coverPhoto: {
//     width: '100%',
//     height: 192, // 12rem equivalent
//     backgroundColor: '#828282',
//     borderWidth: 1,
//     borderColor: '#DADADA',
//   },
//   coverPhotoImage: {
//     resizeMode: 'cover',
//   },
//   profilePhotoContainer: {
//     position: 'absolute',
//     height: 128, // 8rem equivalent
//     width: 128,
//     left: 10,
//     bottom: -64, // -4rem equivalent
//     borderRadius: 64,
//     borderWidth: 2,
//     borderColor: '#DADADA',
//     overflow: 'hidden',
//   },
//   profilePhoto: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   profileCameraButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 0,
//   },
//   coverCameraButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//   },
//   profileInfoSection: {
//     width: '100%',
//     marginTop: 48, // 3rem equivalent
//   },
//   profileInfo: {
//     marginHorizontal: 10,
//     marginBottom: 16,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   displayName: {
//     color: '#313638',
//     fontSize: 25,
//     lineHeight: 30,
//     fontWeight: '600',
//   },
//   verifiedIcon: {
//     marginLeft: 8,
//   },
//       addressText: {
//     color: '#757575',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   errorText: {
//     color: '#313638',
//     fontSize: 16,
//     padding: 20,
//     textAlign: 'center',
//   },
//   navBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#D2D2D2',
//     width: '100%',
//   },
//   navContainer: {
//     marginLeft: 10,
//   },
//   childrenContainer: {
//     width: '100%',
//     paddingVertical: 30,
//   },
// });