import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuthToken } from '../../services/authStorage';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

export default function UserDetailScreen({ navigation }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSave = async () => {
    const token = await getAuthToken();
  
    if (!token) {
      Alert.alert('Error', 'You must be logged in to save your info.');
      return;
    }
  
    const [month, day, year] = dateOfBirth.split('/');
    const parsedDOB = new Date(`${year}-${month}-${day}`);
    const isValidDOB = !isNaN(parsedDOB.getTime());
  
    if (!isValidDOB) {
      Alert.alert('Invalid Date', 'Please enter a valid date of birth.');
      return;
    }
  
    const formattedDOB = parsedDOB.toISOString().split('T')[0];
  
    try {
      const response = await fetch('https://viva-api-server-8920686ec75a.herokuapp.com/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          address,
          zipCode,
          dateOfBirth: formattedDOB,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to save user info');
  
      Toast.show({
        type: 'success',
        text1: 'Saved Successfully',
        position: 'bottom',
        visibilityTime: 2000,
      });
  
      setTimeout(() => {
        navigation.navigate('PaymentInfo');
      }, 2000); 
    } catch (err) {
      console.error('Error saving info:', err);
      Alert.alert('Error', 'Could not save your information');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 40 : 80} // scroll buffer
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/v-logo-1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Personal Info (should match Billing Info)</Text>
      <Text style={styles.helperText}>
        This info is not shared, and is gathered to enable the addition of your payment
        preference and one-click ticket purchases in the app.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#ccc"
        value={address}
        onChangeText={setAddress}
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={zipCode}
        onChangeText={setZipCode}
        maxLength={5}
        returnKeyType="next"
      />
      <TextInputMask
        type={'custom'}
        options={{ mask: '(999) 999-9999' }}
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#ccc"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        returnKeyType="next"
      />
      <TextInputMask
        type={'datetime'}
        options={{ format: 'MM/DD/YYYY' }}
        style={styles.input}
        placeholder="Date of Birth (MM/DD/YYYY)"
        placeholderTextColor="#ccc"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        keyboardType="numeric"
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Info</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PaymentInfo')} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <View style={styles.stepperContainer}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[styles.dot, step === 2 && styles.activeDot]}
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