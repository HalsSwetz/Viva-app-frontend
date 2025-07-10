import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeFeedScreen from '../screens/Feed/HomeFeedScreen';
import EventDetailsScreen from '../screens/Feed/EventDetailsScreen';

const Stack = createNativeStackNavigator();

export default function FeedStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,  
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="HomeFeed"
        component={HomeFeedScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
    </Stack.Navigator>
  );
}