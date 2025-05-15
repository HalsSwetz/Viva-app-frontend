import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // <-- import the hook

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth(); // <-- get login method from context

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          await login(token);  // <-- update context state and storage
          // No need to navigate manually; navigation reacts to authToken state change
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Login failed: ' + (err.response?.data?.message || err.message));
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
            <Button title="Log In" onPress={handleLogin} color="#00bcd4" />
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Don’t have an account? Sign up
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