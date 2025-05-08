import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getAuthToken } from '../../services/authStorage'; // For getting the token

const SavedEventsScreen = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get('/api/saved-events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedEvents(response.data);
      } catch (err) {
        console.error('Error fetching saved events', err);
        setError('Failed to load saved events.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleRemoveSavedEvent = async (eventId) => {
    try {
      const token = await getAuthToken();
      await axios.delete(`/api/saved-events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedEvents((prevEvents) => prevEvents.filter((event) => event.event.id !== eventId));
    } catch (err) {
      console.error('Error removing saved event', err);
      setError('Failed to remove saved event.');
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
      <Text>Saved Events</Text>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.event.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text>{item.event.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveSavedEvent(item.event.id)}>
              <Text style={{ color: 'red', marginLeft: 10 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SavedEventsScreen;