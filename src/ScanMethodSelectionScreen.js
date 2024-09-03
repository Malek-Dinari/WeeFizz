import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OptionButton = ({ source, selectedSource, isSelected, onPress }) => {
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
        <Image source={isSelected ? selectedSource : source} style={styles.optionImage} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ScanMethodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, productUrl } = route.params;

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/leftarrow.png')} style={styles.backButtonImage} />
      </TouchableOpacity>

      <Text style={styles.title}>Comment souhaitez-vous être pris(e) en photo ?</Text>
      <Text style={styles.subtitle}>Capturez vos mensurations en prenant une photo de face et de profil.</Text>

      <View style={styles.optionsContainer}>
        <OptionButton
          source={require('../assets/seul.png')}
          selectedSource={require('../assets/seulselect.png')}
          isSelected={selectedOption === 'seul'}
          onPress={() => handleOptionSelect('seul')}
        />
        <OptionButton
          source={require('../assets/par un ami.png')}
          selectedSource={require('../assets/par un ami select.png')}
          isSelected={selectedOption === 'par_un_ami'}
          onPress={() => handleOptionSelect('par_un_ami')}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tuto1Screen', { gender, height, hunit, weight, wunit, comfort, selectedMorphology, selectedOption, productUrl })}
        style={[styles.nextButton, { opacity: selectedOption ? 1 : 0.5 }]}
        disabled={!selectedOption}
      >
        <Image source={require('../assets/Bouton valider 2.png')} style={styles.nextButtonImage} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 160,
  },
  optionImage: {
    width: 159,
    height: 104,
    resizeMode: 'contain',
  },
  nextButton: {
    alignSelf: 'center',
    marginTop: 160,
  },
  nextButtonImage: {
    width: 334,
    height: 50,
  },
});

export default ScanMethodSelectionScreen;
