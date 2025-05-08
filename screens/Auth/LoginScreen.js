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
import { useAuth } from '../../context/AuthContext'; // ✅ useAuth hook from context

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth(); // ✅ get signIn method from context
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
          await signIn(token); // ✅ this now stores token & updates navigation via context
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