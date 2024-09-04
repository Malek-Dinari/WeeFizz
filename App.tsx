import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NoProductScreen from './src/NoProductScreen';
import QRScanScreen from './src/QRScanScreen';
import QRScanWithCameraScreen from './src/QRScanWithCameraScreen';
import SplashScreen from './src/SplashScreen';
import WelcomeScreen from './src/WelcomeScreen';
import CGUScreen from './src/CGUScreen';
import TermsConditionsScreenScreen from './src/TermsConditionsScreen';
import SexSelectionScreen from './src/SexSelectionScreen';
import SizeSelectionScreen from './src/SizeSelectionScreen';
import WeightSelectionScreen from './src/WeightSelectionScreen';
import ComfortSelectionScreen from './src/ComfortSelectionScreen';
import BodyMorphologySelectionScreen from './src/BodyMorphologySelectionScreen';
import ScanMethodSelectionScreen from './src/ScanMethodSelectionScreen';
import Tuto1Screen from './src/Tuto1Screen';
import Tuto2Screen from './src/Tuto2Screen';
import Tuto3Screen from './src/Tuto3Screen';
import CameraFrontPoseScreen from './src/CameraFrontPoseScreen';
import ValidationFrontPoseScreen from './src/ValidationFrontPoseScreen';
import CameraSidePoseScreen from './src/CameraSidePoseScreen';
import ValidationSidePoseScreen from './src/ValidationSidePoseScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QRScanScreen">  {/* Set QRScanScreen as the initial screen */}
        <Stack.Screen 
          name="QRScanScreen" 
          component={QRScanScreen} 
          options={{ headerShown: false }} // Hide header if needed
        />
        <Stack.Screen 
          name="NoProductScreen" 
          component={NoProductScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="QRScanWithCameraScreen" 
        component={QRScanWithCameraScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="WelcomeScreen" 
        component={WelcomeScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CGUScreen" 
          component={CGUScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="TermsConditionsScreenScreen" 
          component={TermsConditionsScreenScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="SexSelectionScreen" 
        component={SexSelectionScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="SizeSelectionScreen" 
        component={SizeSelectionScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="WeightSelectionScreen" 
        component={WeightSelectionScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ComfortSelectionScreen" 
          component={ComfortSelectionScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BodyMorphologySelectionScreen" 
          component={BodyMorphologySelectionScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ScanMethodSelectionScreen" 
          component={ScanMethodSelectionScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Tuto1Screen" 
          component={Tuto1Screen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Tuto2Screen" 
          component={Tuto2Screen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Tuto3Screen" 
          component={Tuto3Screen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CameraFrontPoseScreen" 
          component={CameraFrontPoseScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ValidationFrontPoseScreen" 
          component={ValidationFrontPoseScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CameraSidePoseScreen" 
          component={CameraSidePoseScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ValidationSidePoseScreen" 
          component={ValidationSidePoseScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
