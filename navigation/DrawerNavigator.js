import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import PreferencesScreen from '../screens/Onboarding/PreferencesScreen';
import MyEventsScreen from '../screens/Profile/MyEventsScreen';
import SavedEventsScreen from '../screens/Profile/SavedEventsScreen';
import MainTabNavigator from './MainTabNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        drawerStyle: { backgroundColor: '#000' },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#aaa',
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="options" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{
          title: 'My Events',
          drawerIcon: ({ color, size }) => <Ionicons name="ticket" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="SavedEvents"
        component={SavedEventsScreen}
        options={{
          title: 'Saved Events',
          drawerIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}