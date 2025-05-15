// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// const EventDetailsScreen = ({ route, navigation }) => {
//   const { event } = route.params;

//   if (!event) {
//     return (
//       <View style={styles.centered}>
//         <Text>Event details not available.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {event.image && <Image source={{ uri: event.image }} style={styles.image} />}

//       <Text style={styles.title}>{event.name}</Text>

//       <Text style={styles.detail}>
//         📍 {event.venue}, {event.city}, {event.state}, {event.country}
//       </Text>

//       <Text style={styles.detail}>
//         📅 {event.date} {event.time ? `at ${event.time}` : ''}
//       </Text>

//       {event.priceRange && (
//         <Text style={styles.detail}>🎟 {event.priceRange}</Text>
//       )}

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Buy Tickets Now</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 40,
//     alignItems: 'center',
//   },
//   image: {
//     width: '100%',
//     height: 220,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   detail: {
//     fontSize: 16,
//     marginVertical: 4,
//     textAlign: 'center',
//   },
//   button: {
//     marginTop: 24,
//     backgroundColor: '#1e90ff',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default EventDetailsScreen;