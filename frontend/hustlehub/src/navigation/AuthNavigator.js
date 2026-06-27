import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  EmailVerificationScreen,
  StudentIDUploadScreen,
  FaceVerificationScreen,
  VerificationSuccessScreen,
  ForgotPasswordScreen,
} from '../screens/auth';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="StudentIDUpload" component={StudentIDUploadScreen} />
      <Stack.Screen name="FaceVerification" component={FaceVerificationScreen} />
      <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
