import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LandingScreen from '../screens/LandingScreen';
import SignUp_Step2 from '../screens/auth/SignUp_Step2';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({current, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="Login" component={SignInScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen 
        name="signupStep2" 
        component={SignUp_Step2}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;