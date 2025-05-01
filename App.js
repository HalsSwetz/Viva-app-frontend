import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message'; 
import { toastConfig } from './utils/toastConfig';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import AppEducationScreen from './screens/Onboarding/AppEducationScreen';
import HomeFeedScreen from './screens/Feed/HomeFeedScreen';
import UserDetailScreen from './screens/Onboarding/UserDetailScreen';
import PaymentInfoScreen from './screens/Onboarding/PaymentInfoScreen';
import PreferencesScreen from './screens/Onboarding/PreferencesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Lato': require('./assets/fonts/Lato.ttf'),
      'Alike': require('./assets/fonts/Alike.ttf'),
      'Playfair': require('./assets/fonts/Playfair.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StripeProvider
        publishableKey="pk_test_51RGRFpFFS1DQslf2dpYdJvzrmKArhNgzEjqn4Cv1jyqfCU2QLp69vTyWwF4VT0G2huQ28OiiwgLA5hD0T4QEIimd00V1ZQ15cH" 
        merchantIdentifier="merchant.com.yourapp.identifier" // optional for Apple Pay later
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AppEducation" component={AppEducationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeFeed" component={HomeFeedScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});