import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/v-logo-1.png')} 
          style={styles.logo} 
        />
      </View>
      
      {/* App Name and Tagline */}
      <View style={styles.textContainer}>
        <Text style={styles.appName}>VIVA</Text>
        <Text style={styles.tagline}>Go Do More</Text>
      </View>
      
      {/* Input Fields */}
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        keyboardType="email-address" 
        placeholderTextColor="#ccc"
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        placeholderTextColor="#ccc"
      />
      
      {/* Log In Button */}
      <TouchableOpacity style={styles.buttonContainer}>
        <Button 
          title="Log In" 
          onPress={() => {}} 
          color="#007aff"
        />
      </TouchableOpacity>
      
      {/* Sign Up Link */}
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
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
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    // Removed borderRadius to eliminate circular background
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 28, // slightly less to move up a bit
  },
  appName: {
    fontSize: 40,
    color: '#fff',
    fontFamily: 'Lato', // try 'Alike', 'Playfair', etc.
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
    fontFamily: 'Lato', // consistent font (or swap in others)
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
});