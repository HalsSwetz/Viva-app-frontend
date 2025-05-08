import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message'; 
import { toastConfig } from './utils/toastConfig';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';

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
      >
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
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