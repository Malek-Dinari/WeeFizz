import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const MesurementsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { measurements } = route.params;

  const handleConsultClick = () => {
    router.push(`/UpperBodyMesurementScreen/${measurements}`);
  };

  return (
    <ImageBackground 
      source={require('../assets/Weefizz page white.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../assets/Weefizz logo light.png')} style={styles.logo} />
        <Text style={styles.title}>Félicitations !</Text>
        <Text style={styles.subtitle}>
          Merci d’avoir fait confiance à WeeFizz et d’avoir apporté votre contribution
        </Text>

        {/* Upper Body Measurements Container */}
        <View style={styles.upperBodyContainer}>
          <Image source={require('../assets/mesureupperbody.png')} style={styles.upperBodyImage} />
          <Text style={styles.measurementLeft}>Recommandé: {measurements.upperRecommended}</Text>
          <Text style={styles.measurementRight}>Taille Supérieure: {measurements.upperSizeUp}</Text>
        </View>

        {/* Lower Body Measurements Container */}
        <View style={styles.lowerBodyContainer}>
          <Image source={require('../assets/rect mesure lowerbody.png')} style={styles.lowerBodyRect} />
          <Image source={require('../assets/mesurelowerbody.png')} style={styles.lowerBodyImage} />
          <Text style={styles.measurementLeftLower}>Recommandé: {measurements.lowerRecommended}</Text>
          <Text style={styles.measurementRightLower}>Taille Supérieure: {measurements.lowerSizeUp}</Text>
        </View>

        <TouchableOpacity onPress={handleConsultClick} style={styles.buttonContainer}>
          <Image source={require('../assets/Bouton consulter.png')} style={styles.button} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 126,
    height: 38,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  upperBodyContainer: {
    width: 374,
    height: 219,
    position: 'relative',
    marginBottom: 20,
  },
  upperBodyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  measurementLeft: {
    position: 'absolute',
    left: 84,
    bottom: 50,
    color: '#FFFFFF',
    fontSize: 24,
  },
  measurementRight: {
    position: 'absolute',
    right: 84,
    bottom: 50,
    color: '#FFFFFF',
    fontSize: 24,
  },
  lowerBodyContainer: {
    width: 374,
    height: 226,
    position: 'relative',
    marginBottom: 20,
  },
  lowerBodyRect: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'contain',
  },
  lowerBodyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  measurementLeftLower: {
    position: 'absolute',
    left: 84,
    bottom: 57,
    color: '#FFFFFF',
    fontSize: 24,
  },
  measurementRightLower: {
    position: 'absolute',
    right: 84,
    bottom: 57,
    color: '#FFFFFF',
    fontSize: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: 334,
    height: 50,
  },
  button: {
    width: '100%',
    height: '100%',
  },
});

export default MesurementsScreen;
