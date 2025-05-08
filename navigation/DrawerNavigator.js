import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import ManagePreferences from '../screens/Profile/ManagePreferences';
import UserDetailScreen from '../screens/Onboarding/UserDetailScreen';
import PaymentInfoScreen from '../screens/Onboarding/PaymentInfoScreen';
import MyEventsScreen from '../screens/Profile/MyEventsScreen';
import SavedEventsScreen from '../screens/Profile/SavedEventsScreen';
import LogoutScreen from '../screens/Profile/Logout';
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
        component={UserDetailScreen}
        options={{
        drawerIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
    />
      <Drawer.Screen
        name="ManagePreferences"
        component={ManagePreferences}
        options={{
        title: 'Manage Preferences',
        drawerIcon: ({ color, size }) => <Ionicons name="build" color={color} size={size} />,
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
      <Drawer.Screen
        name="PaymentInfo"
        component={PaymentInfoScreen}
        options={{
        title: 'Payment Info',
        drawerIcon: ({ color, size }) => <Ionicons name="card" color={color} size={size} />,
        }}
    />
    <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
        title: 'Log Out',
        drawerIcon: ({ color, size }) => <Ionicons name="log-out" color={color} size={size} />,
    }}
    />
    </Drawer.Navigator>
  );
}