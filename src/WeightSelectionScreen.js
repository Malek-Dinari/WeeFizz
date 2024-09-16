import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const WeightSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { gender, height, hunit } = route.params;

  const [wunit, setwunit] = useState('kg');
  const [weight, setWeight] = useState(70);
  const slidingLineRef = useRef(null);
  const sliderWidth = 315;
  const sliderLeftOffset = 12;

  const calculateInitialX = (weight) => {
    if (wunit === 'kg') {
      return Math.round((weight - 50) / 20 * sliderWidth);
    } else if (wunit === 'lb') {
      return Math.round((weight - 110) / 20 * sliderWidth);
    }
  };

  const initialX = calculateInitialX(weight);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.moveX - sliderLeftOffset;
        if (newX < 0) newX = 0;
        if (newX > sliderWidth) newX = sliderWidth;

        let newWeight = 0;
        if (wunit === 'kg') {
          newWeight = 50 + Math.round((newX / sliderWidth) * 20);
        } else if (wunit === 'lb') {
          newWeight = 110 + Math.round((newX / sliderWidth) * 20);
        }

        slidingLineRef.current.setNativeProps({ style: { left: newX } });
        setWeight(newWeight);

        console.log("Selected weight:", newWeight);
      },
    })
  ).current;

  useEffect(() => {
    if (slidingLineRef.current) {
      slidingLineRef.current.setNativeProps({ style: { left: initialX } });
    }
  }, [initialX]);

  const getGenderText = () => {
    switch(gender) {
      case 'Homme':
        return "Je suis un homme";
      case 'Femme':
        return "Je suis une femme";
      default:
        return "Je suis non binaire";
    }
  };

  const getHeight = () => {
    if (height) {
      return `${height}`;
    }
    return "180";
  };

  const handleNextPress = () => {
    navigation.navigate('ComfortSelectionScreen', { 
      gender, 
      height, 
      hunit, 
      weight, 
      wunit 
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
      </TouchableOpacity>
      
      <View style={styles.frameContainer}>
        <Image source={require('../assets/chuitaillevert.png')} style={styles.frameImage} />
        <Text style={styles.frameText}>{getGenderText()}</Text>
      </View>

      <View style={styles.secondFrameContainer}>
        <Image source={require('../assets/chuitaillevert.png')} style={styles.secondFrameImage} />
        <Text style={styles.secondFrameText}>Je fais {getHeight()} cm</Text>
      </View>
      
      <Text style={styles.title}>Quel poids faites-vous ?</Text>
      <Text style={styles.subtitle}>Cela nous permet de mieux concevoir votre profil.</Text>

      <View style={styles.sliderContainer}>
        <Image source={require('../assets/kgweightslider.png')} style={styles.sliderImage} />
        <View
          ref={slidingLineRef}
          {...panResponder.panHandlers}
          style={[styles.slidingLine, { left: initialX }]}
        >
          <Image source={require('../assets/weightslidingline.png')} style={styles.slidingImage} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setwunit('kg')}>
          <Image source={wunit === 'kg' ? require('../assets/kgbuttondark.png') : require('../assets/kgbutton.png')} style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setwunit('lb')}>
          <Image source={wunit === 'lb' ? require('../assets/lbbuttondark.png') : require('../assets/lbbutton.png')} style={styles.button} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
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
    },
    backArrow: {
      width: 24,
      height: 24,
    },
    frameContainer: {
      width: '100%',
      height: 46,
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginBottom: 10,
      marginTop: 70,
    },
    frameImage: {
      width: 220,
      height: 50,
      position: 'absolute',
    },
    frameText: {
      fontSize: 18,
      color: 'black',
      marginRight: 60,
    },
    secondFrameContainer: {
      width: '100%',
      height: 50,
      alignItems: 'flex-end',
      marginBottom: 10,
      marginTop: 10,
    },
    secondFrameImage: {
      width: 186,
      height: 50,
      position: 'absolute',
    },
    secondFrameText: {
      fontSize: 18,
      color: 'black',
      marginTop: 10,
      marginRight: 60,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: 'black',
      marginBottom: 50,
    },
    sliderContainer: {
      width: 343,
      height: 157,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
    },
    sliderImage: {
      width: 339,
      height: 157,
      position: 'absolute',
    },
    slidingLine: {
      width: 32,
      height: 72,
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: -14,
      transform: [{ translateX: 0 }, { translateY: -36 }],
    },
    slidingImage: {
      width: 8,
      height: 72,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
    },
    button: {
      width: 88,
      height: 52,
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
  });
  
  export default WeightSelectionScreen;