import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

import { NativeModules } from 'react-native';
const { PoseDetectionModule } = NativeModules;

const CameraFrontPoseScreen = ({ route, navigation }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [hasPermission, setHasPermission] = useState(null);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../../assets/orangelight.png'));
  const cameraRef = useRef(null);
  const isFocused = useIsFocused(); // Check if screen is focused
  const devices = useCameraDevices();
  const device = devices.front;

  // Get parameters from previous screen
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, productUrl } = route.params;

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermission();
        setHasPermission(cameraPermission === 'authorized');
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    if (cameraRef.current) {
      const interval = setInterval(() => {
        handlePoseDetection();
      }, 1000); // Detect pose every second

      return () => clearInterval(interval);
    }
  }, [isFocused]);

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  const handlePoseDetection = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          skipMetadata: true
        });

        const base64Image = await fetch(photo.path).then(res => res.blob()).then(blob => blob.arrayBuffer()).then(buffer => Buffer.from(buffer).toString('base64'));

        PoseDetectionModule.detectPose(base64Image).then(result => {
          if (result) {
            const poseIsCorrect = checkPose(result);
            setIsPoseCorrect(poseIsCorrect);
            setIndicatorSource(poseIsCorrect 
              ? require('../../assets/greenlight.png')
              : require('../../assets/orangelight.png')
            );
          }
        }).catch(error => {
          console.error('Error during pose detection:', error);
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const checkPose = (poseData) => {
    const keypointNames = ['LEFT_WRIST', 'RIGHT_WRIST', 'LEFT_HIP', 'RIGHT_HIP', 'LEFT_SHOULDER', 'RIGHT_SHOULDER', 'LEFT_KNEE', 'RIGHT_KNEE', 'LEFT_ANKLE', 'RIGHT_ANKLE'];
    const keypointMap = {};

    keypointNames.forEach(name => {
      if (poseData[name]) {
        keypointMap[name] = poseData[name];
      }
    });

    // Ensure all required keypoints are present
    if (Object.keys(keypointMap).length < keypointNames.length) return false;

    // Pose validation logic
    const wristToHipDistanceThreshold = 0.1; // Adjust this threshold as necessary
    const shouldersLevelThreshold = 0.1; // Adjust this threshold as necessary
    const kneeDistanceThreshold = 0.1; // Adjust this threshold as necessary
    const ankleDistanceThreshold = 0.1; // Adjust this threshold as necessary

    const leftWristToHipDistance = Math.abs(keypointMap['LEFT_WRIST'].x - keypointMap['LEFT_HIP'].x);
    const rightWristToHipDistance = Math.abs(keypointMap['RIGHT_WRIST'].x - keypointMap['RIGHT_HIP'].x);
    const wristsAreToTheSide = leftWristToHipDistance < wristToHipDistanceThreshold && rightWristToHipDistance < wristToHipDistanceThreshold;

    const shouldersAreLevel = Math.abs(keypointMap['LEFT_SHOULDER'].y - keypointMap['RIGHT_SHOULDER'].y) < shouldersLevelThreshold;

    const kneesAreClose = Math.abs(keypointMap['LEFT_KNEE'].x - keypointMap['RIGHT_KNEE'].x) < kneeDistanceThreshold;
    const anklesAreClose = Math.abs(keypointMap['LEFT_ANKLE'].x - keypointMap['RIGHT_ANKLE'].x) < ankleDistanceThreshold;

    return wristsAreToTheSide && shouldersAreLevel && kneesAreClose && anklesAreClose;
  };

  const handleCapture = async () => {
    if (isPoseCorrect && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          skipMetadata: true
        });

        navigation.navigate('ValidationFrontPoseSelection', {
          gender,
          height,
          weight,
          hunit,
          wunit,
          comfort,
          selectedMorphology,
          selectedOption,
          productUrl,
          photoUri: photo.path // Pass the captured photo URI
        });
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {device && (
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={isFocused}
          frameProcessor={frame => handlePoseDetection(frame)}
          frameProcessorFps={1} // Process frames at 1 FPS
        />
      )}
      <Image source={indicatorSource} style={{ width: 100, height: 100 }} />
      <Button title="Capture" onPress={handleCapture} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      top: 70, // 30 units below the speaker icon
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