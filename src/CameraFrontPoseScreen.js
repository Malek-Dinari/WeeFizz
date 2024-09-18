import React, { useEffect, useState, useMemo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Text, ActivityIndicator, Platform } from 'react-native';
import { Camera, useFrameProcessor, getCameraDevice } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useNavigation, useRoute } from '@react-navigation/native';



function tensorToString(tensor) {
  return `${tensor.dataType} [${tensor.shape}]`;
}


const CameraFrontPoseScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const [indicatorSource, setIndicatorSource] = useState(require('../assets/orangelight.png'));
  const navigation = useNavigation();
  const route = useRoute();
  const { gender, height, weight, hunit, wunit, comfort, selectedMorphology, selectedOption, productUrl } = route.params;

  const devices = Camera.getAvailableCameraDevices();
  const device = selectedOption === 'seul' ? getCameraDevice(devices, 'front') : getCameraDevice(devices, 'back');


  const plugin = useTensorflowModel(require('../assets/lite-model-movenet-singlepose-lightning-tflite-int8-4.tflite'));
  
  const model = plugin.state === 'loaded' ? plugin.model : undefined;


  const pixelFormat = Platform.OS === 'ios' ? 'rgb' : 'yuv';


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
    
    if (model?.inputs && model?.outputs) {
  console.log(
    `Model: ${model.inputs.map(tensorToString)} -> ${model.outputs.map(
      tensorToString,
    )}`
  );
}

  }, [plugin]);

  const inputTensor = plugin.model?.inputs[0];
  const inputWidth = inputTensor?.shape[1] ?? 0;
  const inputHeight = inputTensor?.shape[2] ?? 0;
  if (inputTensor != null) {
    console.log(
      `Input: ${inputTensor.dataType} ${inputWidth} x ${inputHeight}`,
    );
  }

  const resize = useResizePlugin();


  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    if (model) {
      try {
        
        const resized = resize(frame, 192, 192);
        const outputs = model.runSync([resized]);
        const keypoints = outputs[0];

        if (keypoints && keypoints.length > 0) {
          const keypointNames = ['nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear', 'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];
          const keypointMap = keypoints.reduce((map, kpt) => {
            map[kpt.name] = kpt;
            return map;
          }, {});

          let PoseIsCorrect = true;
          for (const name of keypointNames) {
            if (!keypointMap[name]) {
              PoseIsCorrect = false;
              break;
            }
          }

          const shoulderDistance = Math.abs(keypointMap['left_shoulder'].x - keypointMap['right_shoulder'].x);
          const hipDistance = Math.abs(keypointMap['left_hip'].x - keypointMap['right_hip'].x);
          const wristToShoulderThreshold = 0.2;

          const leftWristDistance = Math.abs(keypointMap['left_wrist'].x - keypointMap['left_shoulder'].x);
          const rightWristDistance = Math.abs(keypointMap['right_wrist'].x - keypointMap['right_shoulder'].x);

          const wristsAreClose = leftWristDistance < wristToShoulderThreshold && rightWristDistance < wristToShoulderThreshold;

          PoseIsCorrect = wristsAreClose && shoulderDistance > 0.1 && hipDistance > 0.1;

          setIsPoseCorrect(PoseIsCorrect);
          setIndicatorSource(PoseIsCorrect ? require('../assets/greenlight.png') : require('../assets/orangelight.png'));
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      }
    }
  }, [model]);



  const handleCapture = async () => {
    try {
      if (device.current && isPoseCorrect) {
        const photo = await device.current.takePhoto({ quality: 0.85, base64: true });
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
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={styles.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
        pixelFormat={pixelFormat}
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
