import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

export default function PaymentInfoScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');

  const handleSave = () => {
    // Simulate success toast — replace this with Stripe backend logic later
    Toast.show({
      type: 'success',
      text1: 'Card Info Added',
      position: 'bottom',
      visibilityTime: 2000,
    });

    setTimeout(() => {
      navigation.navigate('Preferences');
    }, 2000);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 40 : 80}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/v-logo-1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Add Payment Info</Text>
      <Text style={styles.helperText}>
        We utilize Stripe services to enable you to make one-click ticket purchases in the app.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        placeholderTextColor="#ccc"
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        placeholderTextColor="#ccc"
        keyboardType="number-pad"
        value={expiry}
        onChangeText={setExpiry}
      />
      <TextInput
        style={styles.input}
        placeholder="CVC"
        placeholderTextColor="#ccc"
        keyboardType="number-pad"
        value={cvc}
        onChangeText={setCvc}
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Zip Code"
        placeholderTextColor="#ccc"
        keyboardType="number-pad"
        value={zip}
        onChangeText={setZip}
        maxLength={5}
      />

      <Image
        source={require('../../assets/Stripe-white-wordmark.png')} // make sure this asset exists
        style={styles.stripeLogo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Info</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Preferences')} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <View style={styles.stepperContainer}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[styles.dot, step === 3 && styles.activeDot]}
          />
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
  logo: {
    width: 140,
    height: 60,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Alike',
    textAlign: 'center',
    marginBottom: 12,
  },
  helperText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  stripeLogo: {
    width: 80,
    height: 32,
    marginBottom: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});