import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Tuto3Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, hunit, weight, wunit, comfort, selectedMorphology, selectedOption, productUrl } = route.params;

  const handleNextPress = () => {
    navigation.navigate('CameraFrontPoseScreen', {
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
        <Image source={require('../assets/tuto3.png')} style={styles.topImage} />
        <Image source={require('../assets/tuto3text.png')} style={styles.frameImage} />
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
          <Text>Passer le tutoriel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Image source={require('../assets/Bouton suivant.png')} style={styles.buttonImage} />
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
  },
  topImage: {
    width: 334,
    height: 338,
    marginTop: 0,
  },
  frameImage: {
    width: 334,
    height: 216,
    marginTop: 0,
    borderRadius: 15,
  },
  skipText: {
    fontSize: 18,
    color: 'black',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
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

export default Tuto3Screen;
