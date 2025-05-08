import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { getAuthToken } from '../../services/authStorage'; // For getting the token

const MyEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get('/api/my-events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events', err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchEvents();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>My Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.event.name}</Text>
            <Text>{item.event.date}</Text>
            <Text>{item.event.venue.name}</Text>
          </View>
        )}
      />
      <Button title="Refresh Events" onPress={handleRefresh} />
    </View>
  );
};

export default MyEventsScreen;