import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import FeedStackNavigator from './FeedStackNavigator'; // Import the new stack
import NearbyFeedScreen from '../screens/Feed/NearbyFeedScreen';
import SearchScreen from '../screens/Feed/SearchScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ navigation }) {
  const renderHamburger = (nav) => ({
    headerLeft: () => (
      <TouchableOpacity onPress={() => nav.openDrawer()} style={{ paddingLeft: 15 }}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    ),
    headerStyle: { backgroundColor: '#000' },
    headerTintColor: '#fff',
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Nearby') iconName = 'globe';
          else if (route.name === 'Search') iconName = 'search';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        headerShown: true, 
      })}
    >
      <Tab.Screen
        name="Home"
        component={FeedStackNavigator} 
        options={({ navigation }) => renderHamburger(navigation)}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyFeedScreen}
        options={({ navigation }) => renderHamburger(navigation)}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => renderHamburger(navigation)}
      />
    </Tab.Navigator>
  );
}