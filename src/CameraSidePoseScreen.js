import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const CameraSidePoseScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, frontposePhoto, productUrl } = route.params;

  const detectorRef = useRef(null);
  const devices = useCameraDevices();
  const device = selectedOption === 'seul' ? devices.front : devices.back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();

    (async () => {
      await tf.ready();
      detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    })();
  }, []);

  const frameProcessor = useFrameProcessor(async (frame) => {
    if (!detectorRef.current) return;

    const { width, height, data } = frame;
    const imageData = tf.tensor3d(new Uint8Array(data), [height, width, 3]);

    try {
      const poses = await detectorRef.current.estimatePoses(imageData, { flipHorizontal: false });
      if (poses && poses.length > 0) {
        const keypoints = poses[0].keypoints;
        const poseIsCorrect = checkPose(keypoints);
        setIsPoseCorrect(poseIsCorrect);
        setIndicatorSource(
          poseIsCorrect
            ? require('../assets/greenlight.png')
            : require('../assets/orangelight.png')
        );
      }
    } catch (error) {
      console.error('Error during pose detection:', error);
    } finally {
      imageData.dispose();
    }
  }, []);

  const checkPose = (keypoints) => {
    const keypointNames = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];
    const keypointMap = {};
    keypoints.forEach(k => keypointMap[k.name] = k);

    for (const name of keypointNames) {
      if (!keypointMap[name]) return false;
    }

    const shouldersAligned = Math.abs(keypointMap['left_shoulder'].y - keypointMap['right_shoulder'].y) < 0.1;
    const hipsAligned = Math.abs(keypointMap['left_hip'].y - keypointMap['right_hip'].y) < 0.1;
    const kneesAligned = Math.abs(keypointMap['left_knee'].y - keypointMap['right_knee'].y) < 0.1;
    const anklesAligned = Math.abs(keypointMap['left_ankle'].y - keypointMap['right_ankle'].y) < 0.1;

    return shouldersAligned && hipsAligned && kneesAligned && anklesAligned;
  };

  const handleCapture = async () => {
    if (cameraRef.current && isPoseCorrect) {
      const photo = await cameraRef.current.takePhoto({
        skipProcessing: true,
      });
      navigation.navigate('ValidationSidePoseScreen', {
        gender,
        height,
        hunit,
        weight,
        wunit,
        comfort,
        selectedMorphology,
        selectedOption,
        frontposePhoto, 
        sideposePhoto: photo.uri,
        productUrl,
      });
    }
  };

  if (!device) return <View><Text>Loading...</Text></View>;
  if (!hasPermission) return <View><Text>No access to camera</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
      />
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
              <Image source={require('../assets/position_text.png')} style={styles.rectangleImage} />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
