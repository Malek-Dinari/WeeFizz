import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera, getCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const QRScanWithCameraScreen = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigation = useNavigation();
 

  const devices = Camera.getAvailableCameraDevices();
  const device = getCameraDevice(devices, 'back');


  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
  

      if (codes.length > 0) {
        const qrCodeValue = codes[0]?.content; // Get the first scanned QR code content
        navigateToSplashScreen(qrCodeValue);
      } else {
        Alert.alert('QR code scan failed', 'No QR code detected.');
      }
    }
  })


  const handleQRCodeScan = (codes) => {
    const qrCodeValue = codes[0]?.content;
    if (qrCodeValue) {
      navigateToSplashScreen(qrCodeValue);
    } else {
      Alert.alert('QR code scan failed', 'No QR code detected.');
    }
  };

  React.useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const permissionStatus = await Camera.requestCameraPermission();
        setHasPermission(permissionStatus !== 'denied');
      } catch (error) {
        console.error('Permission error:', error.message);
      }
      setIsLoading(false);
    };

    checkCameraPermission();
  }, []);

  const navigateToSplashScreen = (productUrl) => {
    navigation.navigate('SplashScreen', { productUrl });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccessText}>No access to camera</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAccessText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        onCodeScanned={handleQRCodeScan}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    marginTop: 10,
  },
  noAccessText: {
    color: '#000',
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