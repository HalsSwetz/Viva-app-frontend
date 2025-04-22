import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your Viva account</Text>
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry />
      <Button title="Sign Up" onPress={() => {}} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log in
      </Text>
    </View>
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
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  link: {
    color: '#00bcd4',
    marginTop: 16,
  },
});