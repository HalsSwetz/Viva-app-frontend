import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import AppEducationScreen from '../screens/Onboarding/AppEducationScreen';
import UserDetailScreen from '../screens/Onboarding/UserDetailScreen';
import PaymentInfoScreen from '../screens/Onboarding/PaymentInfoScreen';
import PreferencesScreen from '../screens/Onboarding/PreferencesScreen';
import { getAuthToken } from '../services/authStorage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getAuthToken();
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) return null; // Loading splash screen placeholder

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="AppEducation" component={AppEducationScreen} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}