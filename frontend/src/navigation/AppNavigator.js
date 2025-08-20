import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // O un componente de loading
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
