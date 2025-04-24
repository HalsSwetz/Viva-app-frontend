import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import api from '../../services/api';
import { storeAuthToken } from '../../services/authStorage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response.status === 200) {
        const { token } = response.data;

        if (token) {
          await storeAuthToken(token);
          navigation.navigate('HomeFeed');
        } else {
          setError('No token returned. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/v-logo-1.png')} style={styles.logo} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.appName}>VIVA</Text>
            <Text style={styles.tagline}>Discover it → Book it → Be there</Text>
          </View>

          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            placeholderTextColor="#ccc"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            placeholderTextColor="#ccc"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.buttonContainer}>
            <Button title="Log In" onPress={handleLogin} color="#007aff" />
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Don't have an account? Sign up
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 70,
    padding: 5,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 50,
    letterSpacing: 8,
    color: '#fff',
    fontFamily: 'Playfair',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 1,
    marginBottom: 5,
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
    marginBottom: 16,
  },
  link: {
    color: '#00bcd4',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});