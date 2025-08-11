import axios from 'axios';
import { Platform } from 'react-native';

// Preferir EXPO_PUBLIC_API_URL para que funcione en bundling
const envBase = process.env.EXPO_PUBLIC_API_URL;
const defaultBase = Platform.select({ android: 'http://10.0.2.2:3000', ios: 'http://localhost:3000', default: 'http://localhost:3000' });
export const apiBaseURL = envBase || defaultBase!;

export const apiClient = axios.create({ baseURL: apiBaseURL });

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
});


