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
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [url, setUrl] = useState('');
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
      navigation.push('QRScanWithCameraScreen');
    });
  };

  const validateUrl = async () => {
    try {
      const fitShopUrlPattern = /fit-shop/;
      if (!fitShopUrlPattern.test(url)) {
        setShowErrorPopup(true);
        return;
      }
      
      const response = await fetch(`https://fit-size.com/fitshop/modules/guidetailles/api.php?action=getLogo&product_id=27&category_id=14&address=${url}`);
      const data = await response.json();

      if (data.isValid) {
        navigation.push('QRScanWithCameraScreen');
      } else {
        navigation.push('NoProductScreen');
      }
    } catch (error) {
      console.error("Error validating URL:", error);
      navigation.push('NoProductScreen');
    }
  };

  return (
    <ImageBackground source={require('../assets/bg_QR_scan.png')} style={styles.background}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.crossContainer}>
          <Image source={require('../assets/crossX.png')} style={styles.cross} />
        </TouchableOpacity>

        <Image source={require('../assets/QR.png')} style={styles.qrImage} />

        <Text style={styles.title}>Scanner un nouveau produit</Text>
        <Text style={styles.subtitle}>Cela prend quelques secondes. et vous évite de reprendre vos mesures !</Text>

        <TouchableOpacity onPress={handleShakeAnimation} style={styles.lienQRContainer}>
          <Animated.Image source={require('../assets/lienQR.png')} style={[styles.lienQR, { transform: [{ translateX: shakeAnimation }] }]} />
        </TouchableOpacity>

        {device != null && (
          <View style={styles.cameraContainer}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
            />
          </View>
        )}

        <View style={styles.footer}>
          <Image source={require('../assets/Rectangle_upper.png')} style={styles.rectangleImage} />
          <View style={styles.footerContent}>
            <Text style={styles.urlLabel}>Adresse URL du produit</Text>
            <View style={styles.circleContainer}>
              <Image source={require('../assets/OU_Circle.png')} style={styles.circle} />
              <Text style={styles.circleText}>OU</Text>
            </View>
            <View style={styles.inputButtonContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="www.loremipsum.fr"
                placeholderTextColor="#888"
                value={url}
                onChangeText={setUrl}
              />
              <TouchableOpacity style={styles.button} onPress={validateUrl}>
                <Image source={require('../assets/Bouton_valider_2.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
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
              <Image source={require('../assets/Bouton_valider_2.png')} style={styles.retryButtonImage} />
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
    backgroundColor: 'rgba(8, 41, 63, 0.75)', // Semi-transparent color overlay
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
    top: '8%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: -30,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  lienQRContainer: {
    marginBottom: 50,
  },
  lienQR: {
    width: 234,
    height: 245,
  },
  cameraContainer: {
    width: '80%',
    height: '30%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  rectangleImage: {
    width: '100%',
    height: 189,
  },
  footerContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: -70,
    width: '100%',
    position: 'relative',
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 59,
    height: 59,
    marginBottom: 10,
  },
  circleText: {
    marginLeft: -40,
    marginBottom: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputButtonContainer: {
    flexDirection: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: 334,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    color: 'black',
  },
  button: {
    width: 334,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  popup: {
    position: 'absolute',
    bottom: 100,
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  popupSubtitle: {
    fontSize: 14,
    color: 'black',
    marginBottom: 20,
  },
  retryButton: {
    width: '100%',
    alignItems: 'center',
  },
  retryButtonImage: {
    width: 150,
    height: 50,
  },
});

export default QRScanScreen;
