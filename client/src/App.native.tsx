import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './mobile/navigation/AppNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </QueryClientProvider>
  );
}
