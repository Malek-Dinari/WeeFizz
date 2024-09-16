import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {  productUrl } = route.params;



  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('WelcomeScreen', { productUrl }); // Pass the productUrl parameter
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, productUrl]);

  return (
    <ImageBackground 
      source={require('../assets/WeeFizz_page.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: '33%',
  },
});

export default SplashScreen;
