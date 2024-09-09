import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const QRScanScreen = ({ navigation }) => {
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for popup visibility
  const [url, setUrl] = useState(''); // State for the URL input
  const [cameraPermission, setCameraPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const getCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to scan QR codes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setCameraPermission(status === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status = await Camera.requestCameraPermission();
        setCameraPermission(status === 'authorized');
      }
    };

    getCameraPermission();
  }, []);

  const handleShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      // Navigate to the ScanQRWithCameraScreen after the animation ends
      navigation.push('QRScanWithCameraScreen');
    });
  };

  const validateUrl = async () => {
    try {
      const response = await fetch(`https://fit-size.com/fitshop/modules/guidetailles/api.php?action=getLogo&product_id=27&category_id=14address=${url}`);
      const data = await response.json();

      if (data.isValid) {
        // Navigate to the next screen if URL is valid
        navigation.push('QRScanWithCameraScreen'); 
      } else {
        // Navigate to NoProductScreen if URL is invalid
        navigation.push('NoProductScreen');
      }
    } catch (error) {
      console.error("Error validating URL:", error);
      // Navigate to NoProductScreen in case of an error
      navigation.push('NoProductScreen');
    }
  };

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required to scan QR codes.</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/bg QR scan.png')} style={styles.background}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.crossContainer}>
          <Image source={require('../assets/crossX.png')} style={styles.cross} />
        </TouchableOpacity>

        <Image source={require('../assets/QR.png')} style={styles.qrImage} />

        <Text style={styles.title}>Scanner un nouveau produit</Text>
        <Text style={styles.subtitle}>Cela prend quelques secondes.</Text>

        <TouchableOpacity onPress={handleShakeAnimation} style={styles.lienQRContainer}>
          <Animated.Image source={require('../assets/lienQR.png')} style={[styles.lienQR, { transform: [{ translateX: shakeAnimation }] }]} />
        </TouchableOpacity>

        <View style={styles.cameraContainer}>
          {device != null && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
              onInitialized={() => {
                // Handle camera initialization if needed
              }}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Image source={require('../assets/Rectangle upper.png')} style={styles.rectangle} />

          <View style={styles.circleContainer}>
            <Image source={require('../assets/OU Circle.png')} style={styles.circle} />
            <Text style={styles.circleText}>OU</Text>
          </View>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Adresse URL du produit</Text>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="www.loremipsum.fr"
            placeholderTextColor="#888"
            value={url}
            onChangeText={setUrl}
          />
          <TouchableOpacity style={styles.button} onPress={validateUrl}>
            <Image source={require('../assets/Bouton valider.png')} style={styles.buttonImage} />
          </TouchableOpacity>

        </View>

        {showErrorPopup && (
          <Animated.View style={[styles.popup, { opacity: shakeAnimation }]}>
            <TouchableOpacity onPress={() => setShowErrorPopup(false)} style={styles.closeButton}>
              <Image source={require('../assets/crossX dark.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            <Image source={require('../assets/error msg.png')} style={styles.errorIcon} />
            <Text style={styles.popupTitle}>Erreur</Text>
            <Text style={styles.popupSubtitle}>Il n'y a pas de produit avec cette adresse</Text>
            <TouchableOpacity onPress={() => navigation.push('QRScanScreen')} style={styles.retryButton}>
              <Image source={require('../assets/Bouton reprendre 2.png')} style={styles.retryButtonImage} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 139, 0.5)', // Dark blue with 0.5 opacity
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  crossContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  cross: {
    width: 30,
    height: 30,
  },
  qrImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    position: 'absolute',
    top: '10%', // Adjust to 10% from the top of the screen
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 50,
  },
  lienQRContainer: {
    marginBottom: 20,
  },
  lienQR: {
    width: 234,
    height: 245,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  rectangle: {
    width: 390,
    height: 189,
    position: 'absolute',
    bottom: 0,
  },
  circleContainer: {
    position: 'absolute',
    top: -55, // Adjust as needed
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
  },
  circleText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerTextContainer: {
    width: '90%',
    alignItems: 'flex-start', // Aligns the text to the left
  },
  footerText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
    zIndex: 1, // Ensures the text is above the rectangle
  },
  textInput: {
    width: '90%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    color: 'black',
  },
  button: {
    marginTop: 20,
  },
  buttonImage: {
    width: 160,
    height: 40,
  },
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  errorIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  popupSubtitle: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
  },
  retryButtonImage: {
    width: 160,
    height: 40,
  },
  cameraContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    marginTop: 20,
  },
});

export default QRScanScreen;
