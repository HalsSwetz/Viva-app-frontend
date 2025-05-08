import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import axios from 'axios';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/events?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Search events"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.type}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;