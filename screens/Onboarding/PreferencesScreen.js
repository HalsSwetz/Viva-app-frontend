import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { getAuthToken } from '../../services/authStorage';

const backendUrl = 'https://viva-api-server-8920686ec75a.herokuapp.com';

export default function PreferencesScreen({ navigation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
    };
    fetchToken();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.length < 2) return setSuggestions([]);

      try {
        const res = await fetch(`${backendUrl}/api/events?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        const results = data.map((item) => ({
          id: item.id,
          name: item.name,
          type: 'event',
        }));
        setSuggestions(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 500),
    []
  );

  const handleInputChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSelectSuggestion = (item) => {
    const exists = preferences.some(
      (pref) => pref.value === item.name && pref.type === 'event'
    );
    if (exists) {
      Alert.alert('Already Added', `"${item.name}" is already in your preferences`);
      return;
    }

    const newPref = {
      type: 'event',
      value: item.name,
      tmId: item.id,
    };

    setPreferences([...preferences, newPref]);
    setSuggestions([]);
    setSearchQuery('');
    Alert.alert('Added', `"${item.name}" has been added to your preferences`);
  };

  const handleSubmitPreferences = async () => {
    if (!authToken) {
      Alert.alert('Error', 'You need to be logged in to save preferences');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/preferences/update-preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error('Failed to update preferences');

      Alert.alert('Success', 'Preferences saved!');
      navigation.navigate('PersonalBillingInfo');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save preferences');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestion}>
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoiding}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <View>
                <Image
                  source={require('../../assets/v-logo-1.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Add Some Favorites to Customize Your Experience</Text>
                <Text style={styles.helperText}>
                  Try searching for: artist, sports team, venue, location, genre...
                </Text>
                <TextInput
                  placeholder="Search and Add..."
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={handleInputChange}
                  returnKeyType="done"
                  onFocus={() => setSearchQuery('')}
                />
              </View>
            }
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.button} onPress={handleSubmitPreferences}>
              <Text style={styles.buttonText}>Save Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('PersonalBillingInfo')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>

            <View style={styles.stepperContainer}>
              {[1, 2, 3, 4, 5].map((step) => (
                <View
                  key={step}
                  style={[styles.dot, step === 3 && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 140,
    height: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Alike',
    textAlign: 'center',
    marginBottom: 32,
  },
  helperText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  input: {
    height: 48,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
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