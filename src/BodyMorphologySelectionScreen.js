import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = 264; // Width of a single item (image)
const ITEM_MARGIN = 16; // Margin between items
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_MARGIN; // Total interval for snapping
const HALF_SCREEN_WIDTH = screenWidth / 2;

const morphologies = {
  homme: [
    { key: 'V', image: require('../assets/Morphologie_en_V_Homme.png'), selectImage: require('../assets/Morphologie_en_V_Homme_select.png') },
    { key: 'H', image: require('../assets/Morphologie_en_H_Homme.png'), selectImage: require('../assets/Morphologie_en_H_Homme_select.png') },
    { key: 'O', image: require('../assets/Morphologie_en_O_Homme.png'), selectImage: require('../assets/Morphologie_en_O_Homme_select.png') },
  ],
  femme: [
    { key: 'X', image: require('../assets/Morphologie_en_X.png'), selectImage: require('../assets/Morphologie_en_X_select.png') },
    { key: 'A', image: require('../assets/Morphologie_en_A.png'), selectImage: require('../assets/Morphologie_en_A_select.png') },
    { key: '8', image: require('../assets/Morphologie_en_8.png'), selectImage: require('../assets/Morphologie_en_8_select.png') },
    { key: 'V', image: require('../assets/Morphologie_en_V.png'), selectImage: require('../assets/Morphologie_en_V_select.png') },
    { key: 'H', image: require('../assets/Morphologie_en_H.png'), selectImage: require('../assets/Morphologie_en_H_select.png') },
    { key: 'O', image: require('../assets/Morphologie_en_O.png'), selectImage: require('../assets/Morphologie_en_O_select.png') },
  ],
  autres: [
    { key: 'X', image: require('../assets/Morphologie_en_X.png'), selectImage: require('../assets/Morphologie_en_X_select.png') },
    { key: 'A', image: require('../assets/Morphologie_en_A.png'), selectImage: require('../assets/Morphologie_en_A_select.png') },
    { key: '8', image: require('../assets/Morphologie_en_8.png'), selectImage: require('../assets/Morphologie_en_8_select.png') },
    { key: 'V', image: require('../assets/Morphologie_en_V.png'), selectImage: require('../assets/Morphologie_en_V_select.png') },
    { key: 'H', image: require('../assets/Morphologie_en_H.png'), selectImage: require('../assets/Morphologie_en_H_select.png') },
    { key: 'O', image: require('../assets/Morphologie_en_O.png'), selectImage: require('../assets/Morphologie_en_O_select.png') },
    { key: 'V_homme', image: require('../assets/Morphologie_en_V_Homme.png'), selectImage: require('../assets/Morphologie_en_V_Homme_select.png') },
    { key: 'H_homme', image: require('../assets/Morphologie_en_H_Homme.png'), selectImage: require('../assets/Morphologie_en_H_Homme_select.png') },
    { key: 'O_homme', image: require('../assets/Morphologie_en_O_Homme.png'), selectImage: require('../assets/Morphologie_en_O_Homme_select.png') },
  ],
};

const BodyMorphologySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, productUrl } = route.params;

  const [selectedMorphology, setSelectedMorphology] = useState(null);
  const scrollViewRef = useRef(null);
  const [lastScrolledIndex, setLastScrolledIndex] = useState(null); // Track last scrolled index to prevent unnecessary snapping.

  const genderMorphologies = morphologies[gender] || morphologies['autres'];

  const handleMorphologySelect = (morphologyKey) => {
    setSelectedMorphology(morphologyKey);
    console.log('Selected Morphology: ', morphologyKey);
  };

  const handleNext = () => {
    if (selectedMorphology) {
      navigation.navigate('ScanMethodSelectionScreen', {
        gender,
        height,
        hunit,
        weight,
        wunit,
        comfort,
        selectedMorphology,
        productUrl,
      });
    }
  };

  const onScrollEnd = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / SNAP_INTERVAL);

    if (index !== lastScrolledIndex) {
      scrollViewRef.current.scrollTo({ x: index * SNAP_INTERVAL, y: 0, animated: true });
      setLastScrolledIndex(index); // Update last scrolled index
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Choisissez votre morphologie</Text>
        <Text style={styles.subtitle}>Sélectionner votre morphologie, découvrez votre taille idéale :</Text>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.morphologyList}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd} // Snap to the closest item
        >
          {genderMorphologies.map((morphology, index) => (
            <TouchableOpacity
              key={morphology.key}
              onPress={() => handleMorphologySelect(morphology.key)}
              style={[
                styles.morphologyItem,
                { marginLeft: index === 0 ? (screenWidth - ITEM_WIDTH) / 2 : 8, marginRight: index === genderMorphologies.length - 1 ? (screenWidth - ITEM_WIDTH) / 2 : 8 },
              ]}
            >
              <Image
                source={selectedMorphology === morphology.key ? morphology.selectImage : morphology.image}
                style={styles.morphologyImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity 
        onPress={handleNext} 
        style={[styles.nextButton, { opacity: selectedMorphology ? 1 : 0.5 }]}
        disabled={!selectedMorphology}>
        <Image source={require('../assets/Bouton_valider_2.png')} style={styles.nextButtonImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext} style={styles.skipStep}>
        <Text style={styles.skipStepText}>Passer l’étape</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftArrow}>
        <Image source={require('../assets/leftarrow.png')} style={styles.leftArrowImage} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    contentContainer: {
      padding: 20,
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    innerContainer: {
      marginBottom: 150, // Margin between swiping list and 'Passer l’étape'
    },
    title: {
      color: 'black',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 80,
    },
    subtitle: {
      color: 'black',
      fontSize: 18,
      marginTop: 10,
      textAlign: 'left',
    },
    morphologyList: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    morphologyItem: {
      alignItems: 'center',
    },
    morphologyImage: {
      width: 264,
      height: 474,
    },
    nextButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
    nextButtonImage: {
      width: 334,
      height: 50,
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    skipStep: {
      position: 'absolute',
      bottom: 100, // Adjusted position below swiping list
      alignSelf: 'center',
    },
    skipStepText: {
      fontSize: 16,
      color: 'blue',
      color: 'black',
      textDecorationLine: 'underline',
    },
    leftArrow: {
      position: 'absolute',
      top: 30,
      left: 20,
    },
    leftArrowImage: {
      width: 24,
      height: 24,
    },
  });
  
  export default BodyMorphologySelectionScreen;