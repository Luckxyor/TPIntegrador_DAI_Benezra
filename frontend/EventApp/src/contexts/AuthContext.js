import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { getToken, setToken, removeToken } from '../services/api';

// Función para obtener datos del usuario de forma segura según la plataforma
const getUserData = async () => {
  try {
    if (Platform.OS === 'web') {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } else {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    }
  } catch (error) {
    console.warn('Error getting user data:', error);
    return null;
  }
};

// Función para guardar datos del usuario de forma segura según la plataforma
const setUserData = async (userData) => {
  try {
    const userDataString = JSON.stringify(userData);
    if (Platform.OS === 'web') {
      localStorage.setItem('userData', userDataString);
    } else {
      await SecureStore.setItemAsync('userData', userDataString);
    }
  } catch (error) {
    console.warn('Error setting user data:', error);
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await getToken();
      const userData = await getUserData();
      
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      await setToken(response.token);
      await setUserData(response.user);
      
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      await setToken(response.token);
      await setUserData(response.user);
      
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
