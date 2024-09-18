// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const LowerMeasurementsResultsScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { measurements } = route.params;  // Passed measurements data from API

//   // Navigate back to the results screen
//   const navigateBack = () => {
//     navigation.goBack();
//   };

//   // Navigate to UpperMeasurementsResultsScreen
// //   const navigateToMesurementResultsScreen = () => {
// //     navigation.navigate('MesurementResultsScreen', { measurements });
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Header Section */}
// //       <View style={styles.headerContainer}>
// //         <TouchableOpacity onPress={navigateBack}>
// //           <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
// //         </TouchableOpacity>
// //         <Text style={styles.headerText}>Détails des mensurations</Text>
// //       </View>

// //       {/* Switcher */}
// //       <TouchableOpacity onPress={navigateToMesurementResultsScreen}>
// //         <Image source={require('../assets/hautducorps.png')} style={styles.switcher} />
// //       </TouchableOpacity>

// //       {/* Lower Body Measurements */}
// //       <View style={styles.measurementsContainer}>
// //         <Image source={require('../assets/cuisses.png')} style={styles.measurementAsset}>
// //           <Text style={styles.measurementText}>Cuisse Droite: {measurements.Right_Thigh} cm</Text>
// //         </Image>
        
// //         <Image source={require('../assets/cuisses.png')} style={styles.measurementAsset}>
// //           <Text style={styles.measurementText}>Cuisse Gauche: {measurements.Left_Thigh} cm</Text>
// //         </Image>
        
// //         <Image source={require('../assets/genoux.png')} style={styles.measurementAsset}>
// //           <Text style={styles.measurementText}>Genou Droit: {measurements.Right_Knee} cm</Text>
// //         </Image>
        
// //         <Image source={require('../assets/genoux.png')} style={styles.measurementAsset}>
// //           <Text style={styles.measurementText}>Genou Gauche: {measurements.Left_Knee} cm</Text>
// //         </Image>
        
// //         <Image source={require('../assets/mollets.png')} style={styles.measurementAsset}>
// //           <Text style={styles.measurementText}>Mollet Droit: {measurements.Right_Calf} cm</Text>
// //         </Image>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#FFF',
// //     padding: 20,
// //   },
// //   headerContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   backArrow: {
// //     width: 24,
// //     height: 24,
// //   },
// //   headerText: {
// //     fontSize: 24,
// //     color: '#000',
// //     marginLeft: 10,
// //   },
// //   switcher: {
// //     width: 338,
// //     height: 64,
// //     alignSelf: 'center',
// //     marginVertical: 25,
// //   },
// //   measurementsContainer: {
// //     alignItems: 'center',
// //   },
// //   measurementAsset: {
// //     width: 334,
// //     height: 109,
// //     marginVertical: 15,
// //     justifyContent: 'center',
// //   },
// //   measurementText: {
// //     position: 'absolute',
// //     top: 124,
// //     left: 22,
// //     fontSize: 16,
// //     color: '#FFF',
// //   },
// // });

// export default LowerMeasurementsResultsScreen;
