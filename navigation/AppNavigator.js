import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import AppEducationScreen from '../screens/Onboarding/AppEducationScreen';
import UserDetailScreen from '../screens/Onboarding/UserDetailScreen';
import PaymentInfoScreen from '../screens/Onboarding/PaymentInfoScreen';
import PreferencesScreen from '../screens/Onboarding/PreferencesScreen';
import { AuthContext } from '../context/AuthContext'; // 👈 import

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { authToken } = useContext(AuthContext); // 👈 use context

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authToken ? (
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