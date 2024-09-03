import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const QRScanWithCameraScreen = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const result = await check(PERMISSIONS.ANDROID.CAMERA);
        if (result === RESULTS.GRANTED) {
          setCameraPermission(true);
        } else {
          const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
          setCameraPermission(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error('Error checking camera permission:', error.message);
      }
      setIsLoading(false);
    };

    checkCameraPermission();
  }, []);

  const handleQRCodeScan = (event) => {
    const qrCodeValue = event.nativeEvent.codeStringValue;
    if (qrCodeValue) {
      navigateToSplashScreen(qrCodeValue);
    } else {
      Alert.alert('QR code scan failed', 'No QR code detected.');
    }
  };

  const navigateToSplashScreen = (productUrl) => {
    navigation.navigate('SplashScreen', { productUrl });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccessText}>No access to camera</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        scanBarcode={true}
        onReadCode={handleQRCodeScan}
        showFrame={true}
        laserColor="red"
        frameColor="white"
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  noAccessText: {
    color: '#fff',
    fontSize: 18,
  },
  goBackText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QRScanWithCameraScreen;
