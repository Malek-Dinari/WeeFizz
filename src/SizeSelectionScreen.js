import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, PanResponder, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Updated imports

const SizeSelectionScreen = () => {
    const route = useRoute();
    const { gender } = route.params;
    const navigation = useNavigation();
    const [hunit, setHunit] = useState('cm');
    const [height, setHeight] = useState(180); // Default height for cm is 180
    const slidingLineRef = useRef(null);
    const sliderWidth = 350; // Width of the actual slider area inside the image
    const sliderLeftOffset = 19; // Left offset from the container's left edge to the actual slider start
  
    useEffect(() => {
      if (!gender) {
        Alert.alert("Erreur", "Le paramètre de sexe est manquant");
        navigation.goBack();
      }
    }, [gender, navigation]);
  
    const [initialX, setInitialX] = useState(0); // State to hold the initial X position
  
    const calculateInitialX = (height, unit) => {
      if (unit === 'cm') {
        return Math.round((height - 170) / 20 * sliderWidth);
      } else if (unit === 'in') {
        return Math.round((height - 66) / 9 * sliderWidth);
      }
    };
  
    useEffect(() => {
      setInitialX(calculateInitialX(height, hunit));
    }, [height, hunit]);
  
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          let newX = gestureState.moveX - sliderLeftOffset;
  
          if (newX < 0) {
            newX = 0;
          } else if (newX > sliderWidth) {
            newX = sliderWidth;
          }
  
          let newHeight = 0;
          if (hunit === 'cm') {
            newHeight = 170 + Math.round((newX / sliderWidth) * 20);
          } else if (hunit === 'in') {
            newHeight = 66 + Math.round((newX / sliderWidth) * 9);
          }
  
          slidingLineRef.current.setNativeProps({ style: { left: newX } });
  
          setHeight(newHeight);
  
          console.log("Selected height:", newHeight);
        },
      })
    ).current;
  
    const getGenderText = () => {
      switch (gender) {
        case 'Homme':
          return "Je suis un homme";
        case 'Femme':
          return "Je suis une femme";
        default:
          return "Je suis non binaire";
      }
    };
  
    const handleNextPress = () => {
      navigation.navigate('WeightSelectionScreen', { gender, height, hunit });
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/leftarrow.png')} style={styles.backArrow} />
        </TouchableOpacity>
        
        <View style={styles.frameContainer}>
          <Image source={require('../assets/chuisexevert.png')} style={styles.frameImage} />
          <Text style={styles.frameText}>{getGenderText()}</Text>
        </View>
        
        <Text style={styles.title}>Quelle taille faites-vous ?</Text>
        <Text style={styles.subtitle}>Cela nous permet de mieux concevoir votre profil.</Text>
  
        <View style={styles.sliderContainer}>
          <Image source={require('../assets/cmsizeslider.png')} style={styles.sliderImage} />
          <View
            ref={slidingLineRef}
            {...panResponder.panHandlers}
            style={[styles.slidingLine, { left: initialX }]}
          >
            <Image source={require('../assets/sizeslidingline.png')} style={styles.slidingImage} />
          </View>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setHunit('cm')}>
            <Image source={hunit === 'cm' ? require('../assets/cmbuttondark.png') : require('../assets/cmbutton.png')} style={styles.unitButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHunit('in')}>
            <Image source={hunit === 'in' ? require('../assets/inbuttondark.png') : require('../assets/inbutton.png')} style={styles.unitButton} />
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity
          onPress={handleNextPress}
          style={styles.nextButton}
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
    frameContainer: {
      flexDirection: 'row', 
      alignItems: 'center',
      marginTop: 80,
      marginBottom: 20,
    },
    frameImage: {
      width: 186,
      height: 50,
      position: 'absolute',
      alignItems: 'left',
    },
    frameText: { 
      fontSize: 18,
      color: 'black',
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
      marginBottom: 30, 
      textAlign: 'left' 
    },
    sliderContainer: {
      width: 339,
      height: 157,
      alignItems: 'center',
      marginBottom: 30,
    },
    sliderImage: {
      width: 339,
      height: 157,
    },
    slidingLine: {
      width: 32,
      height: 72,
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: -18,
      transform: [{ translateX: 0 }, { translateY: -36 }],
    },
    slidingImage: {
      width: 8,
      height: 72,
    },
    buttonContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginTop: 30,
    },
    unitButton: { 
      width: 88, 
      height: 52, 
      marginHorizontal: 10,
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
  
export default SizeSelectionScreen;
  