import React, { useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoProductScreen = () => {
  const navigation = useNavigation(); // Use navigation from React Navigation
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  const navigateToQRScan = () => {
    navigation.navigate('QRScanScreen'); // Use React Navigation
  };

  return (
    <ImageBackground 
      source={require('../assets/WeeFizz page.png')} 
      style={styles.background}
    >
      <Animated.View style={[styles.centerFrame, { opacity: fadeInAnim }]}>
        {/* T-shirt Image */}
        <Image 
          source={require('../assets/tshirtwithtext.png')}
          style={styles.tshirtImage}
        />

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={navigateToQRScan}>
          <Image 
            source={require('../assets/scan button home.png')}
            style={styles.scanButtonImage}
          />
        </TouchableOpacity>
      </Animated.View>
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
  centerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 344,
    height: 308,
    position: 'relative',
  },
  tshirtImage: {
    width: 344,
    height: 308,
    marginBottom: 10,
  },
  scanButton: {
    position: 'absolute',
    bottom: 10,
  },
  scanButtonImage: {
    width: 234,
    height: 50,
    marginBottom: 40,
  },
});

export default NoProductScreen;
