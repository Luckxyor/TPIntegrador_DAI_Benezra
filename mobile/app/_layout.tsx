import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

const queryClient = new QueryClient();

function RootNavigationGate({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, hasChecked } = useAuth();

  useEffect(() => {
    if (!hasChecked) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/events');
    }
  }, [segments, isAuthenticated, hasChecked]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigationGate>
          <Stack screenOptions={{ headerShown: false }} />
        </RootNavigationGate>
      </QueryClientProvider>
    </AuthProvider>
  );
}


