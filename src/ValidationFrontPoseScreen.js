import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ValidationFrontPoseScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Destructure parameters from route
  const {
    gender,
    height,
    weight,
    hunit,
    wunit,
    comfort,
    selectedMorphology,
    selectedOption,
    frontPosePhoto,
    productUrl
  } = route.params;

  const handleRetake = () => {
    // Navigate back to the CameraFrontPoseScreen to retake the photo
    navigation.goBack();
  };

  const handleValidate = () => {
    // Proceed to the CameraSidePoseScreen with all the parameters including the validated front pose photo and product URL
    navigation.navigate('CameraSidePoseScreen', {
      gender,
      height,
      weight,
      hunit,
      wunit,
      comfort,
      selectedMorphology,
      selectedOption,
      frontPosePhoto,
      productUrl
    });
  };

  return (
    <View style={styles.container}>
      {/* Display the captured front pose photo */}
      <Image source={{ uri: frontPosePhoto }} style={styles.photo} />

      {/* Validation rectangle with instructions */}
      <View style={styles.validationRect}>
        <Text style={styles.title}>Vérifiez les contours de face</Text>
        <Text style={styles.subtitle}>ça doit faire le tour de votre corps</Text>
      </View>

      {/* Buttons for retaking or validating the photo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRetake}>
          <Image source={require('../assets/Bouton reprendre.png')} style={styles.retakeButton} />
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity onPress={handleValidate}>
          <Image source={require('../assets/Bouton valider.png')} style={styles.validateButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  validationRect: {
    position: 'absolute',
    bottom: 0, // Position above the buttons
    left: 0,
    right: 0,
    height: 177,
    backgroundColor: '#FFFFFF', // Or use ImageBackground if you want to display an image
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 60,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    left: -15,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  retakeButton: {
    width: 161,
    height: 51,
  },
  validateButton: {
    width: 172,
    height: 50,
  },
});

export default ValidationFrontPoseScreen;
