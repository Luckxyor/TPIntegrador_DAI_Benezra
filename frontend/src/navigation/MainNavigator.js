import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import EventsNavigator from './EventsNavigator';
import EventLocationsNavigator from './EventLocationsNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'EventsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'EventLocationsTab') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="EventsTab" 
        component={EventsNavigator}
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen 
        name="EventLocationsTab" 
        component={EventLocationsNavigator}
        options={{ title: 'Ubicaciones' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
