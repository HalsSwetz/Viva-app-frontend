import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAuthToken } from '../../services/authStorage'; // For getting the token
import axios from 'axios';

const ManagePreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = await getAuthToken(); // Get auth token
        const response = await axios.get(`${backendUrl}/api/preferences`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setPreferences(response.data);
      } catch (err) {
        console.error('Error fetching preferences', err);
        setError('Failed to load preferences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleRemovePreference = async (tmId) => {
    try {
      const token = await getAuthToken();
      await axios.patch(
        '/api/preferences/update-preferences',
        {
          preferences: [
            {
              tmId,
              remove: true,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPreferences((prevPreferences) =>
        prevPreferences.filter((pref) => pref.tmId !== tmId)
      );
    } catch (err) {
      console.error('Error removing preference', err);
      setError('Failed to remove preference.');
    }
  };

  const handleAddPreference = async (newPref) => {
    try {
      const token = await getAuthToken();
      await axios.patch(
        '/api/preferences/update-preferences',
        {
          preferences: [
            {
              tmId: newPref.tmId,
              type: newPref.type,
              value: newPref.value,
              remove: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPreferences((prevPreferences) => [...prevPreferences, newPref]);
    } catch (err) {
      console.error('Error adding preference', err);
      setError('Failed to add preference.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>Manage Your Preferences</Text>
      <FlatList
        data={preferences}
        keyExtractor={(item) => item.tmId}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text>{item.value}</Text>
            <TouchableOpacity onPress={() => handleRemovePreference(item.tmId)}>
              <Text style={{ color: 'red', marginLeft: 10 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Example button to add a preference manually */}
      <Button
        title="Add New Preference"
        onPress={() => handleAddPreference({ tmId: 'new-tm-id', type: 'genre', value: 'Jazz' })}
      />
    </View>
  );
};

export default ManagePreferences;