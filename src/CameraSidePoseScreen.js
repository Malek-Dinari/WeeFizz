import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Camera, getCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { calculateDistance } from './distanceUtils'; // Assuming you have a utility for distance calculation
import { getBestFormat } from './formatFilter';

const LINE_WIDTH = 5;
const VIEW_WIDTH = Dimensions.get('screen').width;
const POSITION_TEXTE_WIDTH = 389;
const POSITION_TEXTE_HEIGHT = 132;

function tensorToString(tensor) {
  return `${tensor.dataType} [${tensor.shape}]`;
}

const CameraSidePoseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const poseDetected = useSharedValue(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    gender,
    height,
    weight,
    hunit,
    wunit,
    comfort,
    selectedMorphology,
    selectedOption,
    frontposePhoto,
    productUrl
  } = route.params;

  const devices = Camera.getAvailableCameraDevices();
  const device = selectedOption === 'seul' ? getCameraDevice(devices, 'side') : getCameraDevice(devices, 'back');

  const plugin = useTensorflowModel(require('../assets/lite-model-movenet-singlepose-lightning-tflite-int8-4.tflite'));
  const model = plugin.state === "loaded" ? plugin.model : undefined;

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const permissionStatus = await Camera.requestCameraPermission();
        setHasPermission(permissionStatus !== 'denied');
      } catch (error) {
        console.error('Permission error:', error.message);
      }
    };

    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (model) {
      console.log(`Model: ${model.inputs.map(tensorToString)} -> ${model.outputs.map(tensorToString)}`);
    }
  }, [model]);

  const resize = useResizePlugin();
  const rotation = Platform.OS === 'ios' ? '0deg' : '270deg';

  const format = useMemo(
    () => (device ? getBestFormat(device, 480, 6400) : undefined),
    [device]
  );

  const SCALE = (format?.videoWidth ?? VIEW_WIDTH) / VIEW_WIDTH;

  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Stroke);
  paint.setColor(Skia.Color('green'));
  paint.setStrokeWidth(LINE_WIDTH * SCALE);

  const lines = [
    [5, 6], [6, 7], [7, 8], // Example lines connecting keypoints (shoulders and elbows)
    [11, 12], [12, 13], [13, 14], // Example lines connecting keypoints (knees and ankles)
    [11, 5], [12, 6], [13, 7], // More example lines for additional connections
    [5, 7], [6, 8], [7, 9], // Connect shoulders to hips, etc.
  ];

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`);

      if (plugin.model) {
        try {
          const resizedFrame = resize(frame, { scale: { width: 192, height: 192 }, pixelFormat: 'rgb', dataType: 'uint8', rotation });
          const outputs = plugin.model.runSync([resizedFrame]);
          const keypoints = outputs[0];

          console.log(`Keypoints: ${keypoints}`);

          // Draw lines on frame
          lines.forEach(([start, end]) => {
            const from = keypoints[start];
            const to = keypoints[end];
            if (from && to && from[2] > 0.5 && to[2] > 0.5) {
              frame.drawLine(
                from[1] * frame.width,
                from[0] * frame.height,
                to[1] * frame.width,
                to[0] * frame.height,
                paint
              );
            }
          });

          // Pose validation logic
          const validatePose = () => {
            if (keypoints.length === 0) return false;

            // Adjust validation logic based on side pose
            const shoulderToElbowLeft = calculateDistance(keypoints[5], keypoints[6]);
            const shoulderToElbowRight = calculateDistance(keypoints[2], keypoints[3]);
            const shoulderToHipLeft = calculateDistance(keypoints[11], keypoints[5]);
            const shoulderToHipRight = calculateDistance(keypoints[12], keypoints[2]);

            return shoulderToElbowLeft < 100 && shoulderToElbowRight < 100 && shoulderToHipLeft < 150 && shoulderToHipRight < 150;
          };

          const isPoseValid = validatePose();
          poseDetected.value = isPoseValid;
          setIndicatorSource(isPoseValid ? require('../assets/greenlight.png') : require('../assets/orangelight.png'));

          if (isPoseValid) {
            handleCapture();
          }
        } catch (error) {
          console.error('Error processing frame:', error);
        }
      }
    },
    []
  );

  const handleCapture = async () => {
    try {
      if (poseDetected && device) {
        const photo = await device.takePhoto({ quality: 0.85, base64: true });
        navigation.navigate('ValidationSidePoseScreen', {
          gender,
          height,
          weight,
          hunit,
          wunit,
          comfort,
          selectedMorphology,
          selectedOption,
          frontposePhoto,
          sideposePhoto: photo.uri,
          productUrl,
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: poseDetected.value ? 1 : 0.5,
    };
  });

  if (hasPermission === null) {
    return <View style={styles.centered}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.centered}><Text>No access to camera</Text></View>;
  }
  if (!device) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/leftarrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.speakerButton}>
          <Image source={require('../assets/sound_on_speaker.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={indicatorSource} style={[styles.indicatorImage, { top: 90 }]} />
        {poseDetected.value && (
          <View style={styles.centerContent}>
            <Image source={require('../assets/justeunmoment.png')} style={styles.momentImage} />
            <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
          </View>
        )}
        <View style={styles.bottomRectangle}>
          <TouchableOpacity onPress={handleCapture}>
            <Image
              source={require('../assets/position_texte.png')}
              style={styles.rectangleImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  speakerButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  indicatorImage: {
    width: 60,
    height: 60,
  },
  momentImage: {
    width: 200,
    height: 100,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  bottomRectangle: {
    position: 'absolute',
    bottom: 30,
    justifyContent: 'center',
    marginBottom: 30,
  },
  rectangleImage: {
    width: POSITION_TEXTE_WIDTH,
    height: POSITION_TEXTE_HEIGHT,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraSidePoseScreen;
