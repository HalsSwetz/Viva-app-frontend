import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAuthToken } from '../services/authStorage'; 

const backendUrl = 'https://viva-api-server-8920686ec75a.herokuapp.com/';

export default function PreferencesScreen({ navigation }) {
  const [inputValues, setInputValues] = useState({
    artist: '',
    sportsTeam: '',
    venue: '',
    location: '',
    entertainmentGenre: '',
    sportsGenre: '',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [authToken, setAuthToken] = useState(null); // Store the token locally in state

  useEffect(() => {
    // Fetch the token when the component mounts
    const fetchToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
    };
    
    fetchToken();
  }, []);

  const searchTicketmaster = async (field, value) => {
    setActiveField(field);
    setInputValues({ ...inputValues, [field]: value });

    if (value.length < 2) return setSuggestions([]);

    try {
      const res = await fetch(`${backendUrl}/api/events?query=${value}`);
      const data = await res.json();

      const results = data.map((item) => ({
        id: item.id,
        name: item.name,
        type: field,
      }));

      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectSuggestion = (item) => {
    const newPref = {
      type: activeField,
      value: item.name,
      tmId: item.id,
    };

    setPreferences([...preferences, newPref]);
    setSuggestions([]);
    setInputValues({ ...inputValues, [activeField]: '' });

    Alert.alert('Added', `"${item.name}" has been added to your preferences`);
  };

  const handleSubmitPreferences = async () => {
    if (!authToken) {
      Alert.alert('Error', 'You need to be logged in to save preferences');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/preferences/update-preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error('Failed to update preferences');

      Alert.alert('Success', 'Preferences saved!');
      navigation.navigate('HomeFeed'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save preferences');
    }
  };

  const fields = [
    { key: 'artist', placeholder: 'Add Music Artist/Band' },
    { key: 'sportsTeam', placeholder: 'Add Sports Team' },
    { key: 'venue', placeholder: 'Add Venue' },
    { key: 'location', placeholder: 'Add Location (City)' },
    { key: 'entertainmentGenre', placeholder: 'Add Entertainment Genre' },
    { key: 'sportsGenre', placeholder: 'Add Sports Genre' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you love?</Text>

      {fields.map((field) => (
        <TextInput
          key={field.key}
          placeholder={field.placeholder}
          placeholderTextColor="#ccc"
          style={styles.input}
          value={inputValues[field.key]}
          onChangeText={(value) => searchTicketmaster(field.key, value)}
        />
      ))}

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmitPreferences}>
        <Text style={styles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Playfair',
    marginBottom: 16,
  },
  input: {
    height: 48,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
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
  button: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});