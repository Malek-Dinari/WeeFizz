import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { Camera, useFrameProcessor, useCameraDevices } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useNavigation, useRoute } from '@react-navigation/native';

const CameraFrontPoseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, productUrl } = route.params;

  const devices = useCameraDevices();
  const device = selectedOption === 'seul' ? devices.front : devices.back;

  const { resize } = useResizePlugin();
  const poseDetection = useTensorflowModel(require('../assets/blazepose-detector.tflite'));

  const model = poseDetection.state === 'loaded' ? poseDetection.model : undefined;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!model) return;

    // 1. Resize frame to the input size of the model
    const resizedFrame = resize(frame, {
      scale: {
        width: 192, // adjust this based on your model input size
        height: 192,
      },
      pixelFormat: 'rgb',
      dataType: 'uint8',
    });

    // 2. Run the model with the resized frame
    const outputs = model.runSync([resizedFrame]);

    // 3. Interpret the outputs
    const poses = outputs[0]; // Assume output is in this format, you will need to adjust this

    if (poses && poses.length > 0) {
      const keypoints = poses; // Adjust based on your model's output
      const poseIsCorrect = checkPose(keypoints);
      setIsPoseCorrect(poseIsCorrect);
      setIndicatorSource(
        poseIsCorrect
          ? require('../assets/greenlight.png')
          : require('../assets/orangelight.png')
      );
    }
  }, [model]);

  const checkPose = (keypoints) => {
    // Replace with your pose validation logic using keypoints
    const keypointNames = ['left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_shoulder', 'right_shoulder', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];
    const keypointMap = {};

    // Assuming keypoints are provided as a list of objects with `name` and `coordinates`
    keypoints.forEach(k => keypointMap[k.name] = k);

    for (const name of keypointNames) {
      if (!keypointMap[name]) return false;
    }

    // Implement your specific pose validation logic here
    // Example:
    const wristToHipDistanceThreshold = 0.1;
    const shouldersLevelThreshold = 0.1;
    const kneeDistanceThreshold = 0.1;
    const ankleDistanceThreshold = 0.1;

    const leftWristToHipDistance = Math.abs(keypointMap['left_wrist'].x - keypointMap['left_hip'].x);
    const rightWristToHipDistance = Math.abs(keypointMap['right_wrist'].x - keypointMap['right_hip'].x);
    const wristsAreToTheSide = leftWristToHipDistance < wristToHipDistanceThreshold && rightWristToHipDistance < wristToHipDistanceThreshold;

    const shouldersAreLevel = Math.abs(keypointMap['left_shoulder'].y - keypointMap['right_shoulder'].y) < shouldersLevelThreshold;
    const kneesAreClose = Math.abs(keypointMap['left_knee'].x - keypointMap['right_knee'].x) < kneeDistanceThreshold;
    const anklesAreClose = Math.abs(keypointMap['left_ankle'].x - keypointMap['right_ankle'].x) < ankleDistanceThreshold;

    return wristsAreToTheSide && shouldersAreLevel && kneesAreClose && anklesAreClose;
  };

  const handleCapture = async () => {
    try {
      if (cameraRef.current && isPoseCorrect) {
        const photo = await cameraRef.current.takePhoto({ quality: 0.85, base64: true });
        navigation.navigate('ValidationFrontPoseScreen', {
          gender,
          height,
          weight,
          hunit,
          wunit,
          comfort,
          selectedMorphology,
          selectedOption,
          productUrl,
          frontposePhoto: photo.uri,
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  if (!device) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/leftarrow.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.speakerButton}>
            <Image source={require('../assets/sound_on_speaker.png')} style={styles.icon} />
          </TouchableOpacity>
          <Image source={indicatorSource} style={styles.indicatorImage} />
          {isPoseCorrect && (
            <View style={styles.bottomRectangle}>
              <TouchableOpacity onPress={handleCapture}>
                <Image source={require('../assets/position_texte.png')} style={styles.rectangleImage} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  speakerButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  indicatorImage: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: 38,
    height: 136,
  },
  bottomRectangle: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  rectangleImage: {
    width: 334,
    height: 50,
    borderRadius: 25,
  },
});

export default CameraFrontPoseScreen;
