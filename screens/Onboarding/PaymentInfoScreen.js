import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import api from '../../services/api';
import { getAuthToken } from '../../services/authStorage';


export default function PaymentInfoScreen({ navigation }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { confirmSetupIntent } = useStripe();

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const token = await getAuthToken();
        const response = await api.get('/api/stripe/setup-intent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Failed to fetch SetupIntent:', error);
        Toast.show({
          type: 'error',
          text1: 'Error initializing payment',
          text2: error.message,
        });
      }
    };

    fetchSetupIntent();
  }, []);

  const handleSave = async () => {
    if (!clientSecret || !cardComplete) {
      Toast.show({
        type: 'error',
        text1: 'Card info incomplete',
      });
      return;
    }

    setLoading(true);
    try {
      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        console.error('Stripe error:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to save card',
          text2: error.message,
        });
      } else if (setupIntent) {
        Toast.show({
          type: 'success',
          text1: 'Card Info Added',
        });
        setTimeout(() => navigation.navigate('Preferences'), 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Toast.show({
        type: 'error',
        text1: 'Unexpected error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 40 : 80}
      showsVerticalScrollIndicator={false}
    >
      <Image source={require('../../assets/v-logo-1.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Add Payment Info</Text>
      <Text style={styles.helperText}>
        We utilize Stripe services to enable you to make one-click ticket purchases in the app.
      </Text>

      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#1a1a1a',
          textColor: '#fff',
        }}
        style={styles.cardField}
        onCardChange={(cardDetails) => {
          setCardComplete(cardDetails.complete);
        }}
      />

      <Image
        source={require('../../assets/Stripe-white-wordmark.png')}
        style={styles.stripeLogo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Info</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Preferences')} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <View style={styles.stepperContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={[styles.dot, step === 3 && styles.activeDot]} />
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  logo: { width: 140, height: 60, marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontFamily: 'Alike', textAlign: 'center', marginBottom: 12 },
  helperText: { color: '#fff', textAlign: 'center', fontSize: 14, marginBottom: 24 },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  stripeLogo: { width: 80, height: 32, marginBottom: 24, opacity: 0.9 },
  buttonContainer: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  skipContainer: { marginTop: 12, alignItems: 'center' },
  skipText: { color: '#888', textDecorationLine: 'underline', fontSize: 14 },
  stepperContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#fff' },
});