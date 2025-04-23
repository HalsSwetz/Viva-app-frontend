import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function PaymentInfoScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');

  const handleContinue = () => {
    // Future: Call backend to create/update Stripe customer
    navigation.navigate('Preferences');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Info</Text>
      <Text style={styles.subtext}>Add your card so you're ready for one-tap ticketing.</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        keyboardType="number-pad"
        value={expiry}
        onChangeText={setExpiry}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="CVC"
        keyboardType="number-pad"
        value={cvc}
        onChangeText={setCvc}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Zip Code"
        keyboardType="numeric"
        value={zip}
        onChangeText={setZip}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} color="#007aff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Preferences')}
        style={styles.skipContainer}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair',
  },
  subtext: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 24,
    fontFamily: 'Alike',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  skipContainer: {
    position: 'absolute',
    right: 24,
    bottom: 32,
  },
  skipText: {
    fontSize: 14,
    color: '#007aff',
  },
});