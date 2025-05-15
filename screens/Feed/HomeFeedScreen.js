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
  RefreshControl,
} from 'react-native';
import { getAuthToken } from '../../services/authStorage';
import Toast from 'react-native-toast-message';
import { debounce } from 'lodash';

const backendUrl = 'https://viva-api-server-8920686ec75a.herokuapp.com';

export default function HomeFeedScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialFeed();
  }, []);

  useEffect(() => {
    const filtered = searchQuery.trim()
      ? events.filter((event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : events;
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const fetchInitialFeed = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      await fetchPreferences(token);
      await fetchEvents(token, 1, true);
    } catch (err) {
      console.error('Initial feed load failed:', err);
      Toast.show({ type: 'error', text1: 'Failed to load feed' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async (token) => {
    const res = await fetch(`${backendUrl}/api/preferences/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prefs = await res.json();
    setHasPreferences(Array.isArray(prefs) && prefs.length > 0);
  };

  const fetchEvents = async (token, pageNum, reset = false) => {
    const res = await fetch(`${backendUrl}/api/events/feed?page=${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      setHasMore(false);
      return;
    }

    const newEvents = data.filter((event) => !events.find((e) => e.id === event.id));
    const updated = reset ? newEvents : [...events, ...newEvents];
    const sorted = updated.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sorted);
    setPage(pageNum);
  };

  const loadMoreEvents = async () => {
    if (!hasMore || isFetchingMore || loading) return;
    setIsFetchingMore(true);
    try {
      const token = await getAuthToken();
      await fetchEvents(token, page + 1);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to load more events' });
    } finally {
      setIsFetchingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await getAuthToken();
      setHasMore(true);
      await fetchEvents(token, 1, true);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Refresh failed' });
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSaveEvent = async (eventId) => {
    try {
      const token = await getAuthToken();
      const isSaved = savedEventIds.includes(eventId);
      const url = `${backendUrl}/api/events/${eventId}/${isSaved ? 'unsave' : 'save'}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Save toggle failed');

      setSavedEventIds((prev) =>
        isSaved ? prev.filter((id) => id !== eventId) : [...prev, eventId]
      );
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error saving event' });
    }
  };

  const handleSearch = useCallback(
    debounce((query) => setSearchQuery(query), 400),
    []
  );

  const renderEventCard = ({ item }) => {
    const isSaved = savedEventIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('EventDetails', { event: item })}
        style={styles.card}
      >
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        <View style={styles.cardContent}>
          <Text style={styles.eventTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.eventMeta}>
            {item.date} • {item.venue || 'Unknown venue'}
          </Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>🎟 {item.priceRange || 'Tbd'}</Text>
            <Text style={styles.tag}>📍 {item.city || 'Unknown'}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleSaveEvent(item.id)} style={styles.saveBtn}>
            <Text style={{ color: isSaved ? '#ff4081' : '#999' }}>
              {isSaved ? '💖 Saved' : '🤍 Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {!hasPreferences && (
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('ManagePreferences')}
        >
          <Text style={styles.bannerText}>🎯 Add Favorites to Customize Your Feed!</Text>
        </TouchableOpacity>
      )}

      <TextInput
        placeholder="Search your feed..."
        placeholderTextColor="#ccc"
        style={styles.searchInput}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 50 }} />
      ) : filteredEvents.length === 0 ? (
        <Text style={styles.emptyText}>
          No events found. Try adjusting your preferences or search.
        </Text>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator color="#555" style={{ margin: 10 }} /> : null
          }
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
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
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
  tags: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  tag: {
    color: '#bbb',
    fontSize: 12,
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});