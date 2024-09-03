import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import axios from 'axios';

const MeasurementLoadingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, comfort, selectedMorphology, frontposePhoto, sideposePhoto, productUrl } = route.params;

  const [progress, setProgress] = useState(0);
  const [measurements, setMeasurements] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 1 && measurements) {
          clearInterval(interval);
          navigation.navigate('ThankYouScreen', { measurements, productUrl });
          return oldProgress;
        }
        return oldProgress + 0.01;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [navigation, measurements, productUrl]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const requestBody = {
          action: 'getProduct',
          height,
          weight,
          gender,
          frontposePhoto,
          sideposePhoto,
          ...(comfort && { comfort }),
          ...(selectedMorphology && { selectedMorphology }),
        };

        console.log("Request body:", requestBody); // Debug: log the request body

        const response = await axios.post('https://services-api.weefizz.ai/api', requestBody, {
          headers: {
            'Token': 'Vc2Tc7UjrJzto4ByrVFC48JSLVJ9aCcMRxdqqbrdUrGumEP0ay3SBblaO89QxiKl',
            'Content-Type': 'application/json',
          },
        });

        console.log("API response:", response.data); // Debug: log the API response
        setMeasurements(response.data);
      } catch (error) {
        console.error("Error fetching measurements:", error); // Debug: log the error
        setShowPopup(true);
      }
    };

    const timeout = setTimeout(() => {
      setShowPopup(true); // Show popup if API takes too long
    }, 15000); // 15 seconds

    fetchMeasurements();

    return () => clearTimeout(timeout); // Clean up timeout
  }, [gender, height, weight, comfort, selectedMorphology, frontposePhoto, sideposePhoto]);

  useEffect(() => {
    if (showPopup) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [showPopup, fadeAnim]);

  const handleRetry = () => {
    navigation.navigate('CameraFrontPoseScreen', { gender, height, weight, comfort, selectedMorphology, productUrl }); // Navigate to the front pose screen to retake photos
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <ImageBackground
      source={require('../assets/WeeFizz page no logo.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../assets/WeeFizz Logo.png')} style={styles.logo} />
        <Image source={require('../assets/tape_measure.png')} style={styles.tapeMeasure} />
        <ProgressBar progress={progress} color="#3FAAA6" style={styles.progressBar} />
        <Text style={styles.loadingText}>Notre couturier est en train de relever vos mesures !</Text>
        <Text style={styles.loadingSubtext}>Cela prend quelques secondes.</Text>

        {showPopup && (
          <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
            <View style={styles.popupContent}>
              <TouchableOpacity onPress={handleClosePopup} style={styles.closeButton}>
                <Image source={require('../assets/crossX dark.png')} style={styles.icon} />
              </TouchableOpacity>
              <Image source={require('../assets/error msg.png')} style={styles.errorIcon} />
              <Text style={styles.popupTitle}>Erreur</Text>
              <Text style={styles.popupSubtitle}>Il n'y a pas eu de réponse de l'API.</Text>
              <TouchableOpacity onPress={handleRetry}>
                <Image source={require('../assets/Bouton reprendre 2.png')} style={styles.retryButton} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    width: 277.33,
    height: 83.33,
  },
  tapeMeasure: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    marginBottom: 20,
    marginTop: 120,
  },
  progressBar: {
    alignSelf: 'center',
    width: 300,
    height: 40,
  },
  loadingText: {
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
  loadingSubtext: {
    marginTop: 10,
    color: 'white',
    fontSize: 14,
    alignSelf: 'center',
  },
  popupContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  popupContent: {
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  errorIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  popupTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  popupSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    width: 234,
    height: 50,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default MeasurementLoadingScreen;
