import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, setAuthToken } from '../api/client';

type UserPayload = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
};

type AuthContextValue = {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  hasChecked: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync('auth_token');
        const storedUser = await SecureStore.getItemAsync('auth_user');
        if (stored) {
          setToken(stored);
          setAuthToken(stored);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setHasChecked(true);
      }
    })();
  }, []);

  const login: AuthContextValue['login'] = async ({ username, password }) => {
    try {
      const res = await apiClient.post('/api/user/login', { username, password });
      if (res.data?.success && res.data?.token) {
        const token = res.data.token as string;
        setToken(token);
        setAuthToken(token);
        await SecureStore.setItemAsync('auth_token', token);
        // Backend no devuelve el usuario, pero el token incluye payload; lo omitimos para simpleza
        const fakeUser = { id: 0, first_name: '', last_name: '', username };
        setUser(fakeUser);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(fakeUser));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token, hasChecked, login, logout }),
    [user, token, hasChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


