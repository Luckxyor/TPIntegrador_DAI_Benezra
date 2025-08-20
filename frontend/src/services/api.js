import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/apiConfig';

// Función para obtener el token de forma segura según la plataforma
const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      return localStorage.getItem('userToken');
    } else {
      // En móvil, usar SecureStore
      return await SecureStore.getItemAsync('userToken');
    }
  } catch (error) {
    console.warn('Error getting token:', error);
    return null;
  }
};

// Función para guardar el token de forma segura según la plataforma
const setToken = async (token) => {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      localStorage.setItem('userToken', token);
    } else {
      // En móvil, usar SecureStore
      await SecureStore.setItemAsync('userToken', token);
    }
  } catch (error) {
    console.warn('Error setting token:', error);
  }
};

// Función para eliminar el token de forma segura según la plataforma
const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      // En web, usar localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    } else {
      // En móvil, usar SecureStore
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    }
  } catch (error) {
    console.warn('Error removing token:', error);
  }
};

class APIService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(async (config) => {
      const token = await getToken();
      console.log('API request interceptor - token exists:', !!token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API request interceptor - Authorization header set');
      } else {
        console.log('API request interceptor - No token found');
      }
      return config;
    });

    // Interceptor para manejar respuestas
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          await removeToken();
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint, params = {}) {
    const response = await this.api.get(endpoint, { params });
    return response.data;
  }

  async post(endpoint, data = {}) {
    const response = await this.api.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data = {}) {
    const response = await this.api.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await this.api.delete(endpoint);
    return response.data;
  }
}

export { getToken, setToken, removeToken };
export default new APIService();
