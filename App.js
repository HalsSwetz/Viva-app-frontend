import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Lato': require('./assets/fonts/Lato.ttf'),
      'Alike': require('./assets/fonts/Alike.ttf'),
      'Playfair': require('./assets/fonts/PlayfairDisplaySC.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}