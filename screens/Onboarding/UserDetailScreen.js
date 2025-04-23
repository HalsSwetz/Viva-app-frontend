import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserDetailScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleContinue = () => {
    // Eventually send this to backend or pass to context/store
    navigation.navigate('PaymentInfo');
  };

  return (
    <View style={styles.container}>
      {/* Header and Subtext */}
      <Text style={styles.header}>Tell us about you</Text>
      <Text style={styles.subtext}>
        We use this info to make one-tap ticket purchases possible.
      </Text>

      {/* Input Fields */}
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Address" 
        placeholderTextColor="#ccc"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Zip Code" 
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={zipCode}
        onChangeText={setZipCode}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number" 
        placeholderTextColor="#ccc"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Date of Birth (MM/DD/YYYY)" 
        placeholderTextColor="#ccc"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} color="#007aff" />
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('PaymentInfo')} 
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
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    color: '#00bcd4',
  },
});