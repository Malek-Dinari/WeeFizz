import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ComfortSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { gender, height, weight, hunit, wunit } = route.params;

  const [comfort, setSelectedComfort] = useState(null);

  const comfortOptions = [
    { key: 'ajustée', lightImage: require('../assets/ajustée.png'), darkImage: require('../assets/ajustéeselect.png') },
    { key: 'standard', lightImage: require('../assets/standard.png'), darkImage: require('../assets/standardselect.png') },
    { key: 'ample', lightImage: require('../assets/ample.png'), darkImage: require('../assets/ampleselect.png') },
  ];

  const handleComfortSelect = (selectedComfort) => {
    setSelectedComfort(selectedComfort);
    console.log('Selected comfort: ', selectedComfort);
  };

  const handleNextPress = () => {
    navigation.navigate('BodyMorphologySelectionScreen', {
      gender,
      height,
      hunit,
      weight,
      wunit,
      comfort,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Veuillez sélectionner votre confort de vêtement</Text>
        <Text style={styles.subtitle}>Choisissez votre style de porter vos vêtements selon votre préférence de confort.</Text>
      </View>

      {comfortOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          onPress={() => handleComfortSelect(option.key)}
          style={styles.optionContainer}
        >
          <Image
            source={comfort === option.key ? option.darkImage : option.lightImage}
            style={styles.optionImage}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        onPress={handleNextPress} 
        style={[styles.nextButton, { opacity : comfort ? 1 : 0.5 }]} 
        disabled={!comfort}
      >
        <Image source={require('../assets/Bouton_suivant.png')} style={styles.nextButtonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      marginBottom: 5,
    },
    backArrow: {
      width: 24,
      height: 24,
    },
    textContainer: {
      marginTop: 60,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
      textAlign: 'left',
    },
    subtitle: {
      fontSize: 18,
      color: 'black',
      marginBottom: 10,
      textAlign: 'left',
    },
    optionContainer: {
      marginTop: 5,
      alignItems: 'center',
    },
    optionImage: {
      width: 332,
      height: 92,
    },
    nextButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    nextButtonImage: {
      width: 334,
      height: 50,
    },
  });
  
  export default ComfortSelectionScreen;