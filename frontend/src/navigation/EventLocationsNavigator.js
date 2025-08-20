import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EventLocationsScreen from '../screens/EventLocationsScreen';
import CreateEventLocationScreen from '../screens/CreateEventLocationScreen';

const Stack = createStackNavigator();

export default function EventLocationsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="EventLocationsList" 
        component={EventLocationsScreen}
        options={{ title: 'Ubicaciones de Eventos' }}
      />
      <Stack.Screen 
        name="CreateEventLocation" 
        component={CreateEventLocationScreen}
        options={{ title: 'Crear Ubicación' }}
      />
    </Stack.Navigator>
  );
}
