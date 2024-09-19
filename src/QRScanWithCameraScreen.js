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
      console.log(`Scanned ${codes.length} codes!`);
      for (const code of codes) {
        console.log(code.type);
      }
      handleQRCodeScan(codes);
    }
  });

  const handleQRCodeScan = (codes) => {
    const qrCodeValue = codes[0]?.value;

    if (qrCodeValue) {
      console.log('Scanned QR Code URL:', qrCodeValue); // Log the URL for debugging

      const expectedUrlStart = 'https://weefizz.app/?uri=https://fit-size.com/fitshop&';

      // Check if the QR code matches the expected format
      if (qrCodeValue.startsWith(expectedUrlStart)) {
        try {
          new URL(qrCodeValue); // Validate the URL format
          navigateToSplashScreen(qrCodeValue);
        } catch (error) {
          console.error('Invalid URL:', qrCodeValue);
          Alert.alert('Invalid QR code', 'The scanned QR code does not contain a valid URL.');
        }
      } else {
        // If the QR code doesn't match the expected format, navigate to NoProductScreen
        navigateToNoProductScreen();
      }
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

  const navigateToNoProductScreen = () => {
    navigation.navigate('NoProductScreen');
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
