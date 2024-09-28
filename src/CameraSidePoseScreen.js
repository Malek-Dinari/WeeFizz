import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Camera, useFrameProcessor } from 'react-native-vision-camera';
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { runOnJS } from 'react-native-reanimated';

const CameraFrontPoseScreen = () => {
  const [model, setModel] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [device, setDevice] = useState(null); // To be handled by device selector logic

  useEffect(() => {
    const setup = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();

      if (cameraPermission === 'authorized' && microphonePermission === 'authorized') {
        setHasPermission(true);
      }

      await tf.ready();
      const posenetModel = await posenet.load();
      setModel(posenetModel);
    };

    setup();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    runOnJS(detectPose)(frame);
  }, [model]);

  const detectPose = async (frame) => {
    if (!model) return;

    const imageTensor = frameToTensor(frame);
    const pose = await model.estimateSinglePose(imageTensor, {
      flipHorizontal: false,
    });

    console.log(pose); // You can visualize or use the pose here
    imageTensor.dispose();
  };

  const frameToTensor = (frame) => {
    const { width, height, data } = frame;
    return tf.tensor3d(data, [height, width, 3]);
  };

  if (!hasPermission || !device) {
    return <Text>Requesting Permissions...</Text>;
  }

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={10}
    />
  );
};

export default CameraFrontPoseScreen;
