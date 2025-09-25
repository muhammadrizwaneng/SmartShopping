import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from './NavigationService';
import AppState from '../models/reducers';
// import WelcomeScreen from '../screens/WelcomeSreen';
// import Onboarding from '../screens/Onboarding';
// import HomeScreen from '../screens/LandingScreen';
// import SignUpScreen from '../screens/auth/SignUpScreen';
// import SignInScreen from '../screens/auth/SignInScreen';
// import ExploreScreen from '../screens/ExploreScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import ProductOrderScreen from '../screens/ProductOrderScreen';
import AuthNavigation from './AuthNavigation';
import MainNavigator from './MainNavigation';


export default () => {
  // const routeNameRef = useRef();
  // const user = useSelector((state: AppState) => state.user);
  const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
  // const isWelcomed = useSelector((state: AppState) => state.user.isWelcome);

  const Stack = createNativeStackNavigator();

  // const dim = Dimensions.get('screen');
  // const processingDeeplink = false;

  // const [isLoading, setIsLoading] = useState(true);
  // const guestEmail = useSelector((state: AppState) => state.sso.email);
  // var isGuest = false;
  // const userId = useSelector((state: AppState) => state.user._id);
  // const message = useSelector((state: AppState) => state.snackBar.message);
  // const style = useSelector((state: AppState) => state.snackBar.style);
  // const source = {
  //   html: message,
  // };
  // const isVisibleSnackBar = useSelector(
  //   (state: AppState) => state.snackBar.isVisible,
  // );

  // const dispatch = useDispatch();
  // const onDismissSnackBar = () => {
  //   dispatch(disableSnackBar());
  // };

  // useEffect(() => {
  //   AsyncStorage.getItem('token')
  //     .then((token) => {
  //       if (!token) {
  //       }
  //     })
  //     .catch((error) => {

  //     });

  // }, [isLoggedIn]);

  // useEffect(() => {
  //   dispatch(disableLoading());

  //   if (isVisibleSnackBar) {
  //     setTimeout(() => {
  //       dispatch(disableSnackBar());
  //     }, 5000);
  //   }
  // }, [isVisibleSnackBar]);

  // const baseStyle: MixedStyleDeclaration = {
  //   color: '#000000',
  //   fontFamily: 'Poppins-Medium',
  //   fontSize: 12,
  // };

  // useEffect(() => {
  //   // Simulate a loading process
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, []);


  // const linking = {
  //   prefixes: [
  //     "saveseecard://",
  //     'https://nextjs-blog-five-mauve-28.vercel.app',
  //     'saveseecard://saveCard'
  //   ],
  //   config: {
  //     screens: {
  //       saveCard: {
  //         path: 'saveCard/:id?',
  //         parse: {
  //           id: (id: String) => `${id}`,
  //         },
  //       },
  //     },
  //   },
  // };


  return (
    <>
      <NavigationContainer ref={navigationRef} >
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isLoggedIn ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ):(
            <Stack.Screen name="Auth" component={AuthNavigation} />
          )}
              {/* <Stack.Screen
            name='Onboarding'
            component={Onboarding}
          />
         <Stack.Screen
              name='LandingScreen'
              component={HomeScreen}
            />
          <Stack.Screen
              name='WelcomeScreen'
              component={WelcomeScreen}
            />
            <Stack.Screen
              name='Signup'
              component={SignUpScreen}
            />
            <Stack.Screen
              name='SignIn'
              component={SignInScreen}
            />
            <Stack.Screen
              name='Explore'
              component={ExploreScreen}
            />
            <Stack.Screen
              name='profile'
              component={ProfileScreen}
            />
            <Stack.Screen
              name='ProductOrderScreen'
              component={ProductOrderScreen}
            /> */}
          {/* {isLoading ? ( 
            <Stack.Screen
              name='LandingScreen'
              component={LandingScreen}
              options={{ headerShown: false }}
            />
          ) : isLoggedIn && isWelcomed == false ? (
            <Stack.Screen
              name='MainStackNavigator'
              component={DrawerNavigator}
              options={{ headerShown: false }}

            />
          ) : (
            <Stack.Screen
              name='AuthNavigation'
              component={AuthNavigation}
              options={{ headerShown: false }}
            />
          )} */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
