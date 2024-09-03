import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';

import { NativeModules } from 'react-native';
const { PoseDetectorModuleSide } = NativeModules;

const CameraSidePoseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [hasPermission, setHasPermission] = useState(null);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = route.params.selectedOption === 'seul' ? devices.front : devices.back;

  // Route parameters
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, productUrl, frontposePhoto } = route.params;

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

        PoseDetectorModuleSide.processImage(base64Image).then(result => {
          if (result) {
            const poseIsCorrect = checkPose(result);
            setIsPoseCorrect(poseIsCorrect);
            setIndicatorSource(poseIsCorrect
              ? require('../assets/greenlight.png')
              : require('../assets/orangelight.png')
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
    const shoulderLevelThreshold = 0.1; // Adjust this threshold as necessary
    const kneeStraightThreshold = 0.1; // Adjust this threshold as necessary
    const ankleStraightThreshold = 0.1; // Adjust this threshold as necessary

    // The wrists should be close to the hips on the side facing the camera
    const wristToHipDistance = Math.abs(keypointMap['LEFT_WRIST'].x - keypointMap['LEFT_HIP'].x) < wristToHipDistanceThreshold
                            && Math.abs(keypointMap['RIGHT_WRIST'].x - keypointMap['RIGHT_HIP'].x) < wristToHipDistanceThreshold;

    // Shoulders should be level
    const shouldersAreLevel = Math.abs(keypointMap['LEFT_SHOULDER'].y - keypointMap['RIGHT_SHOULDER'].y) < shoulderLevelThreshold;

    // Knees and ankles should be straight and relatively aligned
    const kneesAreStraight = Math.abs(keypointMap['LEFT_KNEE'].x - keypointMap['RIGHT_KNEE'].x) < kneeStraightThreshold;
    const anklesAreStraight = Math.abs(keypointMap['LEFT_ANKLE'].x - keypointMap['RIGHT_ANKLE'].x) < ankleStraightThreshold;

    return wristToHipDistance && shouldersAreLevel && kneesAreStraight && anklesAreStraight;
  };

  const handleCapture = async () => {
    if (isPoseCorrect && cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          skipMetadata: true
        });

        navigation.navigate('ValidationSidePoseScreen', {
          gender,
          height,
          weight,
          hunit,
          wunit,
          comfort,
          selectedMorphology,
          selectedOption,
          productUrl,
          frontposePhoto,  // Pass the front pose photo URI
          sideposePhoto: photo.path // Pass the captured side pose photo URI
        });
      } catch (error) {
        console.error('Error capturing photo:', error);
      } finally {
        setLoading(false);
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <Button title="Capture Pose" onPress={handleCapture} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default CameraSidePoseScreen;
