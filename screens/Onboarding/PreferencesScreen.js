import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { getAuthToken } from '../../services/authStorage';
import Toast from 'react-native-toast-message';

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

  const scoreItem = (item, query) => {
    const name = item.name.toLowerCase();
    const q = query.toLowerCase();
  
    let score = 0;
    if (name === q) score += 100;
    if (name.startsWith(q)) score += 40;
    if (name.includes(q)) score += 20;
    if (item.segment === 'sports' && item.type === 'artist') score += 25;
    if (item.segment === 'music') score += 15;
    if (item.segment === 'sports') score += 10;
    if (item.type === 'artist') score += 10;
    if (item.type === 'venue') score += 5;
    if (name.includes(' vs ')) score -= 20;
  
    return score;
  };
  
  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.length < 2) return setSuggestions([]);
  
      try {
        const types = ['artist', 'venue', 'genre', 'city'];
        const res = await fetch(
          `${backendUrl}/api/events?query=${encodeURIComponent(value)}&types=${types.join(',')}`
        );
        const rawData = await res.json();
        // console.log('Raw Data:', rawData);
  
        const unique = [];
        const seen = new Set();
        for (let item of rawData) {
          const key = `${item.name}|${item.type}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
  
        const scored = unique
          .filter((item) => item.name && item.name.length > 2)
          .map(item => ({ ...item, _score: scoreItem(item, value) }))
          .sort((a, b) => b._score - a._score);
  
        const cleaned = scored.filter(item => item.type !== 'genre'); // Exclude genres
  
        setSuggestions(cleaned);
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
      (pref) => pref.value === item.name && pref.type === item.type
    );
    if (exists) {
      Toast.show({
        type: 'info',
        text1: `"${item.name}" is already in your preferences`,
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }
  
    const newPref = {
      type: item.type,
      value: item.name,
      tmId: item.id,
    };
  
    setPreferences([...preferences, newPref]);
    setSuggestions([]);
    setSearchQuery('');
  
    Toast.show({
      type: 'success',
      text1: `"${item.name}" added`,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };
  
  const handleSubmitPreferences = async () => {
    if (!authToken) {
      Toast.show({
        type: 'error',
        text1: 'You need to be logged in to save preferences',
        position: 'bottom',
        visibilityTime: 2000,
      });
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
  
      Toast.show({
        type: 'success',
        text1: 'Saved Successfully',
        position: 'bottom',
        visibilityTime: 2000,
      });
  
      setTimeout(() => {
        navigation.navigate('UserDetail');
      }, 2000);
  
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Could not save preferences',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const formatItemLabel = (item) => {
    const base = item.name;
    const type = item.type;
    const segment = item.segment;
  
    if (type === 'city') {
      return `${base} [City]`; 
    }
    if (segment === 'sports' && type === 'artist') return `${base} [Sports Team]`;
    if (type === 'venue' && item.city) return `${base} [Venue – ${item.city}]`; 
    if (type === 'genre') return null; 
    return `${base} [${capitalize(type)}]`;
  };

  const renderItem = ({ item }) => {
    if (!item.name) return null;
    const label = formatItemLabel(item);
    if (!label) return null; 
    return (
      <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestion}>
        <Text style={styles.suggestionText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoiding}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => `${item.type}-${item.id}`}
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
                  Try searching for: artist, sports team, venue, location, keyword...
                </Text>
                <TextInput
                  placeholder="Search and Add..."
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={handleInputChange}
                  returnKeyType="done"
                  onFocus={() => {
                    setSuggestions([]); 
                  }}
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
  
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('UserDetail')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
  
            <View style={styles.stepperContainer}>
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[styles.dot, step === 1 && styles.activeDot]}
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
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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