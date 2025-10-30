import React, { useEffect, useState } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserInfo } from '../redux/userSlice';

import AuthNavigation from './AuthNavigation';
import MainNavigator from './MainNavigation';

// Create navigation reference
export const navigationRef = React.createRef();

// Add this type for your root state
type RootState = {
  auth: {
    isLoggedIn: boolean;
    userInfo: any;
    token: string | null;
    loading: boolean;
  };
};

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  // Check for existing token and user data on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData?.token) {
            dispatch(setUserInfo({
              userInfo: parsedData.user,
              token: parsedData.token,
              isLoggedIn: true
            }));
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;