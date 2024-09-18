import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Tuto1Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, hunit, weight, wunit, comfort, selectedMorphology, selectedOption, productUrl } = route.params;

  const handleNextPress = () => {
    navigation.navigate('Tuto2Screen', {
      gender,
      height,
      hunit,
      weight,
      wunit,
      comfort,
      selectedMorphology,
      selectedOption,
      productUrl,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Tutoriel</Text>
        <Image source={require('../assets/tuto1.png')} style={styles.image1} />
        <View style={styles.imageTextContainer}>
          <Image source={require('../assets/tuto1text.png')} style={styles.image2} />
          <View style={styles.textOverlay}>
            <Text style={styles.stepTitle}>Étape 1 : Choisissez vos vêtements</Text>
            <Text style={styles.stepDescription}>
              Pour des mesures précises, portez des vêtements ajustés, comme des tenues de sport, sous-vêtements, leggings...
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CameraFrontPoseScreen', {
            gender,
            height,
            hunit,
            weight,
            wunit,
            comfort,
            selectedMorphology,
            selectedOption,
            productUrl,
          })} 
          style={styles.skipText}
        >
          <Text style={styles.skipText}>Passer le tutoriel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Image source={require('../assets/Bouton_suivant.png')} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  image1: {
    width: 334,
    height: 363,
    marginBottom: -20,
  },
  imageTextContainer: {
    width: 334,
    height: 208,
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
  },
  image2: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    top: 10, // Adjust as needed
    left: 10, // Adjust as needed
    right: 10, // Adjust as needed
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
  },
  skipText: {
    fontSize: 18,
    color: 'black',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    marginBottom: 20,
    width: 334,
    height: 50,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
});

export default Tuto1Screen;
