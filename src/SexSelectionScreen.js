import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';

const GenderButton = ({ source, selectedSource, isSelected, onPress }) => {
  const [animation] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale: animation }] }}>
        <Image source={isSelected ? selectedSource : source} style={styles.genderImage} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const SexSelectionScreen = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    console.log('Selected Gender:', gender);
  };

  const handleNextPress = () => {
    if (selectedGender) {
      navigation.navigate('SizeSelectionScreen', { gender: selectedGender });
    } else {
      Alert.alert('Sélection manquante.', 'Veuillez sélectionner un sexe avant de continuer.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Quel est votre sexe ?</Text>
      <Text style={styles.subtitle}>Cela me permet de mieux concevoir votre profil.</Text>

      <View style={styles.imageContainer}>
        <GenderButton 
          source={require('../assets/Homme.png')} 
          selectedSource={require('../assets/Hommeselect.png')}
          isSelected={selectedGender === 'Homme'} 
          onPress={() => handleGenderSelect('Homme')} 
        />
        <GenderButton 
          source={require('../assets/Femme.png')} 
          selectedSource={require('../assets/Femmeselect.png')}
          isSelected={selectedGender === 'Femme'} 
          onPress={() => handleGenderSelect('Femme')} 
        />
        <GenderButton 
          source={require('../assets/Autres.png')} 
          selectedSource={require('../assets/Autresselect.png')}
          isSelected={selectedGender === 'Autres'} 
          onPress={() => handleGenderSelect('Autres')} 
        />
      </View>

      <TouchableOpacity 
        onPress={handleNextPress}
        style={[styles.nextButton, { opacity: selectedGender ? 1 : 0.5 }]}
        disabled={!selectedGender}
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
    left: 20 
  },
  backArrow: { 
    width: 30, 
    height: 30 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'black',
    marginTop: 80, 
    marginBottom: 10, 
    textAlign: 'left',
  },
  subtitle: { 
    fontSize: 18, 
    color: 'black', 
    marginBottom: 30, 
    textAlign: 'left' 
  },
  imageContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30,
  },
  genderImage: { 
    width: 104, 
    height: 95 
  },
  nextButton: { 
    position: 'absolute', 
    bottom: 20, 
    alignSelf: 'center' 
  },
  nextButtonImage: { 
    width: 334, 
    height: 50 
  },
});

export default SexSelectionScreen;
