import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { getAuthToken } from '../../services/authStorage';
import Toast from 'react-native-toast-message';
import { debounce } from 'lodash'; // Import lodash's debounce function

const backendUrl = 'https://viva-api-server-8920686ec75a.herokuapp.com';

export default function HomeFeedScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Fetch the initial feed of events
  useEffect(() => {
    fetchInitialFeed();
  }, []);

  useEffect(() => {
    // Handle search filtering on change of the search query
    if (searchQuery.trim() === '') {
      setFilteredEvents(events); // If no search query, show all events
    } else {
      // Filter events based on the search query (case-insensitive)
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const fetchInitialFeed = async () => {
    let token;
  
    try {
      token = await getAuthToken();
      console.log('User Token:', token);
    } catch (err) {
      console.error('Failed to get auth token:', err);
      Toast.show({ type: 'error', text1: 'Authentication failed' });
      setLoading(false);
      return;
    }
  
    try {
      const prefRes = await fetch(`${backendUrl}/api/preferences/preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!prefRes.ok) throw new Error(`Preferences fetch failed: ${prefRes.status}`);
  
      const prefs = await prefRes.json();
    //   console.log('Fetched preferences:', prefs);
  
      if (!Array.isArray(prefs)) {
        throw new Error('Preferences response is not an array');
      }
  
      setHasPreferences(prefs.length > 0);
    } catch (err) {
      console.error('Error loading preferences:', err);
      Toast.show({ type: 'error', text1: 'Failed to load preferences' });
      setLoading(false);
      return; // stop further fetching
    }
  
    try {
      await fetchEvents(token, 1);
    } catch (err) {
      console.error('Error loading events:', err);
      Toast.show({ type: 'error', text1: 'Failed to load feed' });
    } finally {
      setLoading(false);
    }
  };
  const fetchEvents = async (token, pageNum) => {
    try {
      console.log(`[Frontend] Fetching events: Page ${pageNum}`);
  
      const res = await fetch(`${backendUrl}/api/events/feed?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Frontend] Event fetch failed: ${res.status} - ${errorText}`);
        throw new Error('Failed to fetch events');
      }
  
      const data = await res.json();
    //   console.log(`[Frontend] Events received (count: ${data.length}):`, data);
  
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setEvents(prev => [...prev, ...data]);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('[Frontend] Pagination fetch error:', err);
      Toast.show({ type: 'error', text1: 'Failed to load more events' });
    }
  };
  const loadMoreEvents = () => {
    if (!hasMore || loading) return;
    getAuthToken().then(token => fetchEvents(token, page + 1));
  };

  const renderEventCard = ({ item }) => {
    const isSaved = savedEventIds.includes(item.id);

    console.log(`Event: ${item.name}, Date: ${item.date}, Price: ${item.price || 'N/A'}, Location: ${item.venue || 'N/A'}`);

    return (
      <View style={styles.card}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={{ height: 160, borderRadius: 8, marginBottom: 10 }}
            resizeMode="cover"
          />
        )}
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventMeta}>{item.date} @ {item.venue}</Text>
        <TouchableOpacity onPress={() => toggleSaveEvent(item.id)} style={{ marginTop: 8 }}>
          <Text style={{ color: isSaved ? '#ff4081' : '#888' }}>
            {isSaved ? '💖 Saved' : '🤍 Save'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const toggleSaveEvent = async (eventId) => {
    try {
      const token = await getAuthToken();
      const isSaved = savedEventIds.includes(eventId);
  
      const res = await fetch(`${backendUrl}/api/events/${eventId}/${isSaved ? 'unsave' : 'save'}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) throw new Error('Save failed');
  
      setSavedEventIds((prev) =>
        isSaved ? prev.filter(id => id !== eventId) : [...prev, eventId]
      );
    } catch (err) {
      console.error('Save toggle failed:', err);
      Toast.show({ type: 'error', text1: 'Error saving event' });
    }
  };

  // Debounced search handler to avoid too many requests while typing
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500), // 500ms delay after typing stops
    []
  );

  return (
    <View style={styles.container}>
      {/* Optional banner */}
      {!hasPreferences && (
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('ManagePreferences')}
        >
          <Text style={styles.bannerText}>Add Favorites to Customize Your Feed!</Text>
        </TouchableOpacity>
      )}

      {/* Search bar */}
      <TextInput
        placeholder="Search your feed..."
        placeholderTextColor="#ccc"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch} // Use debounced search
      />

      {/* Feed */}
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          data={filteredEvents} // Use filtered events here
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  banner: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bannerText: {
    color: '#fff',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventMeta: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
});