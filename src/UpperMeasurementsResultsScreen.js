import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const UpperMeasurementsResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { measurements } = route.params;  // Passed measurements data from API

  // Navigate back to the results screen
  const navigateBack = () => {
    navigation.goBack();
  };

  // Navigate to LowerMeasurementsResultsScreen
  const navigateToLowerMeasurementsResults = () => {
    navigation.navigate('LowerMeasurementsResultsScreen', { measurements });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateBack}>
          <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Détails des mensurations</Text>
      </View>

      {/* Switcher */}
      <TouchableOpacity onPress={navigateToLowerMeasurementsResults}>
        <Image source={require('../assets/hautducorps.png')} style={styles.switcher} />
      </TouchableOpacity>

      {/* Upper Body Measurements */}
      <View style={styles.measurementsContainer}>
        <Image source={require('../assets/cou.png')} style={styles.measurementAsset}>
          <Text style={styles.measurementText}>Cou: {measurements.Neck} cm</Text>
        </Image>
        
        <Image source={require('../assets/epaules.png')} style={styles.measurementAsset}>
          <Text style={styles.measurementText}>Épaules: {measurements.Shoulder_Width} cm</Text>
        </Image>
        
        <Image source={require('../assets/poitrine.png')} style={styles.measurementAsset}>
          <Text style={styles.measurementText}>Poitrine: {measurements.Chest_Circumference} cm</Text>
        </Image>
        
        <Image source={require('../assets/abdomen.png')} style={styles.measurementAsset}>
          <Text style={styles.measurementText}>Abdomen: {measurements.Waist_Circumference} cm</Text>
        </Image>
        
        <Image source={require('../assets/bras.png')} style={styles.measurementAsset}>
          <Text style={styles.measurementText}>Bras: {measurements.Biceps} cm</Text>
        </Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 24,
    color: '#000',
    marginLeft: 10,
  },
  switcher: {
    width: 338,
    height: 64,
    alignSelf: 'center',
    marginVertical: 25,
  },
  measurementsContainer: {
    alignItems: 'center',
  },
  measurementAsset: {
    width: 334,
    height: 109,
    marginVertical: 15,
    justifyContent: 'center',
  },
  measurementText: {
    position: 'absolute',
    top: 124,
    left: 22,
    fontSize: 16,
    color: '#FFF',
  },
});

export default UpperMeasurementsResultsScreen;
