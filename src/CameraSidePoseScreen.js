import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { Camera, useFrameProcessor, useCameraDevices } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as tf from '@tensorflow/tfjs';

const CameraSidePoseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, frontposePhoto, productUrl } = route.params;

  const devices = useCameraDevices();
  const device = selectedOption === 'seul' ? devices.front : devices.back;

  // Load the pose detection model
  const poseDetection = useTensorflowModel(require('../assets/lite-model-movenet-singlepose-lightning-tflite-int8-4.tflite'));
  const model = poseDetection.state === 'loaded' ? poseDetection.model : undefined;

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  // Custom resizing function (instead of using the vision-camera resize plugin)
  const resizeImage = (frame, targetWidth, targetHeight) => {
    const aspectRatio = frame.width / frame.height;
    const width = targetWidth;
    const height = targetWidth / aspectRatio;
    
    // Resize logic, adapt pixel data
    return tf.tidy(() => {
      const tensor = tf.tensor(new Uint8Array(frame.data), [frame.height, frame.width, 3]);
      const resized = tf.image.resizeBilinear(tensor, [targetHeight, targetWidth]);
      return resized;
    });
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!model) return;

    // Resize the frame to match the input size for the model
    const resizedFrame = resizeImage(frame, 192, 192);

    // Run the model
    const outputs = model.runSync([resizedFrame]);

    // Assuming output is a list of keypoints (adjust if needed)
    const keypoints = outputs[0];

    if (keypoints && keypoints.length > 0) {
      const poseIsCorrect = checkPose(keypoints);
      setIsPoseCorrect(poseIsCorrect);
      setIndicatorSource(
        poseIsCorrect
          ? require('../assets/greenlight.png')
          : require('../assets/orangelight.png')
      );
    }
  }, [model]);

  // Check if the front pose is correct using 17 COCO keypoints
  const checkPose = (keypoints) => {
    const keypointNames = [
      'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
      'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist',
      'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
    ];

    const keypointMap = {};
    keypoints.forEach(k => keypointMap[k.name] = k);

    // Check if all necessary keypoints exist
    for (const name of keypointNames) {
      if (!keypointMap[name]) return false;
    }

    // Example logic: Checking if the body posture is symmetric and upright
    const shoulderAlignmentThreshold = 0.1;
    const hipAlignmentThreshold = 0.1;

    const leftShoulderToHipDistance = Math.abs(keypointMap['left_shoulder'].y - keypointMap['left_hip'].y);
    const rightShoulderToHipDistance = Math.abs(keypointMap['right_shoulder'].y - keypointMap['right_hip'].y);
    const shouldersAligned = Math.abs(keypointMap['left_shoulder'].x - keypointMap['right_shoulder'].x) < shoulderAlignmentThreshold;
    const hipsAligned = Math.abs(keypointMap['left_hip'].x - keypointMap['right_hip'].x) < hipAlignmentThreshold;

    return shouldersAligned && hipsAligned;
  };

  const handleCapture = async () => {
    try {
      if (cameraRef.current && isPoseCorrect) {
        const photo = await cameraRef.current.takePhoto({ quality: 0.85, base64: true });
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
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={false}
        frameProcessor={frameProcessor}
        frameProcessorFps={20}
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

export default CameraSidePoseScreen;
